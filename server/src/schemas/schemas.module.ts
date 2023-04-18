import { Module } from '@nestjs/common';
import { SchemasService } from './schemas.service';
import { SchemasController } from './schemas.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";
import {UsersEntity} from "../entities/users.entity";
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchSchemasEntity, UsersEntity, MatchSchemasSheetsEntity])
  ],
  providers: [SchemasService],
  controllers: [SchemasController]
})
export class SchemasModule {}
