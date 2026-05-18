import { ProdutoMapper } from '../../mappers/ProdutoMapper.js';

export class ListarProdutos {
  constructor({ produtoRepository }) { this.produtoRepository = produtoRepository; }
  async executar({ pagina, tamanho }) {
    const { itens, total } = await this.produtoRepository.listar({ pagina, tamanho });
    return { itens: itens.map(ProdutoMapper.paraDto), pagina, tamanho, total };
  }
}
