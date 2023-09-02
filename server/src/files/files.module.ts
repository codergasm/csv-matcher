import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesEntity} from "../entities/files.entity";
import {UsersEntity} from "../entities/users.entity";
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";
import {TeamsEntity} from "../entities/teams.entity";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([FilesEntity, UsersEntity, TeamsEntity,
          SubscriptionTypesEntity, MatchSchemasSheetsEntity])
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
