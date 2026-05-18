import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirFuncionario {
  constructor({ funcionarioRepository }) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async executar(id) {
    const atual = await this.funcionarioRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Funcionario nao encontrado.');
    await this.funcionarioRepository.excluir(id);
  }
}
