import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { autorizar } from '../middlewares/autorizar.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarProdutoSchema,
  editarProdutoSchema,
} from '../../validation/schemas/produtoSchemas.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

export function criarRotasProdutos({ produtoController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, produtoController.index);
  router.get('/:id', validarParams(paramIdSchema), produtoController.show);
  router.post('/', autorizar(NivelPermissao.GERENTE), validarBody(cadastrarProdutoSchema), produtoController.store);
  router.put(
    '/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    validarBody(editarProdutoSchema),
    produtoController.update,
  );
  router.delete('/:id', autorizar(NivelPermissao.GERENTE), validarParams(paramIdSchema), produtoController.destroy);

  return router;
}
