import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class RemoverJanelaAgenda {
  constructor({ agendaRepository }) { this.agendaRepository = agendaRepository; }
  async executar(id) {
    const j = await this.agendaRepository.buscarJanelaPorId(id);
    if (!j) throw new NotFoundError('Janela de agenda nao encontrada.');
    await this.agendaRepository.removerJanela(id);
  }
}
