import { ServicoMapper } from '../../mappers/ServicoMapper.js';

export class ListarServicos {
  constructor({ servicoRepository }) { this.servicoRepository = servicoRepository; }
  async executar({ pagina, tamanho }) {
    const { itens, total } = await this.servicoRepository.listarComCategoria({ pagina, tamanho });
    return { itens: itens.map(ServicoMapper.paraDto), pagina, tamanho, total };
  }
}
