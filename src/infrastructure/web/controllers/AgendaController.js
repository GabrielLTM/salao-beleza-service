import { Resultado } from '../helpers/Resultado.js';

export class AgendaController {
  constructor({ listarAgenda, definirAgenda, removerJanela }) {
    this.listarAgenda = listarAgenda;
    this.definirAgenda = definirAgenda;
    this.removerJanela = removerJanela;
  }

  listarPorFuncionario = async (req, res, next) => {
    try {
      const dados = await this.listarAgenda.executar(req.params.id);
      return res.json(Resultado.ok({ funcionarioId: req.params.id, janelas: dados }));
    } catch (e) { return next(e); }
  };

  definirParaFuncionario = async (req, res, next) => {
    try {
      const dados = await this.definirAgenda.executar(req.params.id, req.body.janelas ?? []);
      return res.json(Resultado.ok({ funcionarioId: req.params.id, janelas: dados }, 'Agenda atualizada.'));
    } catch (e) { return next(e); }
  };

  removerJanelaPorId = async (req, res, next) => {
    try {
      await this.removerJanela.executar(req.params.id);
      return res.json(Resultado.ok(null, 'Janela removida.'));
    } catch (e) { return next(e); }
  };
}
