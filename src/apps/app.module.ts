import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Product } from 'src/entities/product.entity';
import { ProductsModule } from 'src/products/products.module';


// Main Module
@Module({
  imports: [

    // for .env
    ConfigModule.forRoot({
      isGlobal: true
    }),

    // for cache
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService]
    }),

    // for DB
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get("DB_URL"),
        entities: [User, Product],
        synchronize: true,
        // logging: true
      }),

      inject: [ConfigService]
    }),
    UsersModule,
    ProductsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL'))
      },
      inject: [ConfigService]
    },
  ],

  exports:["REDIS_CLIENT"]
})
export class AppModule { }
