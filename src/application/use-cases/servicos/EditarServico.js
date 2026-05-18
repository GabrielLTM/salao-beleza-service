import { Servico } from '../../../domain/entities/Servico.js';
import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ServicoMapper } from '../../mappers/ServicoMapper.js';

export class EditarServico {
  constructor({ servicoRepository, categoriaRepository }) {
    this.servicoRepository = servicoRepository;
    this.categoriaRepository = categoriaRepository;
  }
  async executar(id, entrada) {
    const atual = await this.servicoRepository.buscarPorId(id);
    if (!atual) throw new NotFoundError('Servico nao encontrado.');

    const servico = new Servico({ ...entrada, id });
    const categoria = await this.categoriaRepository.buscarPorIdComServicos(servico.categoriaId);
    if (!categoria) throw new NotFoundError('Categoria nao encontrada.');

    const salvo = await this.servicoRepository.atualizar({
      id: servico.id,
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      precoMinimo: servico.precoMinimo,
      categoriaId: servico.categoriaId,
      status: servico.status,
    });
    return ServicoMapper.paraDto({ ...salvo, nomeCategoria: categoria.nome });
  }
}
