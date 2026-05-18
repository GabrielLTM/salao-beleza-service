import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ServicoMapper } from '../../mappers/ServicoMapper.js';

export class BuscarServicoPorId {
  constructor({ servicoRepository }) { this.servicoRepository = servicoRepository; }
  async executar(id) {
    const s = await this.servicoRepository.buscarPorIdComCategoria(id);
    if (!s) throw new NotFoundError('Servico nao encontrado.');
    return ServicoMapper.paraDto(s);
  }
}
