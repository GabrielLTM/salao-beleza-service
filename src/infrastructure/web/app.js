import express from 'express';
import pinoHttp from 'pino-http';
import { env } from '../../config/env.js';
import { tratadorDeErros } from './middlewares/tratadorDeErros.js';
import { Resultado } from './helpers/Resultado.js';

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

export function criarApp(container) {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ level: env.logLevel }));

  app.get('/saude', (_req, res) => res.json(Resultado.ok({ status: 'ok' }, 'API operacional.')));

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
