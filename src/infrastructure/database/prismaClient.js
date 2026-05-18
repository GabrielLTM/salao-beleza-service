import { PrismaClient } from '@prisma/client';
import { env } from '../../config/env.js';

export const prisma = new PrismaClient({
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

export async function desconectarPrisma() {
  await prisma.$disconnect();
}
