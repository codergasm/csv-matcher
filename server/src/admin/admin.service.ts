import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionsEntity} from "../entities/transactions.entity";
import {Repository} from "typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {UsersEntity} from "../entities/users.entity";
import {AdminsEntity} from "../entities/admins.entity";
import createPasswordHash from "../common/createPasswordHash";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly transactionsRepository: Repository<TransactionsEntity>,
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(AdminsEntity)
        private readonly adminsRepository: Repository<AdminsEntity>,
        private readonly jwtTokenService: JwtService,
    ) {
    }

    async loginAdmin(login: string, password: string) {
        const payload = { username: login, sub: password, role: 'admin' };

        const admin = await this.adminsRepository.findOneBy({
            login,
            password: createPasswordHash(password)
        });

        if(admin) {
            return {
                access_token: this.jwtTokenService.sign(payload, {
                    secret: process.env.JWT_KEY
                })
            }
        }
        else {
            throw new HttpException('Nie znaleziono użytkownika o podanym emailu i haśle', 401);
        }
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
