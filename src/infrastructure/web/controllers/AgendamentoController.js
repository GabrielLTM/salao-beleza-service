import { Resultado } from '../helpers/Resultado.js';

export class AgendamentoController {
  /** @param {{ agendamentoService: import('../../../application/services/AgendamentoService.js').AgendamentoService }} deps */
  constructor({ agendamentoService }) {
    this.service = agendamentoService;
  }

  index = async (req, res, next) => {
    try {
      const dados = await this.service.listar({
        ...req.paginacao,
        funcionarioId: req.query.funcionarioId,
        clienteId: req.query.clienteId,
        inicio: req.query.inicio ? new Date(req.query.inicio) : undefined,
        fim: req.query.fim ? new Date(req.query.fim) : undefined,
      });
      return res.json(Resultado.ok(dados));
    } catch (e) { return next(e); }
  };

  show = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.buscarPorId(req.params.id))); }
    catch (e) { return next(e); }
  };

  store = async (req, res, next) => {
    try { return res.status(201).json(Resultado.ok(await this.service.criar(req.body), 'Agendamento criado.')); }
    catch (e) { return next(e); }
  };

  update = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.editar(req.params.id, req.body), 'Agendamento atualizado.')); }
    catch (e) { return next(e); }
  };

  cancelarAgendamento = async (req, res, next) => {
    try { return res.json(Resultado.ok(await this.service.cancelar(req.params.id), 'Agendamento cancelado.')); }
    catch (e) { return next(e); }
  };

  destroy = async (req, res, next) => {
    try { await this.service.excluir(req.params.id); return res.json(Resultado.ok(null, 'Agendamento excluido.')); }
    catch (e) { return next(e); }
  };
}
