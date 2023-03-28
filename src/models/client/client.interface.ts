import { Prisma } from '@prisma/client';
import Ajv from 'ajv';
import { prisma } from '@src/config';
import {
  ClientCreateInput,
  ClientUpdateInput,
  validateCreateClient,
  validateUpdateClient
} from './client.schema';
import dayjs from 'dayjs';

const ajv = new Ajv();

type ClientOptions = {
  include?: Prisma.ClientInclude;
};

export const getClientById = async <T extends ClientOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const client = await prisma.client.findUnique({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    include: options?.include
  });

  if (!client) {
    throw new Error('Client not found');
  }

  return client as Prisma.ClientGetPayload<T>;
};

export const getClients = async <T extends ClientOptions>(
  businessId: string,
  options?: T
) => {
  const clients = await prisma.client.findMany({
    where: {
      businessId
    },
    include: options?.include
  });

  return clients as Prisma.ClientGetPayload<T>[];
};

export const doesClientExist = async (businessId: string, id: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id_businessId: {
        id,
        businessId
      }
    }
  });

  return !!client;
};

export const createClient = async <T extends ClientOptions>(
  businessId: string,
  data: ClientCreateInput,
  options?: T
) => {
  const isValid = validateCreateClient(data);

  if (!isValid) {
    throw new Error(
      'Error creating client, ' + ajv.errorsText(validateCreateClient.errors)
    );
  }

  const client = await prisma.client.create({
    data: {
      ...data,
      businessId
    },
    include: options?.include
  });

  return client as Prisma.ClientGetPayload<T>;
};

export const updateClient = async <T extends ClientOptions>(
  businessId: string,
  id: string,
  data: ClientUpdateInput,
  options?: T
) => {
  const isValid = validateUpdateClient(data);

  if (!isValid) {
    throw new Error(
      'Error updating client, ' + ajv.errorsText(validateUpdateClient.errors)
    );
  }

  const doesExist = await doesClientExist(businessId, id);

  if (!doesExist) {
    throw new Error('Client not found');
  }

  const client = await prisma.client.update({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    data: {
      ...data,
      businessId
    },
    include: options?.include
  });

  return client as Prisma.ClientGetPayload<T>;
};

export const terminateClient = async <T extends ClientOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const doesExist = await doesClientExist(businessId, id);

  if (!doesExist) {
    throw new Error('Client not found');
  }

  const client = await prisma.client.update({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    data: {
      deletedAt: dayjs().utc().format()
    },
    include: options?.include
  });

  return client as Prisma.ClientGetPayload<T>;
};
