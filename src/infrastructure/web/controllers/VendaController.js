import { Resultado } from '../helpers/Resultado.js';

export class VendaController {
  /** @param {{ vendaService: import('../../../application/services/VendaService.js').VendaService }} deps */
  constructor({ vendaService }) {
    this.service = vendaService;
  }

  index = async (req, res, next) => {
    try {
      const dados = await this.service.listar({
        ...req.paginacao,
        funcionarioId: req.query.funcionarioId,
        clienteId: req.query.clienteId,
      });
      return res.json(Resultado.ok(dados));
    } catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.buscarPorId(req.params.id))); }
    catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try {
      return res.status(201).json(Resultado.ok(await this.service.registrar(req.body), 'Venda registrada com sucesso.'));
    } catch (e) { return next(e); }
  };
}
