import { Resultado } from '../helpers/Resultado.js';

export class VendaController {
  constructor({ registrar, listar, buscarPorId }) {
    this.registrar = registrar;
    this.listar = listar;
    this.buscarPorId = buscarPorId;
  }

  index = async (req, res, next) => {
    try {
      const dados = await this.listar.executar({
        ...req.paginacao,
        funcionarioId: req.query.funcionarioId,
        clienteId: req.query.clienteId,
      });
      return res.json(Resultado.ok(dados));
    } catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.buscarPorId.executar(req.params.id))); } catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try { return res.status(201).json(Resultado.ok(await this.registrar.executar(req.body), 'Venda registrada com sucesso.')); }
    catch (e) { return next(e); }
  };
}
