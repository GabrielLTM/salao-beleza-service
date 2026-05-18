import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { autorizar } from '../middlewares/autorizar.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarCategoriaSchema,
  editarCategoriaSchema,
} from '../../validation/schemas/categoriaSchemas.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

export function criarRotasCategorias({ categoriaController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, categoriaController.index);
  router.get('/:id', validarParams(paramIdSchema), categoriaController.show);
  router.post('/', autorizar(NivelPermissao.GERENTE), validarBody(cadastrarCategoriaSchema), categoriaController.store);
  router.put(
    '/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    validarBody(editarCategoriaSchema),
    categoriaController.update,
  );
  router.delete('/:id', autorizar(NivelPermissao.GERENTE), validarParams(paramIdSchema), categoriaController.destroy);

  return router;
}
