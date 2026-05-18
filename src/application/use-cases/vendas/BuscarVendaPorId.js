import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { VendaMapper } from '../../mappers/VendaMapper.js';

export class BuscarVendaPorId {
  constructor({ vendaRepository }) { this.vendaRepository = vendaRepository; }
  async executar(id) {
    const v = await this.vendaRepository.buscarPorId(id);
    if (!v) throw new NotFoundError('Venda nao encontrada.');
    return VendaMapper.paraDto(v);
  }
}
