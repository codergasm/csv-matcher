import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TeamsEntity} from "../entities/teams.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([TeamsEntity])
  ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
