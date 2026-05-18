import { Resultado } from '../helpers/Resultado.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';

function obterPeriodoDaQuery(req) {
  if (!req.query.inicio || !req.query.fim) {
    throw new ValidationError('Parametros invalidos.', ['inicio e fim sao obrigatorios (ISO 8601).']);
  }
  const inicio = new Date(req.query.inicio);
  const fim = new Date(req.query.fim);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    throw new ValidationError('Parametros invalidos.', ['inicio/fim invalidos.']);
  }
  if (inicio.getTime() > fim.getTime()) {
    throw new ValidationError('Parametros invalidos.', ['inicio deve ser <= fim.']);
  }
  return { inicio, fim };
}

export class AnaliseController {
  constructor({ desempenhoPorFuncionario, servicosMaisVendidos, faturamentoPorPeriodo }) {
    this.desempenhoPorFuncionario = desempenhoPorFuncionario;
    this.servicosMaisVendidos = servicosMaisVendidos;
    this.faturamentoPorPeriodo = faturamentoPorPeriodo;
  }

  funcionarios = async (req, res, next) => {
    try {
      const periodo = obterPeriodoDaQuery(req);
      return res.json(Resultado.ok(await this.desempenhoPorFuncionario.executar(periodo)));
    } catch (e) { return next(e); }
  };

  servicos = async (req, res, next) => {
    try {
      const periodo = obterPeriodoDaQuery(req);
      const limite = Math.min(Math.max(Number.parseInt(req.query.limite, 10) || 10, 1), 50);
      return res.json(Resultado.ok(await this.servicosMaisVendidos.executar({ ...periodo, limite })));
    } catch (e) { return next(e); }
  };

  faturamento = async (req, res, next) => {
    try {
      const periodo = obterPeriodoDaQuery(req);
      return res.json(Resultado.ok(await this.faturamentoPorPeriodo.executar(periodo)));
    } catch (e) { return next(e); }
  };
}
