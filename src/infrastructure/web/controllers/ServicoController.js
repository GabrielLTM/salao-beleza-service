import { Resultado } from '../helpers/Resultado.js';

export class ServicoController {
  constructor({ listar, buscarPorId, criar, editar, excluir }) {
    this.listar = listar;
    this.buscarPorId = buscarPorId;
    this.criar = criar;
    this.editar = editar;
    this.excluir = excluir;
  }

  index = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.listar.executar(req.paginacao))); } catch (e) { return next(e); }
  };
  show = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.buscarPorId.executar(req.params.id))); } catch (e) { return next(e); }
  };
  store = async (req, res, next) => {
    try { return res.status(201).json(Resultado.ok(await this.criar.executar(req.body), 'Servico criado com sucesso.')); }
    catch (e) { return next(e); }
  };
  update = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.editar.executar(req.params.id, req.body), 'Servico atualizado com sucesso.')); }
    catch (e) { return next(e); }
  };
  destroy = async (req, res, next) => {
    try { await this.excluir.executar(req.params.id); return res.json(Resultado.ok(null, 'Servico excluido com sucesso.')); }
    catch (e) { return next(e); }
  };
}
