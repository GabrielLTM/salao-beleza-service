import { env } from './config/env.js';
import { criarContainer } from './composition/container.js';
import { criarApp } from './infrastructure/web/app.js';
import { desconectarPrisma } from './infrastructure/database/prismaClient.js';

const container = criarContainer();
const app = criarApp(container);

const server = app.listen(env.port, () => {
  console.log(`[salao-api] escutando em http://localhost:${env.port} (env=${env.nodeEnv})`);
});

async function encerrar(sinal) {
  console.log(`[salao-api] recebido ${sinal}, encerrando...`);
  server.close(async () => {
    await desconectarPrisma();
    process.exit(0);
  });
}
process.on('SIGINT', () => encerrar('SIGINT'));
process.on('SIGTERM', () => encerrar('SIGTERM'));
