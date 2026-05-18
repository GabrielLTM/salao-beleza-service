import bcrypt from 'bcrypt';

export class BcryptHasher {
  /** @param {number} rounds */
  constructor(rounds = 10) {
    this.rounds = rounds;
  }

  async hash(senhaEmTextoPuro) {
    return bcrypt.hash(senhaEmTextoPuro, this.rounds);
  }

  async comparar(senhaEmTextoPuro, hash) {
    return bcrypt.compare(senhaEmTextoPuro, hash);
  }
}
