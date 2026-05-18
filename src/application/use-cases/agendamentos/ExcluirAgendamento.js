import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirAgendamento {
  constructor({ agendamentoRepository }) { this.agendamentoRepository = agendamentoRepository; }
  async executar(id) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');
    await this.agendamentoRepository.excluir(id);
  }
}
