import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ApiMatchingRequestsRegistryEntity} from "../entities/api_matching_requests_registry.entity";
import {
  FilesApiMatchingRequestsRegistryRelationEntity
} from "../entities/files_api_matching_requests_registry_relation.entity";
import {UsersEntity} from "../entities/users.entity";
import {FilesEntity} from "../entities/files.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        ApiMatchingRequestsRegistryEntity,
        FilesApiMatchingRequestsRegistryRelationEntity,
        UsersEntity,
        FilesEntity,
        MatchSchemasEntity
      ])
  ],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
