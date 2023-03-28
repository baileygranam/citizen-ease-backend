import { Role } from '@models';

import { setup, State } from '@test/setup';
import * as Factory from '@test/factory';
import { faker } from '@faker-js/faker';
import { prisma } from '@src/config';
import dayjs from 'dayjs';

describe('Role Model', () => {
  let state: State;

  beforeAll(async () => {
    state = await setup();
  });

  describe('getRoleById', () => {
    test('should return the role with the given id', async () => {
      const result = await Role.getRoleById(state.business.id, state.role.id);

      expect(result).toMatchObject(expect.objectContaining(state.role));
    });

    test('should return the role with the given id and included relations', async () => {
      const role = await Factory.createRole(state, {
        permissions: {
          connect: state.permissions.map(({ id }) => ({ id }))
        }
      });

      const result = await Role.getRoleById(state.business.id, role.id, {
        include: { permissions: true }
      });

      expect(result).toMatchObject(
        expect.objectContaining({
          ...role,
          permissions: state.permissions
        })
      );
    });

    test('should throw an error if the role was deleted', async () => {
      const role = await Factory.createRole(state);
      await prisma.role.update({
        where: { id: role.id },
        data: {
          deletedAt: dayjs().utc().format()
        }
      });

      const result = Role.getRoleById(state.business.id, role.id);

      await expect(result).rejects.toThrowError('Role not found');
    });

    test('should throw an error if the role does not exist', async () => {
      const result = Role.getRoleById(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('Role not found');
    });
  });

  describe('createRole', () => {
    test('should create a new role with valid data', async () => {
      const data = Factory.generateRoleData();

      const result = await Role.createRole(
        state.business.id,
        {
          ...data,
          permissionIds: state.permissions.map((permission) => permission.id)
        },
        { include: { permissions: true } }
      );

      expect(result).toMatchObject(
        expect.objectContaining({
          ...data,
          permissions: state.permissions
        })
      );
    });

    test('should throw an error if name is empty', async () => {
      const data = Factory.generateRoleData({ name: '' });
      const result = Role.createRole(state.business.id, {
        ...data,
        permissionIds: []
      });

      await expect(result).rejects.toThrowError(
        'Error creating role, data/name must NOT have fewer than 1 characters'
      );
    });
  });

  describe('updateRole', () => {
    test('should update a role with valid data', async () => {
      const role = await Factory.createRole(state);
      const data = Factory.generateRoleData();

      const result = await Role.updateRole(state.business.id, role.id, data);

      expect(result).toMatchObject(expect.objectContaining(data));
    });

    test('should throw an error if name is empty', async () => {
      const role = await Factory.createRole(state);
      const result = Role.updateRole(state.business.id, role.id, { name: '' });

      await expect(result).rejects.toThrowError(
        'Error updating role, data/name must NOT have fewer than 1 characters'
      );
    });
  });

  describe('deleteRole', () => {
    test('should delete a role that exists', async () => {
      const role = await Factory.createRole(state);
      const result = await Role.deleteRole(state.business.id, role.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(role.id);
    });

    test('should throw an error if at least one user is assigned to the role', async () => {
      const role = await Factory.createRole(state);

      await Factory.createUser(state, { roleId: role.id });

      const result = Role.deleteRole(state.business.id, role.id);

      await expect(result).rejects.toThrowError(
        'Unable to delete role: it is currently assigned to one or more users'
      );
    });

    test('should throw an error if the role does not exist', async () => {
      const result = Role.deleteRole(state.business.id, faker.datatype.uuid());

      await expect(result).rejects.toThrowError('Role not found');
    });

    test('should throw an error if the role was already deleted', async () => {
      const role = await Factory.createRole(state);

      await prisma.role.update({
        where: { id: role.id },
        data: {
          deletedAt: dayjs().utc().format()
        }
      });

      const result = Role.deleteRole(state.business.id, role.id);
      await expect(result).rejects.toThrowError('Role not found');
    });
  });
});
