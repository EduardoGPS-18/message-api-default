import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidateUserUseCase } from 'src/auth/domain/usecases/validate-user.usecase';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly validateUser: ValidateUserUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const jwt = request.headers.authorization.split(' ')[1];

    const user = await this.validateUser.execute({ jwt });

    request.body.user = user;

    return user !== null;
  }
}
