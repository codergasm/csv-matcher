import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {Repository} from "typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {JwtService} from "@nestjs/jwt";
import {UsersVerificationEntity} from "../entities/users_verification.entity";
import accountVerificationMail from "../mails/accountVerificationMail";
import createPasswordHash from "../common/createPasswordHash";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
        @InjectRepository(AddToTeamUsersRequestsEntity)
        private readonly addToTeamUsersRequestsRepository: Repository<AddToTeamUsersRequestsEntity>,
        @InjectRepository(UsersVerificationEntity)
        private readonly usersVerificationRepository: Repository<UsersVerificationEntity>,
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>,
        private readonly mailerService: MailerService,
        private readonly jwtTokenService: JwtService,
    ) {
    }

    async registerUser(email: string, password: string) {
        const existingUser = await this.usersRepository.findOneBy({
            email
        });

        if(existingUser) {
            throw new HttpException('Użytkownik o podanym adresie e-mail już istnieje', 400);
        }
        else {
            const passwordHash = createPasswordHash(password);
            const token = await uuid();

            await this.mailerService.sendMail(accountVerificationMail(email, token));

            await this.usersRepository.save({
                email,
                password: passwordHash,
                team_id: null,
                show_user_files: false,
                show_user_match_schemas: false,
                can_edit_team_match_schemas: false,
                can_delete_team_match_schemas: false,
                can_edit_team_files: false,
                can_delete_team_files: false
            });

            return this.usersVerificationRepository.save({
                email,
                token
            });
        }
    }

    async verifyUser(token: string) {
        const user = await this.usersVerificationRepository.findOneBy({ token });
        if(user) {
            return this.usersRepository.createQueryBuilder()
                .update({
                    active: true
                })
                .where({
                    email: user.email
                })
                .execute();
        }
        else {
            throw new HttpException('Niepoprawny token', 400);
        }
    }

    async loginUser(email: string, password: string) {
        const payload = { username: email, sub: password, role: 'user' };

        const user = await this.usersRepository.findOneBy({
            email,
            password: createPasswordHash(password)
        });

        if(user) {
            if(user.active) {
                return {
                    access_token: this.jwtTokenService.sign(payload, {
                        secret: process.env.JWT_KEY
                    })
                };
            }
            else {
                throw new HttpException('Konto nieaktywowane', 403);
            }
        }
        else {
            throw new HttpException('Nie znaleziono użytkownika o podanym emailu i haśle', 401);
        }
    }

    async addToTeamRequest(userId: number, teamId: number) {
        try {
            return this.addToTeamUsersRequestsRepository.save({
                user_id: userId,
                team_id: teamId,
                created_datetime: new Date(),
                status: 'waiting'
            });
        }
        catch(e) {
            let errorMessage = 'Coś poszło nie tak... Prosimy spróbować później'

            if(e?.errno) {
                if(e.errno === 1062) {
                    errorMessage = 'Prośba tego użytkownika o dodanie do tego zespołu już istnieje';
                }
                else if(e.errno === 1452) {
                    errorMessage = 'Podany użytkownik lub zespół nie istnieje';
                }
            }

            throw new HttpException(errorMessage, 400);
        }
    }

    async getUserData(email) {
        return this.usersRepository.findOneBy({email});
    }

    async changePassword(oldPassword, newPassword, email) {
        const user = await this.usersRepository.findBy({
            email,
            password: createPasswordHash(oldPassword)
        });

        if(user?.length) {
            return this.usersRepository
                .createQueryBuilder()
                .update({
                    password: createPasswordHash(newPassword)
                })
                .where({
                    email
                })
                .execute();
        }
        else {
            throw new BadRequestException('Niepoprawne hasło');
        }
    }

    async joinTeam(teamId, email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            const team = await this.teamsRepository.findOneBy({id: teamId});

            if(team) {
                return this.addToTeamUsersRequestsRepository.save({
                    user_id: user.id,
                    team_id: teamId,
                    created_datetime: new Date(),
                    status: 'waiting'
                });
            }
            else {
                throw new BadRequestException('Zespół o podanym id nie istnieje');
            }
        }
        else {
            throw new BadRequestException('Podany użytkownik nie istnieje');
        }
    }

    async deleteJoinTeamRequest(email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            return this.addToTeamUsersRequestsRepository.delete({
                user_id: user.id,
                status: 'waiting'
            });
        }
        else {
            throw new BadRequestException('Podany użytkownik nie istnieje');
        }
    }

    async leaveTeam(email) {
        return this.usersRepository
            .createQueryBuilder()
            .update({
                team_id: null
            })
            .where({
                email
            })
            .execute();
    }

    async getUserWaitingJoinTeamRequest(email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            return this.addToTeamUsersRequestsRepository.findOneBy({
                user_id: user.id,
                status: 'waiting'
            });
        }
        else {
            throw new BadRequestException('Podany użytkownik nie istnieje');
        }
    }

    async updateUserRights(body) {
        const { email, can_edit_team_match_schemas, can_delete_team_match_schemas,
            can_edit_team_files, can_delete_team_files } = body;

        return this.usersRepository
            .createQueryBuilder()
            .update({
                can_edit_team_match_schemas,
                can_delete_team_match_schemas,
                can_edit_team_files,
                can_delete_team_files
            })
            .where({
                email
            })
            .execute();
    }

    async checkIfNumberOfTeamMembersNotExceeded(team_id) {
        // Check current team plan
        const teamRow = await this.teamsRepository.findOneBy({
            id: team_id
        });

        const subscriptionId = teamRow.current_subscription_plan_id;
        const subscriptionDeadline = teamRow.current_subscription_plan_deadline;

        const teamUsers = await this.usersRepository.findBy({
            team_id
        });

        if(subscriptionDeadline > new Date()) {
            // Get users_per_team limit for current team plan
            const subscriptionRow = await this.subscriptionTypesRepository.findOneBy({
                id: subscriptionId
            });
            const usersPerTeamLimit = subscriptionRow.users_per_team || 2;

            return usersPerTeamLimit > teamUsers.length;
        }
        else {
            // Subscription end - team has free plan
            const subscriptionRow = await this.subscriptionTypesRepository.findOneBy({
                id: 1
            });
            const usersPerTeamLimit = subscriptionRow.users_per_team || 2;

            return usersPerTeamLimit > teamUsers.length;
        }
    }

    async acceptJoinRequest(user_id, team_id) {
        if(await this.checkIfNumberOfTeamMembersNotExceeded(team_id)) {
            await this.usersRepository
                .createQueryBuilder()
                .update({
                    team_id
                })
                .where({
                    id: user_id
                })
                .execute();

            return this.addToTeamUsersRequestsRepository
                .createQueryBuilder()
                .update({
                    status: 'accept'
                })
                .where({
                    user_id,
                    team_id
                })
                .execute();
        }
        else {
            return {
                numberOfTeamMembersExceeded: true
            }
        }
    }

    async rejectJoinRequest(user_id, team_id) {
        return this.addToTeamUsersRequestsRepository
            .createQueryBuilder()
            .update({
                status: 'reject'
            })
            .where({
                user_id,
                team_id
            })
            .execute();
    }

    async getUserTeamPlan(email) {
        const userRow = await this.usersRepository.findOneBy({
            email
        });

        if(userRow) {
            const teamId = userRow.team_id;

            if(teamId) {
                const teamRow = await this.teamsRepository.findOneBy({
                    id: teamId
                });

                if(teamId) {
                    return {
                        plan: teamRow.current_subscription_plan_id,
                        deadline: teamRow.current_subscription_plan_deadline,
                        isTeamOwner: userRow.id === teamRow.owner_id
                    }
                }
                else {
                    throw new HttpException('Nie znaleziono zespołu użytkownika', 400);
                }
            }
            else {
                return {
                    plan: 1
                }
            }
        }
        else {
            throw new HttpException('Nie znaleziono użytkownika o podanym id', 400);
        }
    }
}
