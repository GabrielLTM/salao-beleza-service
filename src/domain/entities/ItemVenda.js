import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

export const TipoItemVenda = Object.freeze({
  PRODUTO: 'PRODUTO',
  SERVICO: 'SERVICO',
});

export class ItemVenda {
  constructor({ id = randomUUID(), tipo, produtoId = null, servicoId = null, quantidade, valorUnitario }) {
    const erros = [];
    if (tipo !== TipoItemVenda.PRODUTO && tipo !== TipoItemVenda.SERVICO) {
      erros.push('tipo do item deve ser PRODUTO ou SERVICO.');
    }
    if (tipo === TipoItemVenda.PRODUTO && !produtoId) erros.push('produtoId obrigatorio para item PRODUTO.');
    if (tipo === TipoItemVenda.SERVICO && !servicoId) erros.push('servicoId obrigatorio para item SERVICO.');
    if (!Number.isInteger(Number(quantidade)) || Number(quantidade) <= 0) {
      erros.push('quantidade deve ser um inteiro > 0.');
    }
    if (!Number.isFinite(Number(valorUnitario)) || Number(valorUnitario) < 0) {
      erros.push('valorUnitario deve ser >= 0.');
    }
    if (erros.length > 0) throw new ValidationError('Item de venda invalido.', erros);

    this.id = id;
    this.tipo = tipo;
    this.produtoId = tipo === TipoItemVenda.PRODUTO ? produtoId : null;
    this.servicoId = tipo === TipoItemVenda.SERVICO ? servicoId : null;
    this.quantidade = Number(quantidade);
    this.valorUnitario = Number(valorUnitario);
  }

  subtotal() {
    return this.quantidade * this.valorUnitario;
  }
}
