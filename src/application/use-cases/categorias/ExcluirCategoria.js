import { ConflictError } from '../../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirCategoria {
  constructor({ categoriaRepository }) { this.categoriaRepository = categoriaRepository; }
  async executar(id) {
    const atual = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!atual) throw new NotFoundError('Categoria nao encontrada.');
    if ((atual.servicos ?? []).length > 0) {
      throw new ConflictError('Nao eh possivel excluir uma categoria que possui servicos vinculados.');
    }
    await this.categoriaRepository.excluir(id);
  }
}
