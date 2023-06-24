import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";
import {FilesEntity} from "../entities/files.entity";
import {CorrelationJobsEntity} from "../entities/correlation_jobs.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";
import generateUniqueSixDigitNumber from "../common/generateUniqueNDigitNumber";
import printFirstDayOfTheMonth from "../common/printFirstDayOfTheMonth";

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

    async generateUniqueTeamId() {
        const allTeams = await this.teamsRepository.find();
        const allTeamsIds = allTeams.map((item) => (item.id));

        return generateUniqueSixDigitNumber(allTeamsIds, 6);
    }

    async createTeam(body) {
        const { name, teamUrl, email } = body;
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            const newTeamId = await this.generateUniqueTeamId();

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

    async updateTeamName(body) {
        const { name, teamUrl, id } = body;

        return this.teamsRepository
            .createQueryBuilder()
            .update({
                name,
                team_url: teamUrl
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

    async getTeamMembers(id) {
        const members = await this.usersRepository.findBy({
            team_id: id
        });
        const today = new Date();
        const firstDayOfCurrentMonth = printFirstDayOfTheMonth(today);

        let membersWithData = [];

        for(const member of members) {
            const memberId = member.id;
            const memberFiles = await this.getFilesByUserId(memberId);
            const memberSchemas = await this.getSchemasByUserId(memberId);

            const memberAutoMatchRowsInCurrentMonth = await this.correlationJobsRepository
                .createQueryBuilder()
                .andWhere({
                    user_id: memberId
                })
                .andWhere(`creation_datetime >= :firstDayOfCurrentMonth`, {
                    firstDayOfCurrentMonth
                })
                .execute();

            const numberOfMemberAutoMatchRowsInCurrentMonth = memberAutoMatchRowsInCurrentMonth.map((item) => {
                return item.CorrelationJobsEntity_rowCount;
            }).reduce((prev, curr) => {
                return prev + curr;
            }, 0);

            membersWithData.push({
                ...member,
                numberOfFiles: memberFiles?.length,
                numberOfSchemas: memberSchemas?.length,
                autoMatchRowsUsed: numberOfMemberAutoMatchRowsInCurrentMonth
            });
        }

        return membersWithData;
    }

    async getSchemasByUserId(id) {
        return this.schemasRepository.findBy({
            owner_user_id: id
        });
    }

    async getFilesByUserId(id) {
        return this.filesRepository.findBy({
            owner_user_id: id
        });
    }
}
