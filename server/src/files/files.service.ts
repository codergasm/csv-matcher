import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FilesEntity} from "../entities/files.entity";
import {In, Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import * as fs from 'fs';
import * as papa from 'papaparse';
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {TeamsEntity} from "../entities/teams.entity";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(TeamsEntity)
        private readonly teamsRepository: Repository<TeamsEntity>,
        @InjectRepository(MatchSchemasSheetsEntity)
        private readonly schemasSheetsRepository: Repository<MatchSchemasSheetsEntity>,
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>
    ) {
    }

    getNumberOfRows(sheet) {
        // Convert files to array of objects
        const sheetFileContent = fs.readFileSync(sheet.path, 'utf-8');
        const sheetObject = papa.parse(sheetFileContent, { header: true }).data;
        return sheetObject.length;
    }

    getNumberOfCols(sheet) {
        const sheetFileContent = fs.readFileSync(sheet.path, 'utf-8');
        const sheetObject = papa.parse(sheetFileContent, { header: true }).data;
        return Math.max.apply(null, sheetObject.map((item) => (Object.entries(item).length)));
    }

    async getFileById(id) {
        return this.filesRepository.findOneBy({
            id
        });
    }

    async getFilesInTeam(team_id) {
        const teamMembers = await this.usersRepository.findBy({
            team_id
        });
        const teamMembersIds = teamMembers.map((item) => (item.id));

        const usersFiles = await this.filesRepository.findBy({
            owner_user_id: In(teamMembersIds)
        });
        const teamFiles = await this.filesRepository.findBy({
            owner_team_id: team_id
        });

        return [...usersFiles, ...teamFiles];
    }

    async getCurrentTeamSubscriptionDetails(team_id) {
        const teamRow = await this.teamsRepository.findOneBy({
            id: team_id
        });

        const subscriptionId = teamRow.current_subscription_plan_id;
        const subscriptionDeadline = teamRow.current_subscription_plan_deadline;

        if(subscriptionDeadline > new Date()) {
            return this.subscriptionTypesRepository.findOneBy({
                id: subscriptionId
            });
        }
        else {
            return this.subscriptionTypesRepository.findOneBy({
                id: 1
            });
        }
    }

    async checkIfNumberOfFilesPerTeamNotExceeded(team_id) {
        const subscriptionRow = await this.getCurrentTeamSubscriptionDetails(team_id);
        const allTeamFiles = await this.getFilesInTeam(team_id);

        const filesPerTeamLimit = subscriptionRow.files_per_team;
        return filesPerTeamLimit > allTeamFiles.length;
    }

    async checkIfNumberOfRowsPerFileNotExceeded(team_id, numberOfRows) {
        const subscriptionRow = await this.getCurrentTeamSubscriptionDetails(team_id);
        return subscriptionRow.rows_per_file > numberOfRows;
    }

    async checkIfNumberOfColsPerFileNotExceeded(team_id, numberOfCols) {
        const subscriptionRow = await this.getCurrentTeamSubscriptionDetails(team_id);
        return subscriptionRow.columns_per_file > numberOfCols;
    }

    async checkIfSizePerFileNotExceeded(team_id, filesize) {
        const subscriptionRow = await this.getCurrentTeamSubscriptionDetails(team_id);
        return subscriptionRow.size_per_file > filesize;
    }

    async checkIfSizePerTeamNotExceeded(team_id, filesize) {
        const subscriptionRow = await this.getCurrentTeamSubscriptionDetails(team_id);
        const allTeamFiles = await this.getFilesInTeam(team_id);

        const allTeamFilesSize = allTeamFiles.reduce((prev, curr) => {
            return prev + curr.filesize;
        }, 0);

        return subscriptionRow.size_per_team > allTeamFilesSize + filesize;
    }

    async saveSheet(body, files) {
        const { email, teamOwner } = body;
        const sheetFile = files.sheet[0];

        const numberOfRows = this.getNumberOfRows(sheetFile);
        const numberOfCols = this.getNumberOfCols(sheetFile);
        const filesize = (await fs.promises.stat(sheetFile.path)).size

        const user = await this.usersRepository.findOneBy({
            email
        });
        const teamId = user.team_id;

        if(await this.checkIfNumberOfFilesPerTeamNotExceeded(teamId)) {
            if(await this.checkIfNumberOfRowsPerFileNotExceeded(teamId, numberOfRows)) {
                if(await this.checkIfNumberOfColsPerFileNotExceeded(teamId, numberOfCols)) {
                    if(await this.checkIfSizePerFileNotExceeded(teamId, filesize)) {
                        if(await this.checkIfSizePerTeamNotExceeded(teamId, filesize)) {
                            if(user) {
                                return this.filesRepository.save({
                                    filename: sheetFile.originalname,
                                    filepath: sheetFile.path,
                                    filesize: filesize,
                                    row_count: numberOfRows,
                                    column_count: numberOfCols,
                                    owner_user_id: teamOwner === 'true' ? null : user.id,
                                    owner_team_id: teamOwner === 'true' ? user.team_id : null,
                                    created_datetime: new Date()
                                });
                            }
                            else {
                                throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
                            }
                        }
                        else {
                            return {
                                error: 'sizePerTeamExceeded'
                            }
                        }
                    }
                    else {
                        return {
                            error: 'sizePerFileExceeded'
                        }
                    }
                }
                else {
                    return {
                        error: 'numberOfColsPerFileExceeded'
                    }
                }
            }
            else {
                return {
                    error: 'numberOfRowsPerFileExceeded'
                }
            }
        }
        else {
            return {
                error: 'numberOfFilesPerTeamExceeded'
            }
        }
    }

    async deleteSheetAssignmentToSchemas(id) {
        await this.schemasSheetsRepository.delete({
            data_sheet: id
        });
        await this.schemasSheetsRepository.delete({
            relation_sheet: id
        });
    }

    async deleteSheet(id) {
        const fileRow = await this.filesRepository.findOneBy({id});

        if(fileRow) {
            fs.unlinkSync(fileRow.filepath);
            await this.deleteSheetAssignmentToSchemas(id);
            return this.filesRepository.delete({id});
        }
        else {
            throw new BadRequestException('Plik o podanym id nie istnieje');
        }
    }

    async getFilesByUser(email) {
        const user = await this.usersRepository.findOneBy({email});
        return this.getUserFiles(user);
    }

    async getFilesByUserId(id) {
        const user = await this.usersRepository.findOneBy({id});
        return this.getUserFiles(user);
    }

    async getUserFiles(user) {
        if(user) {
            return this.filesRepository.find({
                where: [
                    { owner_user_id: user.id },
                    { owner_team_id: user.team_id ? user.team_id : 111 }
                ]
            });
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async assignFileOwnershipToTeam(fileId, teamId) {
        return this.filesRepository
            .createQueryBuilder()
            .update({
                owner_user_id: null,
                owner_team_id: teamId
            })
            .where({
                id: fileId
            })
            .execute();
    }

    async updateFileName(id, name) {
        return this.filesRepository
            .createQueryBuilder()
            .update({
                filename: name
            })
            .where({
                id
            })
            .execute();
    }

    async getFileSizeInBytes(path) {
        return (await fs.promises.stat(path)).size;
    }

    async updateFile(body, files) {
        const { id, name, email } = body;
        const sheetFile = files.sheet[0];

        const numberOfRows = this.getNumberOfRows(sheetFile);
        const numberOfCols = this.getNumberOfCols(sheetFile);
        const filesize = await this.getFileSizeInBytes(sheetFile.path);

        const user = await this.usersRepository.findOneBy({
            email
        });
        const teamId = user.team_id;

        if(user) {
            const oldFileRow = await this.filesRepository.findOneBy({id});

            if(await this.checkIfNumberOfRowsPerFileNotExceeded(teamId, numberOfRows)) {
                if(await this.checkIfNumberOfColsPerFileNotExceeded(teamId, numberOfCols)) {
                    if(await this.checkIfSizePerFileNotExceeded(teamId, filesize)) {
                        if(await this.checkIfSizePerTeamNotExceeded(teamId, filesize - oldFileRow.filesize)) {
                            if(user) {
                                // Save new file in database
                                await this.filesRepository
                                    .createQueryBuilder()
                                    .update({
                                        filename: name,
                                        filepath: sheetFile.path,
                                        filesize: filesize,
                                        row_count: numberOfRows,
                                        column_count: numberOfCols
                                    })
                                    .where({
                                        id
                                    })
                                    .execute();

                                // Delete old file from filesystem
                                fs.unlinkSync(oldFileRow.filepath);
                                return 1;
                            }
                            else {
                                throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
                            }
                        }
                        else {
                            return {
                                error: 'sizePerTeamExceeded'
                            }
                        }
                    }
                    else {
                        return {
                            error: 'sizePerFileExceeded'
                        }
                    }
                }
                else {
                    return {
                        error: 'numberOfColsPerFileExceeded'
                    }
                }
            }
            else {
                return {
                    error: 'numberOfRowsPerFileExceeded'
                }
            }
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }
}
