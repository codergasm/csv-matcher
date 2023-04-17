import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FilesEntity} from "../entities/files.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import * as fs from 'fs';
import * as papa from 'papaparse';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {
    }

    getNumberOfRows(sheet) {
        // Convert files to array of objects
        const sheetFileContent = fs.readFileSync(sheet.path, 'utf-8');
        const sheetObject = papa.parse(sheetFileContent, { header: true }).data;
        return sheetObject.length;
    }

    async saveSheet(files, email, teamOwner) {
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

    async deleteSheet(id) {
        // Get file by id
        const fileRow = await this.filesRepository.findOneBy({id});

        if(fileRow) {
            // Delete file
            fs.unlink(fileRow.filepath, (err) => {
                throw new HttpException('Coś poszło nie tak... Prosimy spróbować później', 500);
            });

            // Delete row from database
            return this.filesRepository.delete({id});
        }
        else {
            throw new BadRequestException('Plik o podanym id nie istnieje');
        }
    }

    async getFilesByUser(email) {
        const user = await this.usersRepository.findOneBy({email});

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
}
