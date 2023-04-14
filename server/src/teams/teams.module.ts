import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {UsersEntity} from "../entities/users.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([TeamsEntity, UsersEntity, AddToTeamUsersRequestsEntity])
  ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
