import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // port from .env
  const configService = app.get(ConfigService)
  const port  = configService.get<number>('SERVER_PORT') || 3000

  // Server run
  await app.listen(port);
  console.log(`Server run on port: http://localhost:${port}`);
  
}
bootstrap();
