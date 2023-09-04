import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {In, Repository} from "typeorm";
import {AutomaticMatchOperationsRegistryEntity} from "../entities/automatic_match_operations_registry.entity";
import {UsersEntity} from "../entities/users.entity";
import {FilesEntity} from "../entities/files.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(MatchSchemasEntity)
        private readonly matchSchemasRepository: Repository<MatchSchemasEntity>,
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(AutomaticMatchOperationsRegistryEntity)
        private readonly automaticMatchOperationsRegistryRepository: Repository<AutomaticMatchOperationsRegistryEntity>
    ) {
    }

    async getAllSubscriptionPlans() {
        return this.subscriptionTypesRepository.find();
    }

    async getPlanById(id) {
        return this.subscriptionTypesRepository.findOneBy({id});
    }

    async getIdsOfTeamsUsers(teamId) {
        const teamUsers = await this.usersRepository.findBy({
            team_id: teamId
        });

        return teamUsers.map((item) => (item.id));
    }

    async getAutoMatchOperationsInCurrentMonth(teamId) {
        const allTeamOperations = await this.automaticMatchOperationsRegistryRepository.findBy({
           team_id: teamId,
        });

        const currentMonth = new Date().getMonth();

        return allTeamOperations.filter((item) => {
            return item.created_datetime.getMonth() === currentMonth;
        }).reduce((prev, curr) => {
            return prev + curr.matched_rows_count;
        }, 0);
    }

    async getNumberOfUsersInTeam(teamId) {
        const teamUsers = await this.usersRepository.findBy({
            team_id: teamId
        });
        return teamUsers.length;
    }

    async getAllTeamFiles(teamId) {
        const teamUsersIds = await this.getIdsOfTeamsUsers(teamId);

        const usersFiles = await this.filesRepository.findBy({
            owner_user_id: In(teamUsersIds)
        });
        const teamFiles = await this.filesRepository.findBy({
            owner_team_id: teamId
        });

        return [...usersFiles, ...teamFiles];
    }

    async getNumberOfFilesInTeam(teamId) {
        const allTeamFiles = await this.getAllTeamFiles(teamId);
        return allTeamFiles.length;
    }

    async getTeamDiskUsage(teamId) {
        const allTeamFiles: any = await this.getAllTeamFiles(teamId);

        return allTeamFiles.reduce((prev, curr) => {
            return prev + curr.filesize;
        }, 0);
    }

    async getNumberOfTeamMatchSchemas(teamId) {
        const teamUsersIds = await this.getIdsOfTeamsUsers(teamId);

        const usersSchemas = await this.matchSchemasRepository.findBy({
            owner_user_id: In(teamUsersIds)
        });
        const teamsSchemas = await this.matchSchemasRepository.findBy({
            owner_team_id: teamId
        });

        return usersSchemas.length + teamsSchemas.length;
    }

    async getTeamLimitsUsage(teamId) {
        const numberOfMatchOperations = await this.getAutoMatchOperationsInCurrentMonth(teamId);
        const numberOfUsers = await this.getNumberOfUsersInTeam(teamId);
        const numberOfFiles = await this.getNumberOfFilesInTeam(teamId);
        const numberOfMatchSchemas = await this.getNumberOfTeamMatchSchemas(teamId);
        const diskUsage = await this.getTeamDiskUsage(teamId);

        return {
            numberOfMatchOperations,
            numberOfUsers,
            numberOfFiles,
            numberOfMatchSchemas,
            diskUsage
        }
    }
}
