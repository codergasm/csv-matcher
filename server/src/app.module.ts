import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import {EventsGateway} from "./app.gateway";

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      limits: { fieldSize: 500 * 1024 * 1024 }
    })
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
