import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";
import {FilesEntity} from "../entities/files.entity";
import * as fs from "fs";
import * as papa from 'papaparse';

@Injectable()
export class SchemasService {
    constructor(
        @InjectRepository(MatchSchemasEntity)
        private readonly schemasRepository: Repository<MatchSchemasEntity>,
        @InjectRepository(MatchSchemasSheetsEntity)
        private readonly schemasSheetsRepository: Repository<MatchSchemasSheetsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(FilesEntity)
        private readonly filesRepository: Repository<FilesEntity>
    ) {
    }

    async getSchemaById(id) {
        return this.schemasRepository.findOneBy({id});
    }

    async getSchemasByUser(email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            return this.schemasRepository
                .createQueryBuilder('schemas')
                .leftJoinAndSelect('match_schemas_sheets', 'sheets', 'schemas.id = sheets.match_schema')
                .where('schemas.owner_user_id = :userId OR schemas.owner_team_id = :teamId',
                    {userId: user.id, teamId: user.team_id})
                .getRawMany();
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async saveSchema(name, matchedStringsArray, automaticMatcherSettingsObject,
                     email, teamOwner, dataSheetId, relationSheetId) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            try {
                const schema = await this.schemasRepository.save({
                    name,
                    matched_strings_array: JSON.stringify(matchedStringsArray),
                    automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject),
                    owner_user_id: teamOwner ? null : user.id,
                    owner_team_id: teamOwner ? user.team_id : null,
                    created_datetime: new Date()
                });

                if(dataSheetId && relationSheetId) {
                    await this.assignSheetsToSchema(dataSheetId, relationSheetId, schema.id);
                    return schema;
                }
                else {
                    return schema;
                }
            }
            catch(err) {
                throw new HttpException('Coś poszło nie tak... Prosimy spróbować później', 500);
            }
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async updateSchema(id, name, matchedStringsArray, automaticMatcherSettingsObject) {
        let updateObject = {};

        if(name) {
            updateObject = {
                name,
                matched_strings_array: JSON.stringify(matchedStringsArray),
                automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject)
            }
        }
        else {
            updateObject = {
                matched_strings_array: JSON.stringify(matchedStringsArray),
                automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject)
            }
        }

        return this.schemasRepository
            .createQueryBuilder()
            .update(updateObject)
            .where({
                id
            })
            .execute();
    }

    async updateSchemaName(id, name) {
        return this.schemasRepository
            .createQueryBuilder()
            .update({
                name
            })
            .where({
                id
            })
            .execute();
    }

    async assignSchemaToTeam(id, email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            return this.schemasRepository
                .createQueryBuilder()
                .update({
                    owner_user_id: null,
                    owner_team_id: user.team_id
                })
                .where({
                    id
                })
                .execute();
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async deleteSchema(id) {
        return this.schemasRepository.delete({id});
    }

    async assignSheetsToSchema(dataSheet, relationSheet, matchSchema) {
        console.log(dataSheet, relationSheet, matchSchema);

        // TODO: czasami matchSchema to null, niezaleznie od arkuszy, nie wiadomo dlaczego

        const insertedRow = await this.schemasSheetsRepository.save({
            data_sheet: dataSheet,
            relation_sheet: relationSheet,
            match_schema: matchSchema
        });

        const numberOfMatchedRows = await this.getNumberOfMatchedRows(insertedRow.id);

        return this.schemasSheetsRepository
            .createQueryBuilder()
            .update({
                number_of_matched_rows: numberOfMatchedRows
            })
            .where({
                id: insertedRow.id
            })
            .execute();
    }

    async detachSheetsFromSchema(dataSheet, relationSheet, matchSchema) {
        return this.schemasSheetsRepository.delete({
            data_sheet: dataSheet,
            relation_sheet: relationSheet,
            match_schema: matchSchema
        });
    }

    async detachSheetsFromSchemaById(id) {
        return this.schemasSheetsRepository.delete({id});
    }

    async getNumberOfMatchedRows(schemasSheetsRowId) {
        const schemasSheetsRow = await this.schemasSheetsRepository.findOneBy({
            id: schemasSheetsRowId
        });

        if(schemasSheetsRow) {
            const dataSheetId = schemasSheetsRow.data_sheet;
            const relationSheetId = schemasSheetsRow.relation_sheet;

            const matchSchemaRow = await this.schemasRepository.findOneBy({id: schemasSheetsRow.match_schema});
            const dataSheetRow = await this.filesRepository.findOneBy({id: dataSheetId});
            const relationSheetRow = await this.filesRepository.findOneBy({id: relationSheetId});

            if(dataSheetRow && relationSheetRow && matchSchemaRow) {
                const matchedStringsArray = JSON.parse(matchSchemaRow.matched_strings_array);

                // Convert files to array of objects
                const dataFileContent = fs.readFileSync(dataSheetRow.filepath, 'utf-8');
                const relationFileContent = fs.readFileSync(relationSheetRow.filepath, 'utf-8');
                const dataSheet = papa.parse(dataFileContent, { header: true }).data;
                const relationSheet = papa.parse(relationFileContent, { header: true }).data;

                // Convert array of objects to row shortcuts
                const dataSheetShortcuts = dataSheet.map((item) => {
                    return Object.entries(item).map((item) => (typeof item[1] === 'string' ?
                        item[1].substring(0, 50) : '')).join(';')
                });
                const relationSheetShortcuts = relationSheet.map((item) => {
                    return Object.entries(item).map((item) => (typeof item[1] === 'string' ?
                        item[1].substring(0, 50) : '')).join(';')
                });

                const matchedRows = matchedStringsArray.filter((item) => {
                    return (dataSheetShortcuts.includes(item[0]) && relationSheetShortcuts.includes(item[1])) ||
                        (dataSheetShortcuts.includes(item[1]) && relationSheetShortcuts.includes(item[0]));
                });

                return matchedRows.length;
            }
            else {
                throw new BadRequestException('Nie znaleziono podanych plików');
            }
        }
        else {
            throw new BadRequestException('Nie znaleziono podanego rekordu');
        }
    }

    async correlateUsingSchema(dataSheetId, relationSheetId, matchSchemaId) {
        const matchSchemaRow = await this.schemasRepository.findOneBy({id: matchSchemaId});
        const dataSheetRow = await this.filesRepository.findOneBy({id: dataSheetId});
        const relationSheetRow = await this.filesRepository.findOneBy({id: relationSheetId});

        if(dataSheetRow && relationSheetRow && matchSchemaRow) {
            const matchedStringsArray = JSON.parse(matchSchemaRow.matched_strings_array);

            // Convert files to array of objects
            const dataFileContent = fs.readFileSync(dataSheetRow.filepath, 'utf-8');
            const relationFileContent = fs.readFileSync(relationSheetRow.filepath, 'utf-8');
            const dataSheet = papa.parse(dataFileContent, { header: true }).data;
            const relationSheet = papa.parse(relationFileContent, { header: true }).data;

            // Convert array of objects to row shortcuts
            const dataSheetShortcuts = dataSheet.map((item) => {
                return Object.entries(item).map((item) => (typeof item[1] === 'string' ?
                    item[1].substring(0, 50) : '')).join(';')
            });
            const relationSheetShortcuts = relationSheet.map((item) => {
                return Object.entries(item).map((item) => (typeof item[1] === 'string' ?
                    item[1].substring(0, 50) : '')).join(';')
            });

            const matchedRows = matchedStringsArray.map((item) => {
                const matchDataString = item[0];
                const matchRelationString = item[1];
                const dataSheetMatchIndex = dataSheetShortcuts.findIndex((item) => (item === matchDataString));
                const relationSheetMatchIndex = relationSheetShortcuts.findIndex((item) => (item === matchRelationString));

                if(dataSheetMatchIndex !== -1 && relationSheetMatchIndex !== -1) {
                    return [dataSheetMatchIndex, relationSheetMatchIndex];
                }
                else {
                    return null;
                }
            }).filter((item) => (item));

            const matchedRowsInRelationSheet = matchedRows.map((item) => (item[1]));

            return relationSheetShortcuts.map((item, index) => {
                if(matchedRowsInRelationSheet.includes(index)) {
                    const relationSheetIndex = index;
                    const matchedRow = matchedRows.find((item, index) => (item[1] === relationSheetIndex))

                    if(matchedRow) {
                        return matchedRow[0];
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    return -1;
                }
            });
        }
        else {
            throw new BadRequestException('Nie znaleziono podanych plików');
        }
    }
}
