import { Prisma } from '@prisma/client';
import Ajv from 'ajv';
import { prisma } from '@src/config';
import {
  BusinessSchema,
  validateCreateBusiness,
  validateUpdateBusiness
} from './business.schema';

const ajv = new Ajv();

type BusinessOptions = {
  include?: Prisma.BusinessInclude;
};

export const getBusinessById = async <T extends BusinessOptions>(
  id: string,
  options?: T
) => {
  const business = await prisma.business.findFirst({
    where: { id },
    include: options?.include
  });

  if (!business) {
    throw new Error('Business not found');
  }

  return business as Prisma.BusinessGetPayload<T>;
};

export const doesBusinessExist = async (id: string) => {
  const business = await prisma.business.findFirst({
    where: {
      id
    }
  });

  return !!business;
};

export const createBusiness = async <T extends BusinessOptions>(
  data: BusinessSchema,
  options?: T
) => {
  const isValid = validateCreateBusiness(data);

  if (!isValid) {
    throw new Error(
      'Error creating business, ' +
        ajv.errorsText(validateCreateBusiness.errors)
    );
  }

  const business = await prisma.business.create({
    data,
    include: options?.include
  });

  return business as Prisma.BusinessGetPayload<T>;
};

export const updateBusiness = async <T extends BusinessOptions>(
  id: string,
  data: Partial<BusinessSchema>,
  options?: T
) => {
  const isValid = validateUpdateBusiness(data);

  if (!isValid) {
    throw new Error(
      'Error updating business, ' +
        ajv.errorsText(validateUpdateBusiness.errors)
    );
  }

  const businessExists = await doesBusinessExist(id);
  if (!businessExists) {
    throw new Error('Business not found');
  }

  const business = await prisma.business.update({
    where: { id },
    data,
    include: options?.include
  });

  return business as Prisma.BusinessGetPayload<T>;
};
