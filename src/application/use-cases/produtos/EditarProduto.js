import { Produto } from '../../../domain/entities/Produto.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ProdutoMapper } from '../../mappers/ProdutoMapper.js';

export class EditarProduto {
  constructor({ produtoRepository }) { this.produtoRepository = produtoRepository; }
  async executar(id, entrada) {
    const atual = await this.produtoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Produto nao encontrado.');
    const p = new Produto({ ...entrada, id });
    const salvo = await this.produtoRepository.atualizar({
      id: p.id, nome: p.nome, valor: p.valor, caminhoImagem: p.caminhoImagem, status: p.status,
    });
    return ProdutoMapper.paraDto(salvo);
  }
}
