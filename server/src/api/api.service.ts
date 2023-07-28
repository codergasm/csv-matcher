import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ApiMatchingRequestsRegistryEntity} from "../entities/api_matching_requests_registry.entity";
import {In, Repository} from "typeorm";
import {
    FilesApiMatchingRequestsRegistryRelationEntity
} from "../entities/files_api_matching_requests_registry_relation.entity";
import {UsersEntity} from "../entities/users.entity";
import * as fs from 'fs';
import {FilesEntity} from "../entities/files.entity";
import createPasswordHash from "../common/createPasswordHash";
import moveFileToTeamDirectoryByName from "../common/moveFileToTeamDirectoryByName";
import { v4 as uuid } from 'uuid';
import {MatchSchemasEntity} from "../entities/match_schemas.entity";

@Injectable()
export class ApiService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>,
        @InjectRepository(MatchSchemasEntity)
        private readonly schemasRepository: Repository<MatchSchemasEntity>,
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

    async apiAuthorization(id, token) {
        const row = await this.apiMatchingRequestsRegistryRepository.findOneBy({
            id, token
        });

        if(row) {
            return true;
        }
        else {
            throw new UnauthorizedException();
        }
    }

    async getApiRequestById(id, token) {
        return this.apiMatchingRequestsRegistryRepository.findOneBy({
            id, token
        });
    }

    async getFilesByApiRequest(id, token) {
        if(await this.apiAuthorization(id, token)) {
            const files = await this.filesApiMatchingRequestsRegistryRelationRepository.findBy({
                api_request_id: id
            });
            const filesIds = files.map((item) => (item.file_id));

            return this.filesRepository.findBy({
                id: In(filesIds)
            });
        }
        else {
            throw new UnauthorizedException();
        }
    }

    async getSchemasByUserApiToken(token) {
        const apiRow = await this.apiMatchingRequestsRegistryRepository.findOneBy({token});

        if(apiRow) {
            const userId = apiRow.user_id;
            const user = await this.usersRepository.findOneBy({id: userId});

            if(user) {
                return this.schemasRepository
                    .createQueryBuilder('schemas')
                    .leftJoinAndSelect('match_schemas_sheets', 'sheets', 'schemas.id = sheets.match_schema')
                    .where('schemas.owner_user_id = :userId OR schemas.owner_team_id = :teamId',
                        {userId: user.id, teamId: user.team_id ? user.team_id : -1})
                    .getRawMany();
            }
            else {
                throw new UnauthorizedException();
            }
        }
        else {
            throw new UnauthorizedException();
        }
    }

    async getFilesByUserApiToken(token) {
        const apiRow = await this.apiMatchingRequestsRegistryRepository.findOneBy({token});

        if(apiRow) {
            const userId = apiRow.user_id;
            const user = await this.usersRepository.findOneBy({id: userId});

            if(user) {
                return this.filesRepository.find({
                    where: [
                        { owner_user_id: user.id },
                        { owner_team_id: user.team_id ? user.team_id : -1 }
                    ]
                });
            }
            else {
                throw new UnauthorizedException();
            }
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
            const authToken = await uuid().slice(0, 64);

            const { dataSheet, relationSheet } = this.parseSheets(sheet1, sheet2);

            const apiMatchingRequest = await this.apiMatchingRequestsRegistryRepository.save({
                create_datetime: new Date(),
                user_id: userId,
                output_endpoint: outputEndpoint,
                user_redirection_website: userRedirectionWebsite,
                relation_type: relationType,
                token: authToken
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

                return {
                    id: apiMatchingRequestId,
                    token: authToken
                }
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
