import { Categoria } from '../../../domain/entities/Categoria.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { CategoriaMapper } from '../../mappers/CategoriaMapper.js';

export class EditarCategoria {
  constructor({ categoriaRepository, servicoRepository }) {
    this.categoriaRepository = categoriaRepository;
    this.servicoRepository = servicoRepository;
  }

  async executar(id, entrada) {
    const atual = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!atual) throw new NotFoundError('Categoria nao encontrada.');

    const novaCategoria = new Categoria({ id, nome: entrada.nome });
    const servicoIdsNovos = Array.isArray(entrada.servicoIds) ? entrada.servicoIds : [];

    if (servicoIdsNovos.length > 0) {
      const encontrados = await this.servicoRepository.buscarVariosPorIds(servicoIdsNovos);
      if (encontrados.length !== servicoIdsNovos.length) {
        const idsEncontrados = new Set(encontrados.map((s) => s.id));
        const faltantes = servicoIdsNovos.filter((sid) => !idsEncontrados.has(sid));
        throw new NotFoundError(`Servicos nao encontrados: ${faltantes.join(', ')}`);
      }
    }

    await this.categoriaRepository.atualizar({ id: novaCategoria.id, nome: novaCategoria.nome });

    if (servicoIdsNovos.length > 0) {
      await this.servicoRepository.definirCategoriaParaIds(servicoIdsNovos, id);
    }

    const salva = await this.categoriaRepository.buscarPorIdComServicos(id);
    return CategoriaMapper.paraDto(salva);
  }
}
