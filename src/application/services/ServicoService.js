import { Servico } from '../../domain/entities/Servico.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ServicoMapper } from '../mappers/ServicoMapper.js';

export class ServicoService {
  /** @param {{servicoRepository:any, categoriaRepository:any}} deps */
  constructor({ servicoRepository, categoriaRepository }) {
    this.servicoRepository = servicoRepository;
    this.categoriaRepository = categoriaRepository;
  }

  async listar({ pagina, tamanho }) {
    const { itens, total } = await this.servicoRepository.listarComCategoria({ pagina, tamanho });
    return { itens: itens.map(ServicoMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const s = await this.servicoRepository.buscarPorIdComCategoria(id);
    if (!s) throw new NotFoundError('Servico nao encontrado.');
    return ServicoMapper.paraDto(s);
  }

  async criar(entrada) {
    const servico = new Servico(entrada);
    const categoria = await this.categoriaRepository.buscarPorIdComServicos(servico.categoriaId);
    if (!categoria) throw new NotFoundError('Categoria nao encontrada.');

    const salvo = await this.servicoRepository.criar({
      id: servico.id,
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      precoMinimo: servico.precoMinimo,
      categoriaId: servico.categoriaId,
      status: servico.status,
      percentualComissao: servico.percentualComissao,
    });
    return ServicoMapper.paraDto({ ...salvo, nomeCategoria: categoria.nome });
  }

  async editar(id, entrada) {
    const atual = await this.servicoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Servico nao encontrado.');

    const servico = new Servico({ ...entrada, id });
    const categoria = await this.categoriaRepository.buscarPorIdComServicos(servico.categoriaId);
    if (!categoria) throw new NotFoundError('Categoria nao encontrada.');

    const salvo = await this.servicoRepository.atualizar({
      id: servico.id,
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      precoMinimo: servico.precoMinimo,
      categoriaId: servico.categoriaId,
      status: servico.status,
      percentualComissao: servico.percentualComissao,
    });
    return ServicoMapper.paraDto({ ...salvo, nomeCategoria: categoria.nome });
  }

  async excluir(id) {
    const atual = await this.servicoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Servico nao encontrado.');
    await this.servicoRepository.excluir(id);
  }
}
