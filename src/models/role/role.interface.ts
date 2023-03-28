import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import Ajv from 'ajv';
import { prisma } from '@src/config';
import {
  RoleSchema,
  validateCreateRole,
  validateUpdateRole
} from './role.schema';

dayjs.extend(utcPlugin);

const ajv = new Ajv();

type RoleOptions = {
  include?: Prisma.RoleInclude;
};

export const getRoleById = async <T extends RoleOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const role = await prisma.role.findFirst({
    where: {
      id,
      businessId,
      deletedAt: null
    },
    include: options?.include
  });

  if (!role) {
    throw new Error('Role not found');
  }

  return role as Prisma.RoleGetPayload<T>;
};

export const getRoles = async <T extends RoleOptions>(
  businessId: string,
  options?: T
) => {
  const roles = await prisma.role.findMany({
    where: {
      businessId,
      deletedAt: null
    },
    include: options?.include
  });

  return roles as Prisma.RoleGetPayload<T>[];
};

export const createRole = async <T extends RoleOptions>(
  businessId: string,
  data: RoleSchema,
  options?: T
) => {
  const isValid = validateCreateRole(data);

  if (!isValid) {
    throw new Error(
      'Error creating role, ' + ajv.errorsText(validateCreateRole.errors)
    );
  }

  const { permissionIds, ...rest } = data;
  const role = await prisma.role.create({
    data: {
      ...rest,
      businessId,
      permissions: {
        connect: permissionIds?.map((permissionId) => ({ id: permissionId }))
      }
    },
    include: options?.include
  });

  return role as Prisma.RoleGetPayload<T>;
};

export const updateRole = async <T extends RoleOptions>(
  businessId: string,
  id: string,
  data: Partial<RoleSchema>,
  options?: T
) => {
  const isValid = validateUpdateRole(data);

  if (!isValid) {
    throw new Error(
      'Error updating role, ' + ajv.errorsText(validateCreateRole.errors)
    );
  }

  const { permissionIds } = data;
  const role = await prisma.role.update({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    data: {
      ...data,
      businessId,
      permissions: {
        connect: permissionIds?.map((permissionId) => ({ id: permissionId }))
      }
    },
    include: options?.include
  });

  return role as Prisma.RoleGetPayload<T>;
};

export const deleteRole = async <T extends RoleOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const { users } = await getRoleById(businessId, id, {
    include: { users: { select: { id: true } } }
  });

  if (users.length > 0) {
    throw new Error(
      'Unable to delete role: it is currently assigned to one or more users'
    );
  }

  const role = await prisma.role.update({
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

  return role as Prisma.RoleGetPayload<T>;
};
