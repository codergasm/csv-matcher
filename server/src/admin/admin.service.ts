import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionsEntity} from "../entities/transactions.entity";
import {Repository} from "typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {UsersEntity} from "../entities/users.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly transactionsRepository: Repository<TransactionsEntity>,
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {
    }

    async getAllTransactions() {
        const allTransactions = await this.transactionsRepository.find();
        const allTeams = await this.teamsRepository.find();
        const allUsers = await this.usersRepository.find();

        return allTransactions.map((item) => {
            const userId = item.user_id;
            const teamId = item.team_id;

            return {
                ...item,
                user_email: allUsers.find((item => (item.id === userId)))?.email,
                team_name: allTeams.find((item) => (item.id === teamId))?.name
            }
        });
    }
}
