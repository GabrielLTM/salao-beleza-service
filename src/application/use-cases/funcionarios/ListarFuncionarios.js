import { FuncionarioMapper } from '../../mappers/FuncionarioMapper.js';

export class ListarFuncionarios {
  constructor({ funcionarioRepository }) {
    this.funcionarioRepository = funcionarioRepository;
  }

  async executar({ pagina, tamanho }) {
    const { itens, total } = await this.funcionarioRepository.listar({ pagina, tamanho });
    return {
      itens: itens.map(FuncionarioMapper.paraDto),
      pagina,
      tamanho,
      total,
    };
  }
}
