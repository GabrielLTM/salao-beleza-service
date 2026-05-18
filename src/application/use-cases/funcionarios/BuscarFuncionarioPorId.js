import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { FuncionarioMapper } from '../../mappers/FuncionarioMapper.js';

export class BuscarFuncionarioPorId {
  constructor({ funcionarioRepository }) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async executar(id) {
    const f = await this.funcionarioRepository.buscarPorId(id);
    if (!f) throw new NotFoundError('Funcionario nao encontrado.');
    return FuncionarioMapper.paraDto(f);
  }
}
