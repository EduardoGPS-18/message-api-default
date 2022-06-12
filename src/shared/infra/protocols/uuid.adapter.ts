import { Injectable } from '@nestjs/common';
import { UuidProtocol } from 'src/shared/domain/services/protocols';
import * as uuid from 'uuid';

@Injectable()
export class UuidAdapter implements UuidProtocol {
  v4(): string {
    return uuid.v4();
  }
}
