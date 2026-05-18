import { AgendamentoMapper } from '../../mappers/AgendamentoMapper.js';

export class ListarAgendamentos {
  constructor({ agendamentoRepository }) { this.agendamentoRepository = agendamentoRepository; }
  async executar({ pagina, tamanho, funcionarioId, clienteId, inicio, fim }) {
    const { itens, total } = await this.agendamentoRepository.listar({
      pagina, tamanho, funcionarioId, clienteId, inicio, fim,
    });
    return { itens: itens.map(AgendamentoMapper.paraDto), pagina, tamanho, total };
  }
}
