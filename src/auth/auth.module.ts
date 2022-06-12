import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { JwtAdapter } from 'src/shared/infra/protocols';
import { UuidAdapter } from 'src/shared/infra/protocols/uuid.adapter';
import { ExceptionResponseFilter } from 'src/shared/presentation/helpers/filter';
import { JwtAuthGuard } from 'src/shared/presentation/helpers/guards';
import { JwtProtocol, UuidProtocol } from '../shared/domain/services/protocols';
import { UserEntity } from './domain/entities';
import { EncrypterProtocol } from './domain/services/protocols';
import { UserRepository } from './domain/services/repositories';
import { LoginUseCase, SignupUseCase } from './domain/usecases';
import { ValidateUserUseCase } from './domain/usecases/validate-user.usecase';
import { BcryptAdapter } from './infra/protocols';
import { DbUserRepository } from './infra/repositories';
import { SigninController, SignupController } from './presentation/controller';
import { ValidateUserController } from './presentation/controller/validate.controller';

@Module({
  imports: [
    JwtModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        pt: 'pt',
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    JwtService,
    { provide: UuidProtocol, useClass: UuidAdapter },
    { provide: JwtProtocol, useClass: JwtAdapter },
    { provide: EncrypterProtocol, useClass: BcryptAdapter },
    { provide: UserRepository, useClass: DbUserRepository },

    SignupUseCase,
    LoginUseCase,
    ValidateUserUseCase,

    JwtAuthGuard,
    ExceptionResponseFilter,
  ],
  controllers: [SignupController, SigninController, ValidateUserController],
  exports: [JwtService, ValidateUserUseCase, JwtAuthGuard],
})
export class AuthModule {}
