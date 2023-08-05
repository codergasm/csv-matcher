import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {TeamsEntity} from "../entities/teams.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";
import {UsersVerificationEntity} from "../entities/users_verification.entity";
import {JwtStrategy} from "../common/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([
        UsersEntity,
        TeamsEntity,
        AddToTeamUsersRequestsEntity,
        UsersVerificationEntity
    ]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 60 * 24 * 90}
      }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy]
})
export class UsersModule {}
