import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {In, Repository} from "typeorm";
import {AutomaticMatchOperationsRegistryEntity} from "../entities/automatic_match_operations_registry.entity";
import {UsersEntity} from "../entities/users.entity";
import {FilesEntity} from "../entities/files.entity";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as crypto from 'crypto';
import {TransactionsEntity} from "../entities/transactions.entity";
import {TeamsEntity} from "../entities/teams.entity";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>,
        @InjectRepository(TransactionsEntity)
        private readonly transactionsRepository: Repository<TransactionsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
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

    async convertSubscription(teamId, newPlanId, newPlanDeadline) {
        return this.teamsRepository
            .createQueryBuilder()
            .update({
                current_subscription_plan_id: newPlanId,
                current_subscription_plan_deadline: newPlanDeadline
            })
            .where({
                id: teamId
            })
            .execute();
    }

    async getTeamTransactions(teamId) {
        return this.transactionsRepository.findBy({
            team_id: teamId
        });
    }

    async registerPayment(body) {
        const { amount, currency, email, userId, teamId, planId, planDeadline } = body;

        const CLIENT_ID = process.env.PRZELEWY24_CLIENT_ID;
        const CRC = process.env.PRZELEWY24_CRC;

        let hash, data, gen_hash;
        const sessionId = await uuid();
        hash = crypto.createHash('sha384');
        data = hash.update(`{"sessionId":"${sessionId}","merchantId":${CLIENT_ID},"amount":${parseFloat(amount)*100},"currency":"${currency.toUpperCase()}","crc":"${CRC}"}`, 'utf-8');
        gen_hash = data.digest('hex');

        let postData = {
            sessionId: sessionId,
            posId: CLIENT_ID,
            merchantId: CLIENT_ID,
            amount: parseFloat(amount) * 100,
            currency: currency.toUpperCase(),
            description: "Platnosc za subskrypcje RowMatcher",
            email: email,
            country: "PL",
            language: "pl",
            encoding: "utf-8",
            urlReturn: `${process.env.WEBSITE_URL}/subskrypcja-przedluzona`,
            urlStatus: `${process.env.API_URL}/subscription/verifyPayment`,
            sign: gen_hash
        };

        const res = await axios.post(`https://sandbox.przelewy24.pl/api/v1/transaction/register`, postData, {
            headers: {
                Authorization: `Basic ${process.env.PRZELEWY24_AUTH_HEADER}`
            }
        });

        if(res) {
            console.log(res);
            console.log(res.data);

            let token = res.data.token;

            await this.transactionsRepository.save({
                id: sessionId,
                create_datetime: new Date(),
                user_id: userId,
                status: 'pending',
                payment_operator_token: '',
                invoice_row_id: 0,
                payment_operator_name: 'Przelewy24',
                payment_operator_unit_id: null,
                is_invoice_applicable: false,
                invoice_number: null,
                invoice_buyer_name: null,
                invoice_nip: null,
                payment_token: token,
                amount: amount,
                currency: currency,
                team_id: teamId,
                plan_id: planId,
                plan_deadline: planDeadline
            });

            return {
                token: token,
                sign: gen_hash
            }
        }
        else {
            return {
                error: true
            }
        }
    }

    async verifyPayment(body) {
        let { merchantId, posId, sessionId, amount, currency, orderId } = body;

        /* Calculate SHA384 checksum */
        let hash, data, sign;
        hash = crypto.createHash('sha384');
        data = hash.update(`{"sessionId":"${sessionId}","orderId":${orderId},"amount":${amount},"currency":"${currency}","crc":"${process.env.PRZELEWY24_CRC}"}`, 'utf-8');
        sign = data.digest('hex');

        const res = await axios.put(`https://sandbox.przelewy24.pl/api/v1/transaction/verify`, {
            merchantId,
            posId,
            sessionId,
            amount,
            currency,
            orderId,
            sign
        }, {
            headers: {
                Authorization: `Basic ${process.env.PRZELEWY24_AUTH_HEADER}`
            }
        });

        if(res?.data?.status === 'success') {
            await this.transactionsRepository
                .createQueryBuilder()
                .update({
                    status: 'confirmed'
                })
                .where({
                    id: sessionId
                })
                .execute();

            const transactionRow = await this.transactionsRepository.findOneBy({
                id: sessionId
            });

            if(transactionRow) {
                const { plan_id, plan_deadline, team_id } = transactionRow;

                await this.teamsRepository
                    .createQueryBuilder()
                    .update({
                        current_subscription_plan_id: plan_id,
                        current_subscription_plan_deadline: plan_deadline
                    })
                    .where({
                        id: team_id
                    })
                    .execute();

                return {
                    status: 'OK'
                }
            }
            else {
                return {
                    status: 0
                }
            }
        }
        else {
            return {
                status: 0
            }
        }
    }
}
