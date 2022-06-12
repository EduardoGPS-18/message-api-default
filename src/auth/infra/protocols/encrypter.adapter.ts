import { Injectable } from '@nestjs/common';
import { EncrypterProtocol } from '../../domain/services/protocols';

import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements EncrypterProtocol {
  async encrypt(value: string): Promise<string> {
    const salts = 12;
    const hash = await bcrypt.hash(value, salts);
    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
