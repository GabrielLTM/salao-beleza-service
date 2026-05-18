import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ProdutoMapper } from '../../mappers/ProdutoMapper.js';

export class BuscarProdutoPorId {
  constructor({ produtoRepository }) { this.produtoRepository = produtoRepository; }
  async executar(id) {
    const p = await this.produtoRepository.buscarPorId(id);
    if (!p) throw new NotFoundError('Produto nao encontrado.');
    return ProdutoMapper.paraDto(p);
  }
}
