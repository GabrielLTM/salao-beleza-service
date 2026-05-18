import { Produto } from '../../../domain/entities/Produto.js';
import { ProdutoMapper } from '../../mappers/ProdutoMapper.js';

export class CriarProduto {
  constructor({ produtoRepository }) { this.produtoRepository = produtoRepository; }
  async executar(entrada) {
    const p = new Produto(entrada);
    const salvo = await this.produtoRepository.criar({
      id: p.id, nome: p.nome, valor: p.valor, caminhoImagem: p.caminhoImagem, status: p.status,
    });
    return ProdutoMapper.paraDto(salvo);
  }
}
