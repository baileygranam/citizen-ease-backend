import { Case } from '@models';
import { setup, State } from '@test/setup';
import * as Factory from '@test/factory';
import { faker } from '@faker-js/faker';
import { prisma } from '@src/config';
import dayjs from 'dayjs';
import Prisma from '@prisma/client';

describe('Case Model', () => {
  let state: State;

  beforeEach(async () => {
    state = await setup();
  });

  describe('getCaseById', () => {
    test('should return the case with the given id', async () => {
      const result = await Case.getCaseById(state.business.id, state.case.id);

      expect(result).toMatchObject(expect.objectContaining(state.case));
    });

    test('should return the case with the given id and included relations', async () => {
      const result = await Case.getCaseById(state.business.id, state.case.id, {
        include: { user: true, client: true, business: true }
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          ...state.case,
          user: state.user,
          client: state.client,
          business: state.business
        })
      );
    });

    test('should throw an error if the case was deleted', async () => {
      await prisma.case.update({
        where: { id: state.case.id },
        data: {
          deletedAt: dayjs().utc().format()
        }
      });

      const result = Case.getCaseById(state.business.id, state.case.id);

      await expect(result).rejects.toThrowError('Case not found');
    });

    test('should throw an error if the case does not exist', async () => {
      const result = Case.getCaseById(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('Case not found');
    });
  });

  describe('getCases', () => {
    test('should return a list of cases with given options', async () => {
      const cases: Prisma.Case[] = [];

      cases.push(await Factory.createCase(state));
      cases.push(await Factory.createCase(state));

      const options = { include: { business: true } };
      const results = await Case.getCases(state.business.id, options);

      expect(cases).toHaveLength(2);

      expect(results).toEqual(
        expect.arrayContaining(
          cases.map((data) =>
            expect.objectContaining({
              ...data,
              business: state.business
            })
          )
        )
      );
    });

    test('should return an empty list if no clients are found', async () => {
      const results = await Case.getCases(faker.datatype.uuid());

      expect(results).toHaveLength(0);
    });
  });

  describe('createCase', () => {
    test('should create a new case with valid data', async () => {
      const data = Factory.generateCaseData(state);

      const result = await Case.createCase(state.business.id, data, {
        include: { user: true }
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          ...data,
          user: state.user
        })
      );
    });

    test('should throw an error if data is invalid', async () => {
      const data = Factory.generateCaseData(state, {
        clientId: ''
      });

      const result = Case.createCase(state.business.id, data);

      await expect(result).rejects.toThrowError(
        `Error creating case, data/clientId must match format "uuid"`
      );
    });
  });

  describe('updateCase', () => {
    test('should update a case with valid data', async () => {
      const data = Factory.generateCaseData(state);

      const result = await Case.updateCase(
        state.business.id,
        state.case.id,
        data
      );

      expect(result).toMatchObject(expect.objectContaining(data));
    });

    test('should throw an error if data is invalid', async () => {
      const data = Factory.generateCaseData(state, {
        clientId: ''
      });

      const result = Case.updateCase(state.business.id, state.case.id, data);

      await expect(result).rejects.toThrowError(
        `Error updating case, data/clientId must match format "uuid"`
      );
    });
  });

  describe('deleteCase', () => {
    test('should delete a case that exists', async () => {
      const result = await Case.deleteCase(state.business.id, state.case.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(state.case.id);
    });

    test('should throw an error if the case does not exist', async () => {
      const result = Case.deleteCase(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('Case not found');
    });

    test('should throw an error if the case was already deleted', async () => {
      await prisma.case.update({
        where: { id: state.case.id },
        data: {
          deletedAt: dayjs().utc().format()
        }
      });

      const result = Case.deleteCase(state.business.id, state.case.id);
      await expect(result).rejects.toThrowError('Case not found');
    });
  });
});
