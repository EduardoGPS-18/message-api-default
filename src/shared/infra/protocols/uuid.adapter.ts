import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UuidProtocol } from '../../../shared/domain/services/protocols';

@Injectable()
export class UuidAdapter implements UuidProtocol {
  v4(): string {
    return uuid.v4();
  }
}
