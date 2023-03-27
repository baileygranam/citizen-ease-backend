import jwt from 'jsonwebtoken';
import config, { prisma } from '@src/config';
import { TokenType, User } from '@prisma/client';
import { Authentication } from '@models';
import { State, setup } from '@test/setup';
import * as Factory from '@test/factory';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);

describe('Busines Model', () => {
  let state: State;

  beforeAll(async () => {
    state = await setup();
  });

  describe('createToken', () => {
    test('should create a valid access token', async () => {
      const token = await Authentication.createToken(
        state.user,
        TokenType.ACCESS
      );

      expect(token).not.toBe('');
      expect(typeof token).toBe('string');

      const payload = jwt.verify(token, config.JWT_SECRET);
      expect(Authentication.isAuthenticationPayload(payload)).toBe(true);
    });

    test('should create a valid refresh token', async () => {
      const token = await Authentication.createToken(
        state.user,
        TokenType.REFRESH
      );

      expect(token).not.toBe('');
      expect(typeof token).toBe('string');

      const payload = jwt.verify(token, config.JWT_REFRESH_SECRET);
      expect(Authentication.isAuthenticationPayload(payload)).toBe(true);
    });

    test('should fail if invalid token type passed', async () => {
      const result = Authentication.createToken(
        state.user,
        'INVALID_TYPE' as unknown as TokenType
      );

      await expect(result).rejects.toThrowError('Error creating token');
    });

    test('should fail if invalid user passed', async () => {
      const result = Authentication.createToken(
        { id: '123', businessId: '123' } as unknown as User,
        TokenType.ACCESS as unknown as TokenType
      );

      await expect(result).rejects.toThrowError('Error creating token');
    });
  });

  describe('revokeTokens', () => {
    test(`should revoke a user's tokens`, async () => {
      const user = await Factory.createUser(state);

      await Authentication.createTokens(user);

      const getTokens = async () =>
        prisma.token.findMany({
          where: { userId: user.id, deletedAt: null }
        });

      let tokens = await getTokens();

      expect(tokens).toHaveLength(2);

      await Authentication.revokeTokens(user.id);

      tokens = await getTokens();

      expect(tokens).toHaveLength(0);
    });
  });

  describe('isTokenValid', () => {
    test(`should return true for a valid token`, async () => {
      const user = await Factory.createUser(state);
      const token = await Authentication.createToken(user, TokenType.ACCESS);
      const isTokenValid = await Authentication.isTokenValid(
        token,
        TokenType.ACCESS
      );

      expect(isTokenValid).toBe(true);
    });

    test(`should return false if token is expired`, async () => {
      const user = await Factory.createUser(state);
      const token = await Authentication.createToken(user, TokenType.ACCESS);

      await prisma.token.update({
        where: { token },
        data: {
          expiresAt: dayjs().format()
        }
      });

      const isTokenValid = await Authentication.isTokenValid(
        token,
        TokenType.ACCESS
      );

      expect(isTokenValid).toBe(false);
    });

    test(`should return false if token is deleted`, async () => {
      const user = await Factory.createUser(state);
      const token = await Authentication.createToken(user, TokenType.ACCESS);

      await prisma.token.update({
        where: { token },
        data: {
          deletedAt: dayjs().format()
        }
      });

      const isTokenValid = await Authentication.isTokenValid(
        token,
        TokenType.ACCESS
      );

      expect(isTokenValid).toBe(false);
    });

    test(`should return false if token does not exist`, async () => {
      const isTokenValid = await Authentication.isTokenValid(
        'INVALID_TOKEN',
        TokenType.ACCESS
      );

      expect(isTokenValid).toBe(false);
    });

    test(`should return false if payload is invalid`, async () => {
      const user = await Factory.createUser(state);
      const token = jwt.sign(
        { userId: undefined, businessId: undefined },
        config.JWT_SECRET,
        { expiresIn: '1d' }
      );

      await prisma.token.create({
        data: {
          type: TokenType.ACCESS,
          userId: user.id,
          token,
          expiresAt: dayjs().add(1, 'day').format()
        }
      });

      const isTokenValid = await Authentication.isTokenValid(
        token,
        TokenType.ACCESS
      );

      expect(isTokenValid).toBe(false);
    });
  });

  describe('getTokenPayload', () => {
    test(`should return payload for valid token`, async () => {
      const user = await Factory.createUser(state);
      const token = await Authentication.createToken(user, TokenType.ACCESS);

      const payload = Authentication.getTokenPayload(token, TokenType.ACCESS);

      expect(payload).toMatchObject(
        expect.objectContaining({
          userId: user.id,
          businessId: user.businessId
        })
      );
    });

    test(`should throw an error for invalid token`, async () => {
      const token = jwt.sign({ id: '1' }, config.JWT_SECRET);
      expect(() =>
        Authentication.getTokenPayload(token, TokenType.ACCESS)
      ).toThrowError('Invalid token');
    });
  });
});
