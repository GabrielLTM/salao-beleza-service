import { Venda } from '../../../domain/entities/Venda.js';
import { TipoItemVenda } from '../../../domain/entities/ItemVenda.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../../domain/errors/ValidationError.js';
import { VendaMapper } from '../../mappers/VendaMapper.js';

/**
 * Cria uma venda com seus itens em uma unica transacao.
 * Valida existencia de funcionario, cliente (se informado), produtos e servicos.
 */
export class RegistrarVenda {
  /**
   * @param {{
   *   vendaRepository:any,
   *   funcionarioRepository:any,
   *   clienteRepository:any,
   *   produtoRepository:any,
   *   servicoRepository:any,
   * }} deps
   */
  constructor({ vendaRepository, funcionarioRepository, clienteRepository, produtoRepository, servicoRepository }) {
    this.vendaRepository = vendaRepository;
    this.funcionarioRepository = funcionarioRepository;
    this.clienteRepository = clienteRepository;
    this.produtoRepository = produtoRepository;
    this.servicoRepository = servicoRepository;
  }

  async executar(entrada) {
    const funcionario = await this.funcionarioRepository.buscarPorId(entrada.funcionarioId);
    if (!funcionario) throw new NotFoundError('Funcionario nao encontrado.');

    if (entrada.clienteId) {
      const cliente = await this.clienteRepository.buscarPorId(entrada.clienteId);
      if (!cliente) throw new NotFoundError('Cliente nao encontrado.');
    }

    const idsProdutos = (entrada.itens ?? [])
      .filter((i) => i.tipo === TipoItemVenda.PRODUTO)
      .map((i) => i.produtoId);
    const idsServicos = (entrada.itens ?? [])
      .filter((i) => i.tipo === TipoItemVenda.SERVICO)
      .map((i) => i.servicoId);

    if (idsProdutos.length > 0) {
      const produtos = await this.produtoRepository.buscarVariosPorIds(idsProdutos);
      if (produtos.length !== new Set(idsProdutos).size) {
        throw new ValidationError('Um ou mais produtos da venda nao foram encontrados.');
      }
    }
    if (idsServicos.length > 0) {
      const servicos = await this.servicoRepository.buscarVariosPorIds(idsServicos);
      if (servicos.length !== new Set(idsServicos).size) {
        throw new ValidationError('Um ou mais servicos da venda nao foram encontrados.');
      }
    }

    const venda = new Venda({
      funcionarioId: entrada.funcionarioId,
      clienteId: entrada.clienteId ?? null,
      dataHora: entrada.dataHora ? new Date(entrada.dataHora) : new Date(),
      itens: entrada.itens ?? [],
    });

    const salva = await this.vendaRepository.criar({
      id: venda.id,
      dataHora: venda.dataHora,
      total: venda.total,
      funcionarioId: venda.funcionarioId,
      clienteId: venda.clienteId,
      itens: venda.itens.map((i) => ({
        id: i.id,
        tipo: i.tipo,
        produtoId: i.produtoId,
        servicoId: i.servicoId,
        quantidade: i.quantidade,
        valorUnitario: i.valorUnitario,
      })),
    });
    return VendaMapper.paraDto(salva);
  }
}
