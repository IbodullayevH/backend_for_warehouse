import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('Token topilmadi');
    }

    try {
      const user = await this.jwtService.verifyAsync(token, { secret: 'assalom77777@' });
      request.user = user;
      return true;
    } catch (error) {
      throw new ForbiddenException(`Token muddati o'tgan yoki xato`);
    }
  }
}
