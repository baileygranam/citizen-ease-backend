import { faker } from '@faker-js/faker';
import { prisma } from '@src/config';
import { Client } from '@models';
import { setup, State } from '@test/setup';
import * as Factory from '@test/factory';

describe('Client Model', () => {
  let state: State;

  beforeAll(async () => {
    state = await setup();
  });

  describe('getClientById', () => {
    test('should return the client with the given id', async () => {
      const client = await Factory.createClient(state);
      const result = await Client.getClientById(client.businessId, client.id);

      expect(result).toMatchObject(expect.objectContaining(client));
    });

    test('should return the client with the given id and included relations', async () => {
      const client = await Factory.createClient(state);
      const result = await Client.getClientById(client.businessId, client.id, {
        include: { business: true }
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          ...client,
          business: state.business
        })
      );
    });

    test('should throw an error if the client does not exist', async () => {
      const result = Client.getClientById(
        state.business.id,
        faker.datatype.uuid()
      );

      await expect(result).rejects.toThrowError('Client not found');
    });

    test('should throw an error if attempting to get client from another business', async () => {
      const business = await Factory.createBusiness();
      const client = await Factory.createClient(state, {
        businessId: business.id
      });

      const result = Client.getClientById(state.business.id, client.id);

      await expect(result).rejects.toThrowError('Client not found');
    });
  });

  describe('getClients', () => {
    test('should return a list of clients with given options', async () => {
      const business = await Factory.createBusiness();

      const client1 = await Factory.createClient(state, {
        businessId: business.id
      });

      const client2 = await Factory.createClient(state, {
        businessId: business.id
      });

      const options = { include: { business: true } };
      const clients = await Client.getClients(business.id, options);

      expect(clients).toHaveLength(2);

      expect(clients).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...client1,
            business
          }),
          expect.objectContaining({
            ...client2,
            business
          })
        ])
      );
    });

    test('should return an empty list if no clients are found', async () => {
      const clients = await Client.getClients(faker.datatype.uuid());

      expect(clients).toHaveLength(0);
    });
  });

  describe('doesClientExist', () => {
    test('should return true if a client exists with the given id', async () => {
      const client = await Factory.createClient(state);
      const result = await Client.doesClientExist(client.businessId, client.id);

      expect(result).toBe(true);
    });

    test('should return false if a client with the given id does not exist', async () => {
      const result = await Client.doesClientExist(
        state.business.id,
        faker.datatype.uuid()
      );

      expect(result).toBe(false);
    });

    test('should return false if a client with the given id exists in a different business', async () => {
      const business = await Factory.createBusiness();
      const client = await Factory.createClient(state, {
        businessId: business.id
      });

      const result = await Client.doesClientExist(state.business.id, client.id);

      expect(result).toBe(false);
    });
  });

  describe('createClient', () => {
    test('should create a new client with valid data', async () => {
      const data = Factory.generateClientData();

      const result = await Client.createClient(state.business.id, data);

      expect(result).toMatchObject(expect.objectContaining(data));
    });

    test('should throw an error if email is invalid', async () => {
      const data = Factory.generateClientData({
        email: 'fake-email'
      });
      const result = Client.createClient(state.business.id, data);

      await expect(result).rejects.toThrowError(
        `Error creating client, data/email must match format "email"`
      );
    });
  });

  describe('updateClient', () => {
    test('should update a new client with valid data', async () => {
      const client = await Factory.createClient(state);
      const data = Factory.generateClientData();

      const result = await Client.updateClient(
        client.businessId,
        client.id,
        data
      );

      expect(result).toMatchObject(expect.objectContaining(data));
    });

    test('should throw an error if client does not exist', async () => {
      const data = Factory.generateClientData();

      const result = Client.updateClient(
        state.business.id,
        faker.datatype.uuid(),
        data
      );

      await expect(result).rejects.toThrowError('Client not found');
    });

    test('should throw an error if email is invalid', async () => {
      const client = await Factory.createClient(state);
      const data = Factory.generateClientData({
        email: 'fake-email'
      });
      const result = Client.updateClient(client.businessId, client.id, data);

      await expect(result).rejects.toThrowError(
        `Error updating client, data/email must match format "email"`
      );
    });
  });

  describe('terminateClient', () => {
    test('should delete the client with the given id', async () => {
      const client = await Factory.createClient(state);

      await Client.terminateClient(client.businessId, client.id);

      const result = await prisma.client.findFirst({
        where: { id: client.id }
      });

      expect(result?.deletedAt).not.toBe(null);
    });

    test('should throw an error if the client does not exist', async () => {
      const result = Client.terminateClient(
        state.business.id,
        faker.datatype.uuid()
      );

      await expect(result).rejects.toThrowError('Client not found');
    });
  });
});
