import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { AgendaMapper } from '../../mappers/AgendaMapper.js';

export class ListarAgendaFuncionario {
  constructor({ agendaRepository, funcionarioRepository }) {
    this.agendaRepository = agendaRepository;
    this.funcionarioRepository = funcionarioRepository;
  }
  async executar(funcionarioId) {
    const f = await this.funcionarioRepository.buscarPorId(funcionarioId);
    if (!f) throw new NotFoundError('Funcionario nao encontrado.');
    const janelas = await this.agendaRepository.listarPorFuncionario(funcionarioId);
    return janelas.map(AgendaMapper.janelaParaDto);
  }
}
