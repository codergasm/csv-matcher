import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {Repository} from "typeorm";

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>
    ) {
    }

    async getTeamById(id) {
        return this.teamsRepository.findOneBy({
            id
        });
    }
}
