import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {AutomaticMatchOperationsRegistryEntity} from "../entities/automatic_match_operations_registry.entity";
import {UsersEntity} from "../entities/users.entity";
import {FilesEntity} from "../entities/files.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";

@Module({
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  imports: [TypeOrmModule.forFeature(
      [SubscriptionTypesEntity, AutomaticMatchOperationsRegistryEntity,
        UsersEntity, FilesEntity, MatchSchemasEntity]
  )]
})

export class SubscriptionsModule {}
