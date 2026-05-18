import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendamentoMapper } from '../../mappers/AgendamentoMapper.js';

export class BuscarAgendamentoPorId {
  constructor({ agendamentoRepository }) { this.agendamentoRepository = agendamentoRepository; }
  async executar(id) {
    const a = await this.agendamentoRepository.buscarPorId(id);
    if (!a) throw new NotFoundError('Agendamento nao encontrado.');
    return AgendamentoMapper.paraDto(a);
  }
}
