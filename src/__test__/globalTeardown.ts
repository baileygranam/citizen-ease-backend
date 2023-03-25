import { prisma } from './setup';

export default async () => {
  await prisma.$disconnect();
};
