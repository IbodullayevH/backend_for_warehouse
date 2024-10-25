import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/apps/app.module';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => AppModule)
  ],
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductsModule { }
