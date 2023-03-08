import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      limits: { fieldSize: 100 * 1024 * 1024 }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
