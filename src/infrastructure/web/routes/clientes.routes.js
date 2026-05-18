import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarClienteSchema,
  editarClienteSchema,
} from '../../validation/schemas/clienteSchemas.js';

export function criarRotasClientes({ clienteController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, clienteController.index);
  router.get('/:id', validarParams(paramIdSchema), clienteController.show);
  router.post('/', validarBody(cadastrarClienteSchema), clienteController.store);
  router.put('/:id', validarParams(paramIdSchema), validarBody(editarClienteSchema), clienteController.update);
  router.delete('/:id', validarParams(paramIdSchema), clienteController.destroy);

  return router;
}
