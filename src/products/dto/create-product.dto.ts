import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    image: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    category: string

    @IsNumber()
    @IsNotEmpty()
    count: number

    @IsNumber()
    @IsNotEmpty()
    hajim: number

}
