import { IsEnum, IsOptional, IsString } from "class-validator"
import { UserRole } from "src/entities/user.entity"

export class UpdateUserDto {

    @IsString()
    @IsOptional()
    login: string

    @IsString()
    @IsOptional()
    password: string

    @IsString()
    @IsOptional()
    address: string

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole
}
