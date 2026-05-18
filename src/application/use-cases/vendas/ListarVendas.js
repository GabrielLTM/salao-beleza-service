import { VendaMapper } from '../../mappers/VendaMapper.js';

export class ListarVendas {
  constructor({ vendaRepository }) { this.vendaRepository = vendaRepository; }
  async executar({ pagina, tamanho, funcionarioId, clienteId }) {
    const { itens, total } = await this.vendaRepository.listar({ pagina, tamanho, funcionarioId, clienteId });
    return { itens: itens.map(VendaMapper.paraDto), pagina, tamanho, total };
  }
}
