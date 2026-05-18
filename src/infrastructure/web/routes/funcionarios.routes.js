import { Router } from 'express';
import { validarBody, validarParams } from '../middlewares/validar.js';
import { paginacao } from '../middlewares/paginacao.js';
import { autorizar } from '../middlewares/autorizar.js';
import { paramIdSchema } from '../../validation/schemas/comuns.js';
import {
  cadastrarFuncionarioSchema,
  editarFuncionarioSchema,
} from '../../validation/schemas/funcionarioSchemas.js';
import { NivelPermissao } from '../../../domain/value-objects/NivelPermissao.js';

/** @param {{ funcionarioController:any, autenticar:Function }} deps */
export function criarRotasFuncionarios({ funcionarioController, autenticar }) {
  const router = Router();
  router.use(autenticar);

  router.get('/', paginacao, funcionarioController.index);
  router.get('/:id', validarParams(paramIdSchema), funcionarioController.show);
  router.post(
    '/',
    autorizar(NivelPermissao.GERENTE),
    validarBody(cadastrarFuncionarioSchema),
    funcionarioController.store,
  );
  router.put(
    '/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    validarBody(editarFuncionarioSchema),
    funcionarioController.update,
  );
  router.delete(
    '/:id',
    autorizar(NivelPermissao.GERENTE),
    validarParams(paramIdSchema),
    funcionarioController.destroy,
  );

  return router;
}
