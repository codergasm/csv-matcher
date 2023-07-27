import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth-basic.strategy';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";

@Module({
    imports: [PassportModule, ConfigModule, TypeOrmModule.forFeature([
        UsersEntity
    ])],
    providers: [BasicStrategy],
})
export class AuthModule {}
