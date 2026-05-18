import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

function formatarHHmm(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Servico de dominio (aplicacao) que valida se um agendamento eh aceitavel:
 * 1) Cliente, funcionario e servico existem.
 * 2) Periodo cabe em alguma janela da agenda do funcionario para o dia da semana.
 * 3) Nao existe outro agendamento ATIVO do funcionario que se sobreponha.
 */
export class ValidadorConflitoAgendamento {
  constructor({
    clienteRepository,
    funcionarioRepository,
    servicoRepository,
    agendaRepository,
    agendamentoRepository,
  }) {
    this.clienteRepository = clienteRepository;
    this.funcionarioRepository = funcionarioRepository;
    this.servicoRepository = servicoRepository;
    this.agendaRepository = agendaRepository;
    this.agendamentoRepository = agendamentoRepository;
  }

  /**
   * @param {{clienteId:string, funcionarioId:string, servicoId:string, dataHoraInicio:Date}} entrada
   * @param {string} [idEditando] id do agendamento atual (exclui-lo da busca de conflitos)
   * @returns {Promise<{dataHoraInicio:Date, dataHoraFim:Date, servico:object}>}
   */
  async validar(entrada, idEditando) {
    const [cliente, funcionario, servico] = await Promise.all([
      this.clienteRepository.buscarPorId(entrada.clienteId),
      this.funcionarioRepository.buscarPorId(entrada.funcionarioId),
      this.servicoRepository.buscarPorId(entrada.servicoId),
    ]);
    if (!cliente) throw new NotFoundError('Cliente nao encontrado.');
    if (!funcionario) throw new NotFoundError('Funcionario nao encontrado.');
    if (!servico) throw new NotFoundError('Servico nao encontrado.');

    const inicio = entrada.dataHoraInicio instanceof Date
      ? entrada.dataHoraInicio
      : new Date(entrada.dataHoraInicio);
    if (Number.isNaN(inicio.getTime())) {
      throw new ConflictError('dataHoraInicio invalida.');
    }
    const fim = new Date(inicio.getTime() + servico.duracaoMinutos * 60_000);

    const diaSemana = inicio.getDay();
    const janelas = await this.agendaRepository.listarPorFuncionarioEDia(entrada.funcionarioId, diaSemana);
    if (janelas.length === 0) {
      throw new ConflictError('Funcionario sem agenda definida para o dia.');
    }
    const horaInicio = formatarHHmm(inicio);
    const horaFim = formatarHHmm(fim);
    const dentroDeJanela = janelas.some((j) => horaInicio >= j.horaInicio && horaFim <= j.horaFim);
    if (!dentroDeJanela) {
      throw new ConflictError('Horario fora da janela de agenda do funcionario.');
    }

    const conflitos = await this.agendamentoRepository.buscarConflitos(
      entrada.funcionarioId,
      inicio,
      fim,
      idEditando,
    );
    if (conflitos.length > 0) {
      throw new ConflictError('Conflito com outro agendamento existente para o funcionario.');
    }

    return { dataHoraInicio: inicio, dataHoraFim: fim, servico };
  }
}
