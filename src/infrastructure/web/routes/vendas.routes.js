import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import { registrarVendaSchema } from '../../validation/schemas/vendaSchemas.js';

export function criarRotasVendas({ vendaController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, vendaController.index);
  router.get('/:id', validarParams(paramIdSchema), vendaController.show);
  router.post('/', validarBody(registrarVendaSchema), vendaController.store);
  return router;
}
