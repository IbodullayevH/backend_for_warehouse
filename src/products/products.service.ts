import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {

  private redisClient: Redis

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.redisClient = redis;
  }

  // new Product
  async create(createProductDto: CreateProductDto): Promise<object> {
    try {
      let existProduct = await this.productRepo.findOne({ where: { name: createProductDto.name } });

      if (existProduct) {
        throw new ConflictException('Product ushbu name bilan allaqachon royxatdan otgan');
      }
      const savedProduct = await this.productRepo.save(this.productRepo.create(createProductDto));

      return {
        message: 'Successfully created new Product',
        data: savedProduct,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // get all Product data
  async findAll(): Promise<object> {
    try {
      const cachedProduct = await this.redisClient.get('product_all')
      if (cachedProduct) {
        return {
          message: 'Product data',
          data: JSON.parse(cachedProduct)
        }
      }
      const productsData = await this.productRepo.find()
      await this.redisClient.set('Product_all', JSON.stringify(productsData), 'EX', 10500)
      return {
        message: 'Products data',
        data: productsData
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }


  // get one Product data
  async findOne(id: number): Promise<object> {
    try {

      const cachedProduct = await this.redisClient.get('product_all')
      if (cachedProduct) {
        return {
          message: `${id}-idga ega product`,
          data: JSON.parse(cachedProduct)
        }
      }
      const productData = await this.productRepo.findOneBy({ id })
      await this.redisClient.set(`product_${id}`, JSON.stringify(productData), "EX", 3600)
      if (!productData) {
        throw new NotFoundException(`${id}-idga ega product mavjud emas`)
      }

      return {
        message: `${id}-idga ega product`,
        data: productData
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // update Product data
  async update(id: number, updateProductDto: Partial<UpdateProductDto>): Promise<object> {
    try {
      const checkId = await this.productRepo.findOneBy({ id })

      if (!checkId) {
        throw new NotFoundException(`${id}-idga ega Product mavjud emas`)
      }

      this.productRepo.update(id, updateProductDto)
      const updatedPro = await this.productRepo.findOneBy({ id });

      return {
        message: "Productni malumotlari muvaffaqiyatli yangilandi",
        data: updatedPro
      };

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }



  // delete Product
  async remove(id: number): Promise<object> {
    try {
      let checkProduct = await this.productRepo.findOneBy({ id })

      if (!checkProduct) {
        throw new NotFoundException(`${id}-idga ega Product mavjud emas`)
      }

      await this.productRepo.delete({ id })
      return {
        message: "Product muvaffaqiyatli o'chirildi"
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
