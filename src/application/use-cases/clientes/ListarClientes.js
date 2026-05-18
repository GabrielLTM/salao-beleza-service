import { ClienteMapper } from '../../mappers/ClienteMapper.js';

export class ListarClientes {
  constructor({ clienteRepository }) { this.clienteRepository = clienteRepository; }
  async executar({ pagina, tamanho }) {
    const { itens, total } = await this.clienteRepository.listar({ pagina, tamanho });
    return { itens: itens.map(ClienteMapper.paraDto), pagina, tamanho, total };
  }
}
