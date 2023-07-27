import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ApiMatchingRequestsRegistryEntity} from "../entities/api_matching_requests_registry.entity";
import {Repository} from "typeorm";
import {
    FilesApiMatchingRequestsRegistryRelationEntity
} from "../entities/files_api_matching_requests_registry_relation.entity";
import {UsersEntity} from "../entities/users.entity";
import * as fs from 'fs';
import {FilesEntity} from "../entities/files.entity";
import createPasswordHash from "../common/createPasswordHash";
import moveFileToTeamDirectoryByName from "../common/moveFileToTeamDirectoryByName";

@Injectable()
export class ApiService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(ApiMatchingRequestsRegistryEntity)
        private readonly apiMatchingRequestsRegistryRepository: Repository<ApiMatchingRequestsRegistryEntity>,
        @InjectRepository(FilesApiMatchingRequestsRegistryRelationEntity)
        private readonly filesApiMatchingRequestsRegistryRelationRepository: Repository<FilesApiMatchingRequestsRegistryRelationEntity>
    ) {
    }

    parseSheets(sheet1, sheet2) {
        try {
            const dataSheet = JSON.parse(sheet1);
            const relationSheet = JSON.parse(sheet2);

            return { dataSheet, relationSheet }
        }
        catch(e) {
            console.log(e);
            throw new HttpException('Niepoprawny format arkuszy', 400);
        }
    }

    async convertJsonToCsvFile(json, userId, teamId, fileIndex) {
        const rowCount = json.length;
        const header = Object.keys(json[0]).join(';');
        const rows = json.map((item) => {
            return Object.values(item).join(';');
        }).join('\n');

        const fileContent = `${header}\n${rows}`;
        const filename = `uploads/api_${userId}_${fileIndex}.csv`;

        try {
            fs.writeFileSync(filename, fileContent);
            const filesize = (await fs.promises.stat(filename)).size;
            const filepath = await moveFileToTeamDirectoryByName(filename, teamId);

            return this.filesRepository.save({
                filename: filename.replace('uploads/', ''),
                filepath,
                filesize,
                row_count: rowCount,
                owner_user_id: userId,
                owner_team_id: null,
                created_datetime: new Date()
            });
        }
        catch(e) {
            throw new HttpException('Nie udało się zapisać plików', 500);
        }
    }

    async matching(username, password, sheet1, sheet2, outputEndpoint,
                   userRedirectionWebsite, relationType) {
        const hash = createPasswordHash(password);

        const user = await this.usersRepository.findOneBy({
            email: username,
            password: hash
        });

        if(user) {
            const userId = user.id;
            const teamId = user.team_id;

            const { dataSheet, relationSheet } = this.parseSheets(sheet1, sheet2);

            const apiMatchingRequest = await this.apiMatchingRequestsRegistryRepository.save({
                create_datetime: new Date(),
                user_id: userId,
                output_endpoint: outputEndpoint,
                user_redirection_website: userRedirectionWebsite,
                relation_type: relationType
            });

            if(apiMatchingRequest) {
                const apiMatchingRequestId = apiMatchingRequest.id;

                const userApiFiles = await this.apiMatchingRequestsRegistryRepository
                    .createQueryBuilder('api')
                    .leftJoinAndSelect('files_api_matching_requests_registry_relation', 'files', 'api.id = files.api_request_id')
                    .where('api.user_id = :userId', { userId })
                    .execute();
                const numberOfUserApiFiles = userApiFiles.length;

                const dataSheetFile = await this.convertJsonToCsvFile(dataSheet, userId, teamId,numberOfUserApiFiles+1);
                const relationSheetFile = await this.convertJsonToCsvFile(relationSheet, userId, teamId,numberOfUserApiFiles+2);

                await this.filesApiMatchingRequestsRegistryRelationRepository.save({
                    api_request_id: apiMatchingRequestId,
                    file_id: dataSheetFile.id
                });
                await this.filesApiMatchingRequestsRegistryRelationRepository.save({
                    api_request_id: apiMatchingRequestId,
                    file_id: relationSheetFile.id
                });
            }
            else {
                throw new HttpException('Nie udało się dodać operacji API', 500);
            }
        }
        else {
            throw new HttpException('Błąd autoryzacji', 401);
        }
    }
}
