import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { User } from 'src/entities/user.entity';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'assalom77777@',
      signOptions: { expiresIn: '180s' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL'))
      },
      inject: [ConfigService]
    },
    UsersService,
    AuthService,
  ],
  exports: [JwtModule]
})
export class AuthModule { }

