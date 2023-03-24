import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import Prisma from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

type User = Omit<Prisma.User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

const userSchema: JSONSchemaType<User> = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    phoneNumber: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 6 },
    role: { type: 'string', enum: Object.values(Prisma.Role) },
    businessId: { type: 'string', format: 'uuid' }
  },
  required: [],
  additionalProperties: false
};

const createUserSchema = {
  ...userSchema,
  required: [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'password',
    'role',
    'businessId'
  ]
};

export const validateCreateUser = ajv.compile(createUserSchema);
