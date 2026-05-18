import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirProduto {
  constructor({ produtoRepository }) { this.produtoRepository = produtoRepository; }
  async executar(id) {
    const atual = await this.produtoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Produto nao encontrado.');
    await this.produtoRepository.excluir(id);
  }
}
