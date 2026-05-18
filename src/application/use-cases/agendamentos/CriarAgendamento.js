import { Agendamento, StatusAgendamento } from '../../../domain/entities/Agendamento.js';
import { AgendamentoMapper } from '../../mappers/AgendamentoMapper.js';

export class CriarAgendamento {
  constructor({ agendamentoRepository, validadorConflito }) {
    this.agendamentoRepository = agendamentoRepository;
    this.validadorConflito = validadorConflito;
  }

  async executar(entrada) {
    const { dataHoraInicio, dataHoraFim } = await this.validadorConflito.validar({
      clienteId: entrada.clienteId,
      funcionarioId: entrada.funcionarioId,
      servicoId: entrada.servicoId,
      dataHoraInicio: entrada.dataHoraInicio,
    });

    const a = new Agendamento({
      clienteId: entrada.clienteId,
      funcionarioId: entrada.funcionarioId,
      servicoId: entrada.servicoId,
      dataHoraInicio,
      dataHoraFim,
      status: StatusAgendamento.AGENDADO,
    });

    const salvo = await this.agendamentoRepository.criar({
      id: a.id,
      clienteId: a.clienteId,
      funcionarioId: a.funcionarioId,
      servicoId: a.servicoId,
      dataHoraInicio: a.dataHoraInicio,
      dataHoraFim: a.dataHoraFim,
      status: a.status,
    });
    return AgendamentoMapper.paraDto(salvo);
  }
}
