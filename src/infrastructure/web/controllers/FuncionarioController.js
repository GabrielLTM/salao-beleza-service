import { Resultado } from '../helpers/Resultado.js';

export class FuncionarioController {
  /** @param {{ funcionarioService: import('../../../application/services/FuncionarioService.js').FuncionarioService }} deps */
  constructor({ funcionarioService }) {
    this.service = funcionarioService;
  }

  index = async (req, res, next) => {
    try {
      return res.json(Resultado.ok(await this.service.listar(req.paginacao)));
    } catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try {
      return res.json(Resultado.ok(await this.service.buscarPorId(req.params.id)));
    } catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try {
      return res.status(201).json(Resultado.ok(await this.service.criar(req.body), 'Funcionario criado com sucesso.'));
    } catch (e) { return next(e); }
  };

  update = async (req, res, next) => {
    try {
      return res.json(Resultado.ok(await this.service.editar(req.params.id, req.body), 'Funcionario atualizado com sucesso.'));
    } catch (e) { return next(e); }
  };

  destroy = async (req, res, next) => {
    try {
      await this.service.excluir(req.params.id);
      return res.json(Resultado.ok(null, 'Funcionario excluido com sucesso.'));
    } catch (e) { return next(e); }
  };
}
