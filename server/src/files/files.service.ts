import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FilesEntity} from "../entities/files.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import * as fs from 'fs';
import * as papa from 'papaparse';
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(MatchSchemasSheetsEntity)
        private readonly schemasSheetsRepository: Repository<MatchSchemasSheetsEntity>
    ) {
    }

    getNumberOfRows(sheet) {
        // Convert files to array of objects
        const sheetFileContent = fs.readFileSync(sheet.path, 'utf-8');
        const sheetObject = papa.parse(sheetFileContent, { header: true }).data;
        return sheetObject.length;
    }

    async getFileById(id) {
        return this.filesRepository.findOneBy({
            id
        });
    }

    async saveSheet(body, files) {
        const { email, teamOwner } = body;
        const sheetFile = files.sheet[0];

        const numberOfRows = this.getNumberOfRows(sheetFile);
        const filesize = (await fs.promises.stat(sheetFile.path)).size

        const user = await this.usersRepository.findOneBy({
            email
        });

        if(user) {
            return this.filesRepository.save({
                filename: sheetFile.originalname,
                filepath: sheetFile.path,
                filesize: filesize,
                row_count: numberOfRows,
                owner_user_id: teamOwner === 'true' ? null : user.id,
                owner_team_id: teamOwner === 'true' ? user.team_id : null,
                created_datetime: new Date()
            });
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
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
        const filesize = await this.getFileSizeInBytes(sheetFile.path);

        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            const oldFileRow = await this.filesRepository.findOneBy({id});

            // Save new file in database
            await this.filesRepository
                .createQueryBuilder()
                .update({
                    filename: name,
                    filepath: sheetFile.path,
                    filesize: filesize,
                    row_count: numberOfRows
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
}
