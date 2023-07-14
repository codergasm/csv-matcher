import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CorrelationJobsEntity} from "./entities/correlation_jobs.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {AddToTeamUsersRequestsEntity} from "./entities/add_to_team_users_requests.entity";
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import {MailerModule} from "@nestjs-modules/mailer";
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './files/files.module';
import { SchemasModule } from './schemas/schemas.module';
import {join} from "path";
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
      limits: { fieldSize: 100 * 1024 * 1024 }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
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
      synchronize: false
    }),
    TypeOrmModule.forFeature([CorrelationJobsEntity, AddToTeamUsersRequestsEntity]),
      MailerModule.forRoot({
          transport: `smtp://${process.env.EMAIL_ADDRESS}:${process.env.EMAIL_PASSWORD}@${process.env.EMAIL_HOST}`,
          defaults: {
              from: process.env.EMAIL_ADDRESS,
              tls: {
                  rejectUnauthorized: false
              },
              secure: true
          }
      }),
    TeamsModule,
    UsersModule,
    FilesModule,
    SchemasModule,
    SubscriptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
