import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import Prisma from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

export type RoleSchema = Omit<
  Prisma.Role,
  'id' | 'businessId' | 'createdAt' | 'updatedAt' | 'deletedAt'
> & { permissionIds?: string[] };

const roleSchema: JSONSchemaType<RoleSchema> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    permissionIds: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
      uniqueItems: true
    }
  },
  required: [],
  additionalProperties: false
};

const createRoleSchema = {
  ...roleSchema,
  required: ['name', 'permissionIds']
};

const updateRoleSchema = roleSchema;

export const validateCreateRole = ajv.compile(createRoleSchema);
export const validateUpdateRole = ajv.compile(updateRoleSchema);
