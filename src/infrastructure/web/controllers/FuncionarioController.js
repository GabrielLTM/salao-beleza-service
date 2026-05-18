import { Resultado } from '../helpers/Resultado.js';

export class FuncionarioController {
  constructor({ listar, buscarPorId, criar, editar, excluir }) {
    this.listar = listar;
    this.buscarPorId = buscarPorId;
    this.criar = criar;
    this.editar = editar;
    this.excluir = excluir;
  }

  index = async (req, res, next) => {
    try {
      const dados = await this.listar.executar(req.paginacao);
      return res.json(Resultado.ok(dados));
    } catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try {
      const dados = await this.buscarPorId.executar(req.params.id);
      return res.json(Resultado.ok(dados));
    } catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try {
      const dados = await this.criar.executar(req.body);
      return res.status(201).json(Resultado.ok(dados, 'Funcionario criado com sucesso.'));
    } catch (e) { return next(e); }
  };

  update = async (req, res, next) => {
    try {
      const dados = await this.editar.executar(req.params.id, req.body);
      return res.json(Resultado.ok(dados, 'Funcionario atualizado com sucesso.'));
    } catch (e) { return next(e); }
  };

  destroy = async (req, res, next) => {
    try {
      await this.excluir.executar(req.params.id);
      return res.json(Resultado.ok(null, 'Funcionario excluido com sucesso.'));
    } catch (e) { return next(e); }
  };
}
