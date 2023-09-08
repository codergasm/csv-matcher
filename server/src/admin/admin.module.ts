import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TransactionsEntity} from "../entities/transactions.entity";
import {TeamsEntity} from "../entities/teams.entity";
import {UsersEntity} from "../entities/users.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        TransactionsEntity, TeamsEntity, UsersEntity
      ])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
