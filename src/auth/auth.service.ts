import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt"
import { LoginDto } from 'src/users/dto/login-dto';


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,

        @Inject('REDIS_CLIENT')
        private readonly redisClient: Redis
    ) { }

    async validateUser(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findByLogin(loginDto.login)
        if (user && typeof loginDto.password === 'string' && typeof user.password === 'string') {
            try {
                const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
                if (isPasswordMatch) {
                    const { password, ...result } = user;
                    return result;
                }
            } catch (error) {
                throw new Error('Parolni tekshirishda xatolik: ' + error.message);

            }
        } else {
            throw new Error(`Ma'lumot turi noto'g'ri: Userning passwordi satr emas`);
        }

        return null;
    }

    async login(user: any) {
        const payload = { login: user.login, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: `1d` }),
        };
    }

    async cacheUser(userId: number, user: any) {
        await this.redisClient.set(`user_${userId}`, JSON.stringify(user), 'EX', 10);
    }

    async getCachedUser(userId: number) {
        const cachedUser = await this.redisClient.get(`user_${userId}`);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        return null;
    }
}

