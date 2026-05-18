import { Agendamento } from '../../../domain/entities/Agendamento.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendamentoMapper } from '../../mappers/AgendamentoMapper.js';

export class EditarAgendamento {
  constructor({ agendamentoRepository, validadorConflito }) {
    this.agendamentoRepository = agendamentoRepository;
    this.validadorConflito = validadorConflito;
  }

  async executar(id, entrada) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');

    const { dataHoraInicio, dataHoraFim } = await this.validadorConflito.validar(
      {
        clienteId: entrada.clienteId,
        funcionarioId: entrada.funcionarioId,
        servicoId: entrada.servicoId,
        dataHoraInicio: entrada.dataHoraInicio,
      },
      id,
    );

    const a = new Agendamento({
      id,
      clienteId: entrada.clienteId,
      funcionarioId: entrada.funcionarioId,
      servicoId: entrada.servicoId,
      dataHoraInicio,
      dataHoraFim,
      status: entrada.status ?? atual.status,
    });

    const salvo = await this.agendamentoRepository.atualizar({
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
