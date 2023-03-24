import Prisma, { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import * as User from './';
import { UserSchema } from './user.schema';

const prisma = new PrismaClient();

type State = {
  business: Prisma.Business;
  user: Prisma.User;
};

describe('User Model', () => {
  let state: State;

  const generateUser = (data?: Partial<UserSchema>) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number('+1##########'),
    password: faker.internet.password(10),
    role: Prisma.Role.CLIENT,
    ...data
  });

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const business = await prisma.business.create({
      data: { name: faker.company.name() }
    });

    const user = await prisma.user.create({
      data: { businessId: business.id, ...generateUser() }
    });

    state = { business, user };
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();
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
      const data = generateUser();

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
      const data = generateUser({ email: state.user.email });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'A user already exists with that email'
      );
    });

    test('should throw an error if email is invalid', async () => {
      const data = generateUser({ email: 'fake-email' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        `Error creating user, data/email must match format "email"`
      );
    });

    test('should throw an error if password is too short', async () => {
      const data = generateUser({ password: '1234' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/password must NOT have fewer than 6 characters'
      );
    });

    test('should throw an error if firstName is empty', async () => {
      const data = generateUser({ firstName: '' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/firstName must NOT have fewer than 1 characters'
      );
    });

    test('should throw an error if lastName is empty', async () => {
      const data = generateUser({ lastName: '' });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        'Error creating user, data/lastName must NOT have fewer than 1 characters'
      );
    });

    test('should throw an error if role is empty', async () => {
      const data = generateUser({ role: undefined });
      const result = User.createUser(state.business.id, data);

      await expect(result).rejects.toThrowError(
        `Error creating user, data must have required property 'role'`
      );
    });
  });

  describe('updateUser', () => {
    test('should update a user with valid data', async () => {
      const data = generateUser();

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
      const otherUser = await prisma.user.create({
        data: { businessId: state.business.id, ...generateUser() }
      });

      const data = { email: otherUser.email };
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        'A user already exists with that email'
      );
    });

    test('should throw an error if user does not exist', async () => {
      const data = generateUser();
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

    test('should throw an error if role is invalid', async () => {
      const data = { role: 'INVALID_ROLE' } as unknown as UserSchema;
      const result = User.updateUser(state.business.id, state.user.id, data);

      await expect(result).rejects.toThrowError(
        `Error updating user, data/role must be equal to one of the allowed values`
      );
    });
  });
});