import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { autorizar } from '../middlewares/autorizar.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarServicoSchema,
  editarServicoSchema,
} from '../../validation/schemas/servicoSchemas.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

export function criarRotasServicos({ servicoController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, servicoController.index);
  router.get('/:id', validarParams(paramIdSchema), servicoController.show);
  router.post('/', autorizar(NivelPermissao.GERENTE), validarBody(cadastrarServicoSchema), servicoController.store);
  router.put(
    '/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    validarBody(editarServicoSchema),
    servicoController.update,
  );
  router.delete('/:id', autorizar(NivelPermissao.GERENTE), validarParams(paramIdSchema), servicoController.destroy);

  return router;
}
