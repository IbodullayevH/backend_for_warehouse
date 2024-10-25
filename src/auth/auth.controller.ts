import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login-dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        // const { login, password } = loginDto;
        const user = await this.authService.validateUser(loginDto);
        
        if (!user) {
            return { message: "Login yoki parol noto'g'ri" };
        }

        await this.authService.cacheUser(user.id, user);

        return this.authService.login(user);
    }
}
