import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { env } from '../../config/env.js';
import { tratadorDeErros } from './middlewares/tratadorDeErros.js';
import { Resultado } from './helpers/Resultado.js';
import { openapiSpec } from './swagger/openapi.js';

import { criarRotasAuth } from './routes/auth.routes.js';
import { criarRotasFuncionarios } from './routes/funcionarios.routes.js';
import { criarRotasClientes } from './routes/clientes.routes.js';
import { criarRotasCategorias } from './routes/categorias.routes.js';
import { criarRotasServicos } from './routes/servicos.routes.js';
import { criarRotasProdutos } from './routes/produtos.routes.js';
import { criarRotasVendas } from './routes/vendas.routes.js';
import { criarRotasAgenda } from './routes/agenda.routes.js';
import { criarRotasAgendamentos } from './routes/agendamentos.routes.js';
import { criarRotasAnalise } from './routes/analise.routes.js';

function urlPublica(req) {
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http')
    .split(',')[0]
    .trim();
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${proto}://${host}`;
}

export function criarApp(container) {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ level: env.logLevel }));

  app.get('/saude', (_req, res) => res.json(Resultado.ok({ status: 'ok' }, 'API operacional.')));

  // Swagger UI em /docs e spec JSON cru em /docs.json.
  // servers[] e injetado pelo host/protocolo da requisicao para o "Try it out"
  // funcionar atras de proxy HTTPS (Render), evitando mixed content com localhost.
  app.get('/docs.json', (req, res) =>
    res.json({ ...openapiSpec, servers: [{ url: urlPublica(req), description: 'Atual' }] }),
  );
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      customSiteTitle: 'Salao API - Docs',
      swaggerOptions: { url: '/docs.json', persistAuthorization: true },
    }),
  );

  const { autenticar, controllers } = container;

  app.use('/auth', criarRotasAuth({ authController: controllers.auth }));
  app.use(
    '/funcionarios',
    criarRotasFuncionarios({ funcionarioController: controllers.funcionarios, autenticar }),
  );
  app.use('/clientes', criarRotasClientes({ clienteController: controllers.clientes, autenticar }));
  app.use('/categorias', criarRotasCategorias({ categoriaController: controllers.categorias, autenticar }));
  app.use('/servicos', criarRotasServicos({ servicoController: controllers.servicos, autenticar }));
  app.use('/produtos', criarRotasProdutos({ produtoController: controllers.produtos, autenticar }));
  app.use('/vendas', criarRotasVendas({ vendaController: controllers.vendas, autenticar }));
  app.use('/agenda', criarRotasAgenda({ agendaController: controllers.agenda, autenticar }));
  app.use(
    '/agendamentos',
    criarRotasAgendamentos({ agendamentoController: controllers.agendamentos, autenticar }),
  );
  app.use('/analise', criarRotasAnalise({ analiseController: controllers.analise, autenticar }));

  app.use((req, res) =>
    res.status(404).json(Resultado.falha('Rota nao encontrada.', [`${req.method} ${req.originalUrl}`])),
  );

  app.use(tratadorDeErros);

  return app;
}
