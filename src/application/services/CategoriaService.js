import { Categoria } from '../../domain/entities/Categoria.js';
import { ConflictError } from '../../domain/errors/ConflictError.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../domain/errors/ValidationError.js';
import { CategoriaMapper } from '../mappers/CategoriaMapper.js';

export class CategoriaService {
  /** @param {{categoriaRepository:any, servicoRepository:any}} deps */
  constructor({ categoriaRepository, servicoRepository }) {
    this.categoriaRepository = categoriaRepository;
    this.servicoRepository = servicoRepository;
  }

  async listar({ pagina, tamanho }) {
    const { itens, total } = await this.categoriaRepository.listarComServicos({ pagina, tamanho });
    return { itens: itens.map(CategoriaMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const c = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!c) throw new NotFoundError('Categoria nao encontrada.');
    return CategoriaMapper.paraDto(c);
  }

  async criar(entrada) {
    const categoria = new Categoria({ nome: entrada.nome });
    const servicoIds = Array.isArray(entrada.servicoIds) ? entrada.servicoIds : [];

    await this._garantirServicosExistem(servicoIds);

    await this.categoriaRepository.criar({ id: categoria.id, nome: categoria.nome });

    if (servicoIds.length > 0) {
      await this.servicoRepository.definirCategoriaParaIds(servicoIds, categoria.id);
    }

    const salva = await this.categoriaRepository.buscarPorIdComServicos(categoria.id);
    if (!salva) throw new ValidationError('Falha ao persistir categoria.');
    return CategoriaMapper.paraDto(salva);
  }

  async editar(id, entrada) {
    const atual = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!atual) throw new NotFoundError('Categoria nao encontrada.');

    const novaCategoria = new Categoria({ id, nome: entrada.nome });
    const servicoIdsNovos = Array.isArray(entrada.servicoIds) ? entrada.servicoIds : [];

    await this._garantirServicosExistem(servicoIdsNovos);

    await this.categoriaRepository.atualizar({ id: novaCategoria.id, nome: novaCategoria.nome });

    if (servicoIdsNovos.length > 0) {
      await this.servicoRepository.definirCategoriaParaIds(servicoIdsNovos, id);
    }

    const salva = await this.categoriaRepository.buscarPorIdComServicos(id);
    return CategoriaMapper.paraDto(salva);
  }

  async excluir(id) {
    const atual = await this.categoriaRepository.buscarPorIdComServicos(id);
    if (!atual) throw new NotFoundError('Categoria nao encontrada.');
    if ((atual.servicos ?? []).length > 0) {
      throw new ConflictError('Nao eh possivel excluir uma categoria que possui servicos vinculados.');
    }
    await this.categoriaRepository.excluir(id);
  }

  async _garantirServicosExistem(servicoIds) {
    if (servicoIds.length === 0) return;
    const encontrados = await this.servicoRepository.buscarVariosPorIds(servicoIds);
    if (encontrados.length !== servicoIds.length) {
      const idsEncontrados = new Set(encontrados.map((s) => s.id));
      const faltantes = servicoIds.filter((sid) => !idsEncontrados.has(sid));
      throw new NotFoundError(`Servicos nao encontrados: ${faltantes.join(', ')}`);
    }
  }
}
