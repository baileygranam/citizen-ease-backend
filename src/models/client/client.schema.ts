import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import {
  Prisma,
  Client,
  Gender,
  Language,
  MartialStatus
} from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

type FieldsToIgnore =
  | 'id'
  | 'businessId'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

export type ClientSchema = Omit<Client, FieldsToIgnore>;

export type ClientCreateInput = Omit<
  Prisma.ClientUncheckedCreateInput,
  FieldsToIgnore
>;

export type ClientUpdateInput = Omit<
  Prisma.ClientUncheckedUpdateInput,
  FieldsToIgnore
>;

const clientSchema: JSONSchemaType<ClientSchema> = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    middleName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phoneNumber: { type: 'string' },
    dateOfBirth: { type: 'object', required: [] },
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    addressCity: { type: 'string' },
    addressState: { type: 'string' },
    addressZipcode: { type: 'string' },
    addressCountry: { type: 'string' },
    gender: { type: 'string', enum: Object.values(Gender) },
    preferredLanguage: { type: 'string', enum: Object.values(Language) },
    maritalStatus: { type: 'string', enum: Object.values(MartialStatus) }
  },
  required: [],
  additionalProperties: false
};

const createClientSchema = {
  ...clientSchema,
  required: ['firstName']
};

const updateClientSchema = clientSchema;

export const validateCreateClient = ajv.compile(createClientSchema);
export const validateUpdateClient = ajv.compile(updateClientSchema);
