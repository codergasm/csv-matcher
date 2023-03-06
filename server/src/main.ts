import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '250mb' }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  });
  await app.listen(5000);
}
bootstrap();
