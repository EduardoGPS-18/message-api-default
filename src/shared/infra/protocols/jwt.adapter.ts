import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  JwtProtocol,
} from '../../../shared/domain/services/protocols';

@Injectable()
export class JwtAdapter implements JwtProtocol {
  constructor(private readonly jwtServices: JwtService) {}

  sign(payload: JwtPayload): string {
    return this.jwtServices.sign(payload, {
      expiresIn: '7d',
      secret: 'jwt-secret',
    });
  }

  verify(token: string): JwtPayload {
    return this.jwtServices.verify(token, {
      secret: 'jwt-secret',
    });
  }
}
