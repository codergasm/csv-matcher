import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CorrelationJobs} from "./entities/correlation_jobs.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
      limits: { fieldSize: 100 * 1024 * 1024 }
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql', // type of our database
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT, // database host
      username: process.env.DATABASE_USERNAME, // username
      password: process.env.DATABASE_PASSWORD, // user password
      database: process.env.DATABASE_NAME, // name of our database,
      autoLoadEntities: true, // models will be loaded automatically
      synchronize: false, // your entities will be synced with the database(recommended: disable in prod)
    }),
    TypeOrmModule.forFeature([CorrelationJobs])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
