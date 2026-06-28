import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';

export const TipoItemVenda = Object.freeze({
  PRODUTO: 'PRODUTO',
  SERVICO: 'SERVICO',
});

export class ItemVenda {
  constructor({
    id = randomUUID(),
    tipo,
    produtoId = null,
    servicoId = null,
    quantidade,
    valorUnitario,
    percentualComissaoBase = 0,
    percentualComissaoFuncionario = 0,
  }) {
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
    // Snapshot dos percentuais vigentes no momento da venda (% do item e % do funcionario).
    this.percentualComissaoBase = Number(percentualComissaoBase) || 0;
    this.percentualComissaoFuncionario = Number(percentualComissaoFuncionario) || 0;
  }

  subtotal() {
    return this.quantidade * this.valorUnitario;
  }

  /**
   * Comissao do item: incide o percentual do funcionario sobre o percentual do item,
   * nao sobre o valor de venda. Ex.: subtotal 100, item 80%, funcionario 5% => 4,00.
   */
  valorComissao() {
    const bruto = this.subtotal() * (this.percentualComissaoBase / 100) * (this.percentualComissaoFuncionario / 100);
    return Math.round(bruto * 100) / 100;
  }
}
