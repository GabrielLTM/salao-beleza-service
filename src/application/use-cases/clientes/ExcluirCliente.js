import { NotFoundError } from '../../../domain/errors/NotFoundError.js';

export class ExcluirCliente {
  constructor({ clienteRepository }) { this.clienteRepository = clienteRepository; }
  async executar(id) {
    const c = await this.clienteRepository.buscarPorId(id);
    if (!c) throw new NotFoundError('Cliente nao encontrado.');
    await this.clienteRepository.excluir(id);
  }
}
