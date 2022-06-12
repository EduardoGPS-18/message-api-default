import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ValidateUserUseCase } from 'src/auth/domain/usecases/validate-user.usecase';

export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly validateUser: ValidateUserUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient();
    const jwt = request.handshake.headers.authorization.split(' ')[1];

    const user = await this.validateUser.execute({ jwt });

    request.body.user = user;

    return user !== null;
  }
}
