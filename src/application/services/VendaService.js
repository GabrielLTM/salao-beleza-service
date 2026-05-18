import { Venda } from '../../domain/entities/Venda.js';
import { TipoItemVenda } from '../../domain/entities/ItemVenda.js';
import { NotFoundError } from '../../domain/errors/NotFoundError.js';
import { ValidationError } from '../../domain/errors/ValidationError.js';
import { VendaMapper } from '../mappers/VendaMapper.js';

export class VendaService {
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

  async listar({ pagina, tamanho, funcionarioId, clienteId }) {
    const { itens, total } = await this.vendaRepository.listar({ pagina, tamanho, funcionarioId, clienteId });
    return { itens: itens.map(VendaMapper.paraDto), pagina, tamanho, total };
  }

  async buscarPorId(id) {
    const v = await this.vendaRepository.buscarPorId(id);
    if (!v) throw new NotFoundError('Venda nao encontrada.');
    return VendaMapper.paraDto(v);
  }

  async registrar(entrada) {
    const funcionario = await this.funcionarioRepository.buscarPorId(entrada.funcionarioId);
    if (!funcionario) throw new NotFoundError('Funcionario nao encontrado.');

    if (entrada.clienteId) {
      const cliente = await this.clienteRepository.buscarPorId(entrada.clienteId);
      if (!cliente) throw new NotFoundError('Cliente nao encontrado.');
    }

    await this._validarReferenciasDosItens(entrada.itens ?? []);

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

  async _validarReferenciasDosItens(itens) {
    const idsProdutos = itens.filter((i) => i.tipo === TipoItemVenda.PRODUTO).map((i) => i.produtoId);
    const idsServicos = itens.filter((i) => i.tipo === TipoItemVenda.SERVICO).map((i) => i.servicoId);

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
  }
}
