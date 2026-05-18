import { Router } from 'express';
import { autorizar } from '../middlewares/autorizar.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

export function criarRotasAnalise({ analiseController, autenticar }) {
  const router = Router();
  router.use(autenticar);
  router.use(autorizar(NivelPermissao.GERENTE));

  router.get('/funcionarios', analiseController.funcionarios);
  router.get('/servicos', analiseController.servicos);
  router.get('/faturamento', analiseController.faturamento);
  return router;
}
