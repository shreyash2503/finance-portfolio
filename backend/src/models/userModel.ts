import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string, passwordHash: string) {
  return prisma.user.create({ data: { email, passwordHash } });
}

export async function updateUserToken(id: string, jwtToken: string) {
  return prisma.user.update({ where: { id }, data: { jwtToken } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
