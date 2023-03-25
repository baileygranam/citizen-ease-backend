import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import Prisma from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

export type BusinessSchema = Omit<
  Prisma.Business,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

const businessSchema: JSONSchemaType<BusinessSchema> = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 }
  },
  required: [],
  additionalProperties: false
};

const createBusinessSchema = {
  ...businessSchema,
  required: ['name']
};

const updateBusinessSchema = businessSchema;

export const validateCreateBusiness = ajv.compile(createBusinessSchema);
export const validateUpdateBusiness = ajv.compile(updateBusinessSchema);
