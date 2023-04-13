import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {Repository} from "typeorm";
import {TeamsEntity} from "../entities/teams.entity";
import {AddToTeamUsersRequestsEntity} from "../entities/add_to_team_users_requests.entity";
import * as crypto from 'crypto'
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {JwtService} from "@nestjs/jwt";
import {UsersVerificationEntity} from "../entities/users_verification.entity";

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
            const passwordHash = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            const token = await uuid();

            await this.mailerService.sendMail({
                to: email,
                from: `RowMatcher <${process.env.EMAIL_ADDRESS}>`,
                subject: 'Aktywuj swoje konto w RowMatcher.com',
                html: `<div>
                    <h2>
                        Dziękujemy, że jesteś z nami!
                    </h2>
                    <p>
                        Oto Twój link aktywacyjny:
                    </p>
                    <a href="${process.env.WEBSITE_URL}/weryfikacja?token=${token}">
                        ${process.env.WEBSITE_URL}/weryfikacja?token=${token}
                    </a>
                </div>`
            });

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

        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const user = await this.usersRepository.findOneBy({
            email,
            password: passwordHash
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
            const res = await this.addToTeamUsersRequestsRepository.save({
                user_id: userId,
                team_id: teamId,
                created_datetime: new Date(),
                status: 'waiting'
            });

            return res;
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
        const passwordHash = crypto
            .createHash('sha256')
            .update(oldPassword)
            .digest('hex');

        const user = await this.usersRepository.findBy({
            email,
            password: passwordHash
        });

        if(user?.length) {
            const newPasswordHash = crypto
                .createHash('sha256')
                .update(newPassword)
                .digest('hex');

            return this.usersRepository
                .createQueryBuilder()
                .update({
                    password: newPasswordHash
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
}
