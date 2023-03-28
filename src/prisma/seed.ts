import bcrypt from 'bcrypt';
import { prisma } from '../config';

const permissionData = [
  {
    name: 'View Users',
    description: 'Allows a user to view all other users of the business',
    scope: 'read:user'
  },
  {
    name: 'Create Users',
    description: 'Allows a user to create new users for the business',
    scope: 'create:user'
  },
  {
    name: 'Update Users',
    description: 'Allows a user to make changes to other users of the business',
    scope: 'update:user'
  },
  {
    name: 'Delete Users',
    description: 'Allows a user to delete a user from the business',
    scope: 'delete:user'
  }
];

const seed = async () => {
  const permissions = await prisma.$transaction(
    permissionData.map((data) => prisma.permission.create({ data }))
  );

  const business = await prisma.business.create({
    data: {
      name: 'CitizenEase'
    }
  });

  const role = await prisma.role.create({
    data: {
      businessId: business.id,
      name: 'Administrator',
      permissions: {
        connect: permissions.map((permission) => ({ id: permission.id }))
      }
    }
  });

  await prisma.user.create({
    data: {
      businessId: business.id,
      roleId: role.id,
      firstName: 'Default',
      lastName: 'User',
      email: 'default@user.com',
      phoneNumber: '+15555555555',
      password: await bcrypt.hash('password', 12)
    }
  });
};

seed()
  .then(() => console.log('Database succesfully seeded!'))
  .catch(() => 'Error seeding database!');
