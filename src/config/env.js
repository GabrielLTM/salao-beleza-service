import 'dotenv/config';

function obrigatoria(nome) {
  const valor = process.env[nome];
  if (!valor || valor.trim() === '') {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${nome}`);
  }
  return valor;
}

function opcional(nome, padrao) {
  const valor = process.env[nome];
  return valor === undefined || valor === '' ? padrao : valor;
}

export const env = Object.freeze({
  databaseUrl: obrigatoria('DATABASE_URL'),
  jwtSecret: obrigatoria('JWT_SECRET'),
  jwtExpiresIn: opcional('JWT_EXPIRES_IN', '8h'),
  bcryptRounds: Number.parseInt(opcional('BCRYPT_ROUNDS', '10'), 10),
  port: Number.parseInt(opcional('PORT', '3000'), 10),
  nodeEnv: opcional('NODE_ENV', 'development'),
  logLevel: opcional('LOG_LEVEL', 'info'),
});
