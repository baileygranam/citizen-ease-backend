import { faker } from '@faker-js/faker';
import * as Business from './';
import { State, setup } from '../../__test__/setup';
import * as Factory from '../../__test__/factory';

describe('Busines Model', () => {
  let state: State;

  beforeAll(async () => {
    state = await setup();
  });

  describe('getBusinessById', () => {
    test('should return the business with the given id', async () => {
      const business = await Business.getBusinessById(state.business.id);

      expect(business).toMatchObject(expect.objectContaining(state.business));
    });

    test('should return the business with the given id and included relations', async () => {
      const business = await Business.getBusinessById(state.business.id, {
        include: { users: true }
      });

      expect(business).toMatchObject(
        expect.objectContaining({
          ...state.business,
          users: [state.user]
        })
      );
    });

    test('should throw an error if the business does not exist', async () => {
      const result = Business.getBusinessById(faker.datatype.uuid());

      await expect(result).rejects.toThrowError('Business not found');
    });
  });

  describe('doesBusinessExist', () => {
    test('should return true if business exists', async () => {
      const exists = await Business.doesBusinessExist(state.business.id);
      expect(exists).toBeTruthy();
    });

    test('should return false if business does not exist', async () => {
      const exists = await Business.doesBusinessExist(faker.datatype.uuid());
      expect(exists).toBeFalsy();
    });
  });

  describe('createBusiness', () => {
    test('should create a new business with the provided data', async () => {
      const data = Factory.generateBusinessData();
      const result = await Business.createBusiness(data);

      expect(result.id).toBeDefined();
      expect(result.name).toEqual(data.name);
    });

    test('should throw an error if business data is invalid', async () => {
      const result = Business.createBusiness({ name: '' });
      await expect(result).rejects.toThrow('Error creating business');
    });
  });

  describe('updateBusiness', () => {
    test('should update a business with the provided data', async () => {
      const data = Factory.generateBusinessData();
      const result = await Business.updateBusiness(state.business.id, data);

      expect(result).toMatchObject(expect.objectContaining(data));
    });

    test('should throw an error if name is empty', async () => {
      const result = Business.updateBusiness(state.business.id, { name: '' });

      await expect(result).rejects.toThrow('Error updating business');
    });

    test('should throw an error if business is not found', async () => {
      const result = Business.updateBusiness(
        faker.datatype.uuid(),
        Factory.generateBusinessData()
      );

      await expect(result).rejects.toThrow('Business not found');
    });

    test('should update the business with the given data and return included relations', async () => {
      const data = Factory.generateBusinessData();
      const business = await Business.updateBusiness(state.business.id, data, {
        include: { users: true }
      });

      expect(business).toMatchObject(
        expect.objectContaining({
          ...data,
          users: [state.user]
        })
      );
    });
  });
});
