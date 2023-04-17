import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FilesEntity} from "../entities/files.entity";
import {UsersEntity} from "../entities/users.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([FilesEntity, UsersEntity])
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
