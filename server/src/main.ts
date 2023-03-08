import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {json, urlencoded} from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded(({limit: '50mb', extended: true})));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.77.31:3000'],
    credentials: true
  });
  await app.listen(5000);
}
bootstrap();
