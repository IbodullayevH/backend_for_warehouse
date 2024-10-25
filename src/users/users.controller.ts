import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post('new')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any): Promise<object> {
    const user: User = req.user
    return this.usersService.findAll(user);
  }


  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    try {
      const user = await this.authService.validateUser(loginDto);

      if (user) {
        await this.authService.cacheUser(user.id, user);
        return this.authService.login(user);
      } else {
        return { message: `Login yoki parol noto'g'ri` };
      }
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
