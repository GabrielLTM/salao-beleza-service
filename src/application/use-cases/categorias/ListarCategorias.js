import { CategoriaMapper } from '../../mappers/CategoriaMapper.js';

export class ListarCategorias {
  constructor({ categoriaRepository }) { this.categoriaRepository = categoriaRepository; }
  async executar({ pagina, tamanho }) {
    const { itens, total } = await this.categoriaRepository.listarComServicos({ pagina, tamanho });
    return { itens: itens.map(CategoriaMapper.paraDto), pagina, tamanho, total };
  }
}
