import { NotFoundError } from '../../../domain/errors/NotFoundError.js';
import { ClienteMapper } from '../../mappers/ClienteMapper.js';

export class BuscarClientePorId {
  constructor({ clienteRepository }) { this.clienteRepository = clienteRepository; }
  async executar(id) {
    const c = await this.clienteRepository.buscarPorId(id);
    if (!c) throw new NotFoundError('Cliente nao encontrado.');
    return ClienteMapper.paraDto(c);
  }
}
