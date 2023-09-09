import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TransactionsEntity} from "../entities/transactions.entity";
import {TeamsEntity} from "../entities/teams.entity";
import {UsersEntity} from "../entities/users.entity";
import {AdminsEntity} from "../entities/admins.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        TransactionsEntity, TeamsEntity, UsersEntity, AdminsEntity
      ]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 60 * 24 * 90}
      }),
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
