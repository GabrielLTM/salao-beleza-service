import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { autorizar } from '../middlewares/autorizar.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import { definirAgendaSchema } from '../../validation/schemas/agendaSchemas.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

export function criarRotasAgenda({ agendaController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/funcionarios/:id', validarParams(paramIdSchema), agendaController.listarPorFuncionario);
  router.put(
    '/funcionarios/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    validarBody(definirAgendaSchema),
    agendaController.definirParaFuncionario,
  );
  router.delete(
    '/janelas/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    agendaController.removerJanelaPorId,
  );

  return router;
}
