import { Categoria } from '../../../domain/entities/Categoria.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { CategoriaMapper } from '../../mappers/CategoriaMapper.js';

export class CriarCategoria {
  /** @param {{categoriaRepository:any, servicoRepository:any}} deps */
  constructor({ categoriaRepository, servicoRepository }) {
    this.categoriaRepository = categoriaRepository;
    this.servicoRepository = servicoRepository;
  }

  async executar(entrada) {
    const categoria = new Categoria({ nome: entrada.nome });
    const servicoIds = Array.isArray(entrada.servicoIds) ? entrada.servicoIds : [];

    if (servicoIds.length > 0) {
      const encontrados = await this.servicoRepository.buscarVariosPorIds(servicoIds);
      if (encontrados.length !== servicoIds.length) {
        const idsEncontrados = new Set(encontrados.map((s) => s.id));
        const faltantes = servicoIds.filter((id) => !idsEncontrados.has(id));
        throw new NotFoundError(`Servicos nao encontrados: ${faltantes.join(', ')}`);
      }
    }

    await this.categoriaRepository.criar({ id: categoria.id, nome: categoria.nome });

    if (servicoIds.length > 0) {
      await this.servicoRepository.definirCategoriaParaIds(servicoIds, categoria.id);
    }

    const salva = await this.categoriaRepository.buscarPorIdComServicos(categoria.id);
    if (!salva) throw new ValidationError('Falha ao persistir categoria.');
    return CategoriaMapper.paraDto(salva);
  }
}
