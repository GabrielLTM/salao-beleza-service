import { Produto } from '../../domain/entities/Produto.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ProdutoMapper } from '../mappers/ProdutoMapper.js';

export class ProdutoService {
  constructor({ produtoRepository }) {
    this.produtoRepository = produtoRepository;
  }

  async listar({ pagina, tamanho }) {
    const { itens, total } = await this.produtoRepository.listar({ pagina, tamanho });
    return { itens: itens.map(ProdutoMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const p = await this.produtoRepository.buscarPorId(id);
    if (!p) throw new NotFoundError('Produto nao encontrado.');
    return ProdutoMapper.paraDto(p);
  }

  async criar(entrada) {
    const p = new Produto(entrada);
    const salvo = await this.produtoRepository.criar({
      id: p.id, nome: p.nome, valor: p.valor, caminhoImagem: p.caminhoImagem, status: p.status,
      percentualComissao: p.percentualComissao,
    });
    return ProdutoMapper.paraDto(salvo);
  }

  async editar(id, entrada) {
    const atual = await this.produtoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Produto nao encontrado.');
    const p = new Produto({ ...entrada, id });
    const salvo = await this.produtoRepository.atualizar({
      id: p.id, nome: p.nome, valor: p.valor, caminhoImagem: p.caminhoImagem, status: p.status,
      percentualComissao: p.percentualComissao,
    });
    return ProdutoMapper.paraDto(salvo);
  }

  async excluir(id) {
    const atual = await this.produtoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Produto nao encontrado.');
    await this.produtoRepository.excluir(id);
  }
}
