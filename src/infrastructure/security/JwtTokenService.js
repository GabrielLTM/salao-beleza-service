import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError.js';

export class JwtTokenService {
  /** @param {{segredo:string, expiraEm:string}} args */
  constructor({ segredo, expiraEm }) {
    this.segredo = segredo;
    this.expiraEm = expiraEm;
  }

  gerar(payload) {
    return jwt.sign(payload, this.segredo, { expiresIn: this.expiraEm });
  }

  verificar(token) {
    try {
      return jwt.verify(token, this.segredo);
    } catch {
      throw new UnauthorizedError('Token invalido ou expirado.');
    }
  }
}
