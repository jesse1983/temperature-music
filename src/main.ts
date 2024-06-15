import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.SERVER_PORT || 3000;
  const host = process.env.SERVER_HOST || '0.0.0.0';

  const app = await NestFactory.create(AppModule);
  await app.listen(port, host);
}
bootstrap();
