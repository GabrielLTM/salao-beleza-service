import { Agendamento, StatusAgendamento } from '../../domain/entities/Agendamento.js';
import { ConflictError } from '../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { AgendamentoMapper } from '../mappers/AgendamentoMapper.js';

function formatarHHmm(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export class AgendamentoService {
  /**
   * @param {{
   *   agendamentoRepository:any,
   *   clienteRepository:any,
   *   funcionarioRepository:any,
   *   servicoRepository:any,
   *   agendaRepository:any,
   * }} deps
   */
  constructor({
    agendamentoRepository,
    clienteRepository,
    funcionarioRepository,
    servicoRepository,
    agendaRepository,
  }) {
    this.agendamentoRepository = agendamentoRepository;
    this.clienteRepository = clienteRepository;
    this.funcionarioRepository = funcionarioRepository;
    this.servicoRepository = servicoRepository;
    this.agendaRepository = agendaRepository;
  }

  async listar({ pagina, tamanho, funcionarioId, clienteId, inicio, fim }) {
    const { itens, total } = await this.agendamentoRepository.listar({
      pagina, tamanho, funcionarioId, clienteId, inicio, fim,
    });
    return { itens: itens.map(AgendamentoMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const a = await this.agendamentoRepository.buscarPorId(id);
    if (!a) throw new NotFoundError('Agendamento nao encontrado.');
    return AgendamentoMapper.paraDto(a);
  }

  async criar(entrada) {
    const { dataHoraInicio, dataHoraFim } = await this._validarConflito(entrada);

    const a = new Agendamento({
      clienteId: entrada.clienteId,
      funcionarioId: entrada.funcionarioId,
      servicoIds: entrada.servicoIds,
      dataHoraInicio,
      dataHoraFim,
      status: StatusAgendamento.AGENDADO,
    });

    const salvo = await this.agendamentoRepository.criar({
      id: a.id,
      clienteId: a.clienteId,
      funcionarioId: a.funcionarioId,
      servicoIds: a.servicoIds,
      dataHoraInicio: a.dataHoraInicio,
      dataHoraFim: a.dataHoraFim,
      status: a.status,
    });
    return AgendamentoMapper.paraDto(salvo);
  }

  async editar(id, entrada) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');

    const { dataHoraInicio, dataHoraFim } = await this._validarConflito(entrada, id);

    const a = new Agendamento({
      id,
      clienteId: entrada.clienteId,
      funcionarioId: entrada.funcionarioId,
      servicoIds: entrada.servicoIds,
      dataHoraInicio,
      dataHoraFim,
      status: entrada.status ?? atual.status,
    });

    const salvo = await this.agendamentoRepository.atualizar({
      id: a.id,
      clienteId: a.clienteId,
      funcionarioId: a.funcionarioId,
      servicoIds: a.servicoIds,
      dataHoraInicio: a.dataHoraInicio,
      dataHoraFim: a.dataHoraFim,
      status: a.status,
    });
    return AgendamentoMapper.paraDto(salvo);
  }

  async cancelar(id) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');
    const cancelado = await this.agendamentoRepository.cancelar(id);
    return AgendamentoMapper.paraDto(cancelado);
  }

  async excluir(id) {
    const atual = await this.agendamentoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Agendamento nao encontrado.');
    await this.agendamentoRepository.excluir(id);
  }

  /**
   * Valida regras de negocio do agendamento:
   * 1. Cliente, funcionario e todos os servicos existem.
   * 2. A duracao total e a soma das duracoes dos servicos selecionados.
   * 3. Periodo cabe em alguma janela da agenda do funcionario para o dia.
   * 4. Sem sobreposicao com outro agendamento ativo.
   */
  async _validarConflito(entrada, idEditando) {
    const servicoIds = Array.isArray(entrada.servicoIds) ? entrada.servicoIds : [];
    if (servicoIds.length === 0) {
      throw new ConflictError('servicoIds deve conter pelo menos um servico.');
    }

    const [cliente, funcionario, servicos] = await Promise.all([
      this.clienteRepository.buscarPorId(entrada.clienteId),
      this.funcionarioRepository.buscarPorId(entrada.funcionarioId),
      this.servicoRepository.buscarVariosPorIds(servicoIds),
    ]);
    if (!cliente) throw new NotFoundError('Cliente nao encontrado.');
    if (!funcionario) throw new NotFoundError('Funcionario nao encontrado.');
    if (servicos.length !== new Set(servicoIds).size) {
      throw new NotFoundError('Um ou mais servicos nao foram encontrados.');
    }

    const inicio = entrada.dataHoraInicio instanceof Date
      ? entrada.dataHoraInicio
      : new Date(entrada.dataHoraInicio);
    if (Number.isNaN(inicio.getTime())) {
      throw new ConflictError('dataHoraInicio invalida.');
    }
    const duracaoTotal = servicos.reduce((acc, s) => acc + s.duracaoMinutos, 0);
    const fim = new Date(inicio.getTime() + duracaoTotal * 60_000);

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

    return { dataHoraInicio: inicio, dataHoraFim: fim, servicos };
  }
}
