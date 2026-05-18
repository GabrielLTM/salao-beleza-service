import { Resultado } from '../helpers/Resultado.js';

export class AgendaController {
  /** @param {{ agendaService: import('../../../application/services/AgendaService.js').AgendaService }} deps */
  constructor({ agendaService }) {
    this.service = agendaService;
  }

  listarPorFuncionario = async (req, res, next) => {
    try {
      const dados = await this.service.listarPorFuncionario(req.params.id);
      return res.json(Resultado.ok({ funcionarioId: req.params.id, janelas: dados }));
    } catch (e) { return next(e); }
  };

  definirParaFuncionario = async (req, res, next) => {
    try {
      const dados = await this.service.definirParaFuncionario(req.params.id, req.body.janelas ?? []);
      return res.json(Resultado.ok({ funcionarioId: req.params.id, janelas: dados }, 'Agenda atualizada.'));
    } catch (e) { return next(e); }
  };

  removerJanelaPorId = async (req, res, next) => {
    try {
      await this.service.removerJanela(req.params.id);
      return res.json(Resultado.ok(null, 'Janela removida.'));
    } catch (e) { return next(e); }
  };
}
