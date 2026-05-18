import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirServico {
  constructor({ servicoRepository }) { this.servicoRepository = servicoRepository; }
  async executar(id) {
    const atual = await this.servicoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Servico nao encontrado.');
    await this.servicoRepository.excluir(id);
  }
}
