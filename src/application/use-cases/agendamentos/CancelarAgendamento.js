import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendamentoMapper } from '../../mappers/AgendamentoMapper.js';

export class CancelarAgendamento {
  constructor({ agendamentoRepository }) { this.agendamentoRepository = agendamentoRepository; }
  async executar(id) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');
    const cancelado = await this.agendamentoRepository.cancelar(id);
    return AgendamentoMapper.paraDto(cancelado);
  }
}
