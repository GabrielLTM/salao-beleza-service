import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@salao.local';
const ADMIN_SENHA = 'admin123';

async function main() {
  const existente = await prisma.funcionario.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existente) {
    console.log(`[seed] administrador ja existe (${ADMIN_EMAIL}).`);
    return;
  }
  const senhaHash = await bcrypt.hash(ADMIN_SENHA, 10);
  await prisma.funcionario.create({
    data: {
      id: randomUUID(),
      nomeCompleto: 'Administrador',
      profissaoCargo: 'Administrador',
      email: ADMIN_EMAIL,
      senhaHash,
      nivelPermissao: 4,
      status: 1,
    },
  });
  console.log(`[seed] administrador criado. email=${ADMIN_EMAIL} senha=${ADMIN_SENHA}`);
}

main()
  .catch((e) => {
    console.error('[seed] erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
