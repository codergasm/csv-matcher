import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";
import {FilesEntity} from "../entities/files.entity";
import {CorrelationJobsEntity} from "../entities/correlation_jobs.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(AddToTeamUsersRequestsEntity)
        private readonly addToTeamUsersRequestsRepository: Repository<AddToTeamUsersRequestsEntity>,
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(MatchSchemasEntity)
        private readonly schemasRepository: Repository<MatchSchemasEntity>,
        @InjectRepository(CorrelationJobsEntity)
        private readonly correlationJobsRepository: Repository<CorrelationJobsEntity>
    ) {
    }

    async getTeamById(id) {
        return this.teamsRepository.findOneBy({
            id
        });
    }

    async getAllTeams() {
        return this.teamsRepository.find();
    }

    generateUniqueSixDigitNumber(inputArray) {
        let number;
        do {
            number = Math.floor(Math.random() * 900000) + 100000;
        } while (inputArray.includes(number));

        return number;
    }

    async createTeam(name, teamUrl, email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            const allTeams = await this.teamsRepository.find();
            const allTeamsIds = allTeams.map((item) => (item.id));

            const newTeamId = this.generateUniqueSixDigitNumber(allTeamsIds);

            await this.teamsRepository.save({
                id: newTeamId,
                creator_id: user.id,
                name: name,
                team_url: teamUrl,
                owner_id: user.id
            });

            return this.usersRepository
                .createQueryBuilder()
                .update({
                    team_id: newTeamId
                })
                .where({
                    id: user.id
                })
                .execute();
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async updateTeamName(name, team_url, id) {
        return this.teamsRepository
            .createQueryBuilder()
            .update({
                name,
                team_url
            })
            .where({
                id
            })
            .execute();
    }

    async getWaitingJoinTeamRequests(id) {
        return this.addToTeamUsersRequestsRepository
            .createQueryBuilder('r')
            .innerJoinAndSelect('users', 'u', 'u.id = r.user_id')
            .andWhere('r.team_id = :id', {id})
            .andWhere('r.status = :status', {status: 'waiting'})
            .getRawMany();
    }

    printFirstDayOfCurrentMonth(date) {
        return `${date.getFullYear()}-${date.getMonth()+1}-01 00:00:00`
    }

    async getTeamMembers(id) {
        const members = await this.usersRepository.findBy({
            team_id: id
        });
        const today = new Date();
        const firstDayOfCurrentMonth = this.printFirstDayOfCurrentMonth(today);

        let membersWithExtraInfo = [];

        for(const member of members) {
            const memberFiles = await this.filesRepository.findBy({
                owner_user_id: member.id
            });

            const memberSchemas = await this.schemasRepository.findBy({
                owner_user_id: member.id
            });

            const memberAutoMatchRowsInCurrentMonth = await this.correlationJobsRepository
                .createQueryBuilder()
                .andWhere({
                    user_id: member.id
                })
                .andWhere(`creation_datetime >= :firstDayOfCurrentMonth`, {
                    firstDayOfCurrentMonth
                })
                .execute();

            const numberOfRowsUsed = memberAutoMatchRowsInCurrentMonth.map((item) => {
                return item.CorrelationJobsEntity_rowCount;
            }).reduce((prev, curr) => {
                return prev + curr;
            }, 0);

            membersWithExtraInfo.push({
                ...member,
                numberOfFiles: memberFiles?.length,
                numberOfSchemas: memberSchemas?.length,
                autoMatchRowsUsed: numberOfRowsUsed
            });
        }

        return membersWithExtraInfo;
    }
}
