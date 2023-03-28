import { Gender, Language, MartialStatus, Prisma } from '@prisma/client';
import { prisma, State } from './setup';
import { faker } from '@faker-js/faker';

export const generateBusinessData = (
  data?: Partial<Prisma.BusinessUncheckedCreateInput>
) => {
  return {
    name: faker.company.name(),
    ...data
  };
};

export const createBusiness = async (
  data?: Partial<Prisma.BusinessUncheckedCreateInput>
) => {
  return prisma.business.create({
    data: generateBusinessData(data)
  });
};

export const generateRoleData = (
  data?: Partial<Prisma.RoleUncheckedCreateInput>
) => {
  return {
    name: faker.name.jobTitle(),
    ...data
  };
};

export const createRole = async (
  state: State,
  data?: Partial<Prisma.RoleUncheckedCreateInput>
) => {
  return prisma.role.create({
    data: {
      businessId: state.business.id,
      ...generateRoleData(data)
    }
  });
};

export const generateUserData = (
  state: State,
  data?: Partial<Prisma.UserUncheckedCreateInput>
) => {
  return {
    roleId: state.role.id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number('+1##########'),
    password: faker.internet.password(10),
    ...data
  };
};

export const createUser = async (
  state: State,
  data?: Partial<Prisma.UserUncheckedCreateInput>
) => {
  return prisma.user.create({
    data: {
      businessId: state.business.id,
      ...generateUserData(state, data)
    }
  });
};

export const generateClientData = (
  data?: Partial<Prisma.ClientUncheckedCreateInput>
) => {
  return {
    firstName: faker.name.firstName(),
    middleName: faker.name.middleName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number('+1##########'),
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    maritalStatus: faker.helpers.arrayElement(Object.values(MartialStatus)),
    preferredLanguage: faker.helpers.arrayElement(Object.values(Language)),
    addressLine1: faker.address.streetAddress(),
    addressLine2: faker.address.secondaryAddress(),
    addressCity: faker.address.city(),
    addressZipcode: faker.address.zipCode(),
    addressState: faker.address.state(),
    addressCountry: faker.address.country(),
    ...data
  };
};

export const createClient = async (
  state: State,
  data?: Partial<Prisma.ClientUncheckedCreateInput>
) => {
  return prisma.client.create({
    data: {
      businessId: state.business.id,
      ...generateClientData(data)
    }
  });
};
