import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV == 'dev' ? '.env.dev' : '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get<string>('DB_NAME'),
        password: configService.get<string>('DB_PASS'),
        port: configService.get<number>('DB_PORT'),
        host: configService.get<string>('DB_HOST'),
        username: configService.get<string>('DB_USER'),
        entities: [`${__dirname}/../**/**/**/*.entity.ts`],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
