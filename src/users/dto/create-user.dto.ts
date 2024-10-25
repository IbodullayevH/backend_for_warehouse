import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(8)
    password: string

    @IsString()
    @IsNotEmpty()
    adress: string

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole
}
