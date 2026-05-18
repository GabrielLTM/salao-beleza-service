import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarAgendamentoSchema,
  editarAgendamentoSchema,
} from '../../validation/schemas/agendamentoSchemas.js';

export function criarRotasAgendamentos({ agendamentoController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, agendamentoController.index);
  router.get('/:id', validarParams(paramIdSchema), agendamentoController.show);
  router.post('/', validarBody(cadastrarAgendamentoSchema), agendamentoController.store);
  router.put('/:id', validarParams(paramIdSchema), validarBody(editarAgendamentoSchema), agendamentoController.update);
  router.patch('/:id/cancelar', validarParams(paramIdSchema), agendamentoController.cancelarAgendamento);
  router.delete('/:id', validarParams(paramIdSchema), agendamentoController.destroy);

  return router;
}
