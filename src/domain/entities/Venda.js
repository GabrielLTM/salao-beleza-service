import { randomUUID } from 'node:crypto';
import { ValidationError } from '../errors/ValidationError.js';
import { ItemVenda } from './ItemVenda.js';

export class Venda {
  constructor({ id = randomUUID(), dataHora = new Date(), funcionarioId, clienteId = null, itens }) {
    const erros = [];
    if (!funcionarioId) erros.push('funcionarioId eh obrigatorio.');
    if (!Array.isArray(itens) || itens.length === 0) erros.push('venda deve possuir pelo menos um item.');
    if (erros.length > 0) throw new ValidationError('Venda invalida.', erros);

    this.id = id;
    this.dataHora = dataHora instanceof Date ? dataHora : new Date(dataHora);
    this.funcionarioId = funcionarioId;
    this.clienteId = clienteId;
    this.itens = itens.map((i) => (i instanceof ItemVenda ? i : new ItemVenda(i)));
    this.total = this.calcularTotal();
  }

  calcularTotal() {
    const total = this.itens.reduce((acc, item) => acc + item.subtotal(), 0);
    return Math.round(total * 100) / 100;
  }
}
