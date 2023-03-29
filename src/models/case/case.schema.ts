import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { Prisma, Case, CaseStatus } from '@prisma/client';

const ajv = new Ajv();
addFormats(ajv);

type FieldsToIgnore =
  | 'id'
  | 'businessId'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

type IgnoreOnCreate = FieldsToIgnore | 'status';
type IgnoreOnUpdate = FieldsToIgnore | 'clientId';

export type CaseSchema = Omit<Case, FieldsToIgnore>;

export type CaseCreateInput = Omit<
  Prisma.CaseUncheckedCreateInput,
  IgnoreOnCreate
>;

export type CaseUpdateInput = Omit<
  Prisma.CaseUncheckedUpdateInput,
  IgnoreOnUpdate
>;

const caseSchema: JSONSchemaType<CaseSchema> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: Object.values(CaseStatus) },
    dueAt: { type: 'object', required: [] },
    clientId: { type: 'string', format: 'uuid' },
    userId: { type: 'string', format: 'uuid' }
  },
  required: [],
  additionalProperties: false
};

const createCaseSchema = {
  ...caseSchema,
  required: ['clientId', 'userId']
};

const updateCaseSchema = caseSchema;

export const validateCreateCase = ajv.compile(createCaseSchema);
export const validateUpdateCase = ajv.compile(updateCaseSchema);
