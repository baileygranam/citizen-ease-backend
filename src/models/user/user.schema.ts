import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import Prisma from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

export type UserSchema = Omit<
  Prisma.User,
  'id' | 'businessId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

const userSchema: JSONSchemaType<UserSchema> = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    phoneNumber: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 6 }
  },
  required: [],
  additionalProperties: false
};

const createUserSchema = {
  ...userSchema,
  required: ['firstName', 'lastName', 'email', 'phoneNumber', 'password']
};

const updateUserSchema = userSchema;

export const validateCreateUser = ajv.compile(createUserSchema);
export const validateUpdateUser = ajv.compile(updateUserSchema);
