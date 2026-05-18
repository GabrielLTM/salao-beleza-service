import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { CategoriaMapper } from '../../mappers/CategoriaMapper.js';

export class BuscarCategoriaPorId {
  constructor({ categoriaRepository }) { this.categoriaRepository = categoriaRepository; }
  async executar(id) {
    const c = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!c) throw new NotFoundError('Categoria nao encontrada.');
    return CategoriaMapper.paraDto(c);
  }
}
