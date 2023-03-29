import { CaseStatus, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import Ajv from 'ajv';
import { prisma } from '@src/config';
import {
  CaseCreateInput,
  CaseUpdateInput,
  validateCreateCase,
  validateUpdateCase
} from './case.schema';

dayjs.extend(utcPlugin);

const ajv = new Ajv();

type CaseOptions = {
  include?: Prisma.CaseInclude;
};

export const getCaseById = async <T extends CaseOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const result = await prisma.case.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null
    },
    include: options?.include
  });

  if (!result) {
    throw new Error('Case not found');
  }

  return result as Prisma.CaseGetPayload<T>;
};

export const doesCaseExist = async (businessId: string, id: string) => {
  try {
    await getCaseById(businessId, id);
  } catch (_error) {
    return false;
  }

  return true;
};

export const getCases = async <
  T extends CaseOptions & {
    filter?: Prisma.CaseWhereInput;
  }
>(
  businessId: string,
  options?: T
) => {
  const cases = await prisma.case.findMany({
    where: {
      businessId,
      deletedAt: null,
      ...options?.filter
    },
    include: options?.include
  });

  return cases as Prisma.CaseGetPayload<T>[];
};

export const createCase = async <T extends CaseOptions>(
  businessId: string,
  data: CaseCreateInput,
  options?: T
) => {
  const isValid = validateCreateCase(data);

  if (!isValid) {
    throw new Error(
      'Error creating case, ' + ajv.errorsText(validateCreateCase.errors)
    );
  }

  const result = await prisma.case.create({
    data: {
      ...data,
      businessId,
      status: CaseStatus.OPEN
    },
    include: options?.include
  });

  return result as Prisma.CaseGetPayload<T>;
};

export const updateCase = async <T extends CaseOptions>(
  businessId: string,
  id: string,
  data: CaseUpdateInput,
  options?: T
) => {
  const isValid = validateUpdateCase(data);

  if (!isValid) {
    throw new Error(
      'Error updating case, ' + ajv.errorsText(validateCreateCase.errors)
    );
  }

  const result = await prisma.case.update({
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

  return result as Prisma.CaseGetPayload<T>;
};

export const deleteCase = async <T extends CaseOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const doesExist = await doesCaseExist(businessId, id);

  if (!doesExist) {
    throw new Error('Case not found');
  }

  const result = await prisma.case.update({
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

  return result as Prisma.CaseGetPayload<T>;
};
