import {HttpException, Injectable} from '@nestjs/common';
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
import {TeamsInvoicesDataEntity} from "../entities/teams_invoices_data.entity";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>,
        @InjectRepository(TransactionsEntity)
        private readonly transactionsRepository: Repository<TransactionsEntity>,
        @InjectRepository(TeamsInvoicesDataEntity)
        private readonly teamsInvoicesDataRepository: Repository<TeamsInvoicesDataEntity>,
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

    async validateConversionPossibility(teamId, newPlanId) {
        const {
            numberOfMatchOperations,
            numberOfUsers,
            numberOfFiles,
            numberOfMatchSchemas,
            diskUsage
        } = await this.getTeamLimitsUsage(teamId);

        const newPlanLimits = await this.subscriptionTypesRepository.findOneBy({
            id: newPlanId
        });

        const numberOfMatchOperationsError = numberOfMatchOperations > newPlanLimits.matches_per_month;
        const numberOfUsersError = numberOfUsers > newPlanLimits.users_per_team;
        const numberOfFilesError = numberOfFiles > newPlanLimits.files_per_team;
        const numberOfMatchSchemasError = numberOfMatchSchemas > newPlanLimits.schemas_per_team;
        const diskUsageError = diskUsage > newPlanLimits.size_per_team;

        const allTeamFiles = await this.getAllTeamFiles(teamId);
        const filesizeLimit = newPlanLimits.size_per_file;
        const columnsLimit = newPlanLimits.columns_per_file;
        const rowsLimit = newPlanLimits.rows_per_file;

        const exceededSizeFiles = allTeamFiles.filter((item) => {
            return item.filesize > filesizeLimit;
        }).map((item) => (item.filename));

        const exceededColumnsFiles = allTeamFiles.filter((item) => {
            return item.column_count > columnsLimit;
        }).map((item) => (item.filename));

        const exceededRowsFiles = allTeamFiles.filter((item) => {
            return item.row_count > rowsLimit;
        }).map((item) => (item.filename));

        if(numberOfMatchSchemasError || numberOfUsersError || numberOfFilesError ||
            numberOfMatchSchemasError || diskUsageError || exceededSizeFiles.length ||
            exceededColumnsFiles.length || exceededRowsFiles.length) {
            return {
                error: true,
                numberOfMatchOperationsError,
                numberOfUsersError,
                numberOfFilesError,
                numberOfMatchSchemasError,
                diskUsageError,
                exceededSizeFiles,
                exceededColumnsFiles,
                exceededRowsFiles
            }
        }
        else {
            return {
                error: false
            }
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

    async getTeamInvoiceData(teamId) {
        return this.teamsInvoicesDataRepository.findOneBy({
            team_id: teamId
        });
    }

    async generateInvoiceNumber() {
        const addTrailingZero = (n) => {
            if(n < 10) return `0${n}`;
            return n;
        }

        const allInvoices = await this.transactionsRepository
            .createQueryBuilder('t')
            .where(`t.invoice_number IS NOT NULL`)
            .getMany();

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const newNumber = allInvoices.filter((item) => {
            return item.create_datetime.getMonth() === currentMonth;
        }).length + 1;

        return `${newNumber}/${addTrailingZero(currentMonth)}/${currentYear}`;
    }

    async registerPayment(body) {
        const { amount, currency, email, userId, teamId,
            planId, planDeadline, invoice } = body;

        const CLIENT_ID = process.env.PRZELEWY24_CLIENT_ID;
        const CRC = process.env.PRZELEWY24_CRC_KEY;

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

        try {
            const res = await axios.post(`https://sandbox.przelewy24.pl/api/v1/transaction/register`, postData, {
                headers: {
                    Authorization: `Basic ${process.env.PRZELEWY24_AUTH_HEADER}`
                }
            });

            if(res) {
                let token = res.data.data.token;

                await this.transactionsRepository.save({
                    id: sessionId,
                    create_datetime: new Date(),
                    user_id: userId,
                    status: 'pending',
                    payment_operator_token: '',
                    payment_operator_name: 'Przelewy24',
                    payment_operator_unit_id: null,
                    is_invoice_applicable: !!invoice,
                    invoice_number: null,
                    invoice_name: invoice ? invoice.name : null,
                    invoice_nip: invoice ? invoice.nip : null,
                    invoice_street_name: invoice ? invoice.street_name : null,
                    invoice_street_number: invoice ? invoice.street_number : null,
                    invoice_postal_code: invoice ? invoice.postal_code : null,
                    payment_token: token,
                    amount: amount,
                    currency: currency,
                    team_id: teamId,
                    plan_id: planId,
                    plan_deadline: planDeadline
                });

                if(invoice) {
                    await this.teamsInvoicesDataRepository.save({
                        team_id: teamId,
                        name: invoice.name,
                        nip: invoice.nip,
                        street_name: invoice.street_name,
                        street_number: invoice.street_number,
                        postal_code: invoice.postal_code
                    });
                }

                return {
                    token: token
                }
            }
            else {
                return {
                    error: true
                }
            }
        }
        catch(e) {
            throw new HttpException('Error', 500);
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
                const { plan_id, plan_deadline, team_id, is_invoice_applicable } = transactionRow;

                if(is_invoice_applicable) {
                    await this.transactionsRepository
                        .createQueryBuilder()
                        .update({
                            invoice_number: await this.generateInvoiceNumber()
                        })
                        .where({
                            id: sessionId
                        })
                        .execute();
                }

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
