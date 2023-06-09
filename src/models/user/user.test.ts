import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { prisma } from '@src/config';
import { Authentication, User } from '@models';

import { setup, State } from '@test/setup';
import * as Factory from '@test/factory';

describe('User Model', () => {
  let state: State;

  beforeAll(async () => {
    state = await setup();
  });

  describe('getUserById', () => {
    test('should return the user with the given id', async () => {
      const user = await User.getUserById(state.business.id, state.user.id);

      expect(user).toMatchObject(expect.objectContaining(state.user));
    });

    test('should return the user with the given id and included relations', async () => {
      const user = await User.getUserById(state.business.id, state.user.id, {
        include: { business: true }
      });

      expect(user).toMatchObject(
        expect.objectContaining({
          ...state.user,
          business: state.business
        })
      );
    });

    test('should throw an error if the user does not exist', async () => {
      const result = User.getUserById(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('User not found');
    });
  });

  describe('doesUserExist', () => {
    test('should return true if a user with the given email exists', async () => {
      const result = await User.doesUserExist(state.business.id, {
        email: state.user.email
      });

      expect(result).toBe(true);
    });

    test('should return false if a user with the given email does not exist', async () => {
      const result = await User.doesUserExist(state.business.id, {
        email: faker.internet.email()
      });

      expect(result).toBe(false);
    });

    test('should return false if a user with the given email exists in a different business', async () => {
      const result = await User.doesUserExist(faker.datatype.uuid(), {
        email: state.user.email
      });

      expect(result).toBe(false);
    });
  });

  describe('createUser', () => {
    test('should create a new user with valid data', async () => {
      const data = Factory.generateUserData(state);

      const result = await User.createUser(state.business.id, data);

      expect(result).toMatchObject(
        expect.objectContaining({
          ...data,
          password: expect.any(String)
        })
      );

      const passwordMatches = await bcrypt.compare(
        data.password,
        result.password
      );

      expect(passwordMatches).toBe(true);
    });

    test('should throw an error if a user already exists with the given email', async () => {
      const data = Factory.generateUserData(state, { email: state.user.email });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'A user already exists with that email'
      );
    });

    test('should throw an error if email is invalid', async () => {
      const data = Factory.generateUserData(state, { email: 'fake-email' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        `Error creating user, data/email must match format "email"`
      );
    });

    test('should throw an error if password is too short', async () => {
      const data = Factory.generateUserData(state, { password: '1234' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/password must NOT have fewer than 6 characters'
      );
    });

    test('should throw an error if firstName is empty', async () => {
      const data = Factory.generateUserData(state, { firstName: '' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/firstName must NOT have fewer than 1 characters'
      );
    });

    test('should throw an error if lastName is empty', async () => {
      const data = Factory.generateUserData(state, { lastName: '' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/lastName must NOT have fewer than 1 characters'
      );
    });
  });

  describe('getUsers', () => {
    test('should return a list of users with given options', async () => {
      const options = { include: { business: true } };
      const users = await User.getUsers(state.business.id, options);

      expect(users.length).toBeGreaterThanOrEqual(1);
      expect(users[0]).toMatchObject(
        expect.objectContaining({
          ...state.user,
          business: state.business
        })
      );
    });

    test('should return an empty list if no users are found', async () => {
      const users = await User.getUsers(faker.datatype.uuid());

      expect(users).toHaveLength(0);
    });
  });

  describe('updateUser', () => {
    test('should update a user with valid data', async () => {
      const data = Factory.generateUserData(state);

      const result = await User.updateUser(
        state.business.id,
        state.user.id,
        data
      );

      expect(result).toMatchObject(
        expect.objectContaining({
          ...data,
          password: expect.any(String)
        })
      );

      const passwordMatches = await bcrypt.compare(
        data.password,
        result.password
      );

      expect(passwordMatches).toBe(true);
    });

    test('should throw an error if a user already exists with the given email', async () => {
      const otherUser = await Factory.createUser(state);

      const data = { email: otherUser.email };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        'A user already exists with that email'
      );
    });

    test('should throw an error if user does not exist', async () => {
      const data = Factory.generateUserData(state);
      const result = User.updateUser(
        state.business.id,
        faker.datatype.uuid(),
        data
      );

      await expect(result).rejects.toThrowError('User not found');
    });

    test('should throw an error if email is invalid', async () => {
      const data = { email: 'fake-email' };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        `Error updating user, data/email must match format "email"`
      );
    });

    test('should throw an error if password is too short', async () => {
      const data = { password: '1234' };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        'Error updating user, data/password must NOT have fewer than 6 characters'
      );
    });

    test('should throw an error if firstName is empty', async () => {
      const data = { firstName: '' };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        'Error updating user, data/firstName must NOT have fewer than 1 characters'
      );
    });

    test('should throw an error if lastName is empty', async () => {
      const data = { lastName: '' };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        'Error updating user, data/lastName must NOT have fewer than 1 characters'
      );
    });
  });

  describe('deleteUser', () => {
    test('should delete the user with the given id', async () => {
      const user = await Factory.createUser(state);

      await User.deleteUser(user.businessId, user.id);

      const result = await prisma.user.findFirst({ where: { id: user.id } });

      expect(result?.deletedAt).not.toBe(null);
    });

    test('should revoke all user tokens', async () => {
      const user = await Factory.createUser(state);

      await Authentication.createTokens(user);

      await User.deleteUser(user.businessId, user.id);

      const result = await prisma.user.findFirst({
        where: { id: user.id },
        include: { tokens: true }
      });

      expect(result?.tokens).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            deletedAt: expect.any(Date)
          })
        ])
      );
    });

    test('should throw an error if the user does not exist', async () => {
      const result = User.deleteUser(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('User not found');
    });
  });
});
