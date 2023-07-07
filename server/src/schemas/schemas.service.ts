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

    async saveSchema(body) {
        const { name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
            matchType, matchFunction,
            email, teamOwner, dataSheetId, relationSheetId } = body;
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            try {
               const schema = await this.schemasRepository.save({
                    name,
                    matched_strings_array: JSON.stringify(matchedStringsArray),
                    automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject),
                    columns_settings_object: JSON.stringify(columnsSettingsObject),
                    owner_user_id: teamOwner ? null : user.id,
                    owner_team_id: teamOwner ? user.team_id : null,
                    created_datetime: new Date(),
                    match_type: matchType,
                    match_function: matchFunction
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

    async updateSchema(body) {
        const { id, name, matchedStringsArray, automaticMatcherSettingsObject, columnsSettingsObject,
            matchType, matchFunction,
            dataSheetId, relationSheetId } = body;

        let updateObject: any = {
            matched_strings_array: JSON.stringify(matchedStringsArray),
            automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject),
            columns_settings_object: JSON.stringify(columnsSettingsObject),
            match_type: matchType,
            match_function: matchFunction
        };

        if(name) {
            updateObject = {
                ...updateObject,
                name: name
            }
        }

        const updateSchemaResponse = await this.schemasRepository
            .createQueryBuilder()
            .update(updateObject)
            .where({
                id
            })
            .execute();

        if(dataSheetId && relationSheetId) {
            const sheetsInSchemaRow = await this.schemasSheetsRepository.findOneBy({
                data_sheet: dataSheetId,
                relation_sheet: relationSheetId,
                match_schema: id
            });

            if(sheetsInSchemaRow) {
                const numberOfMatchedRows = await this.getNumberOfMatchedRows(sheetsInSchemaRow.id);

                return this.schemasSheetsRepository
                    .createQueryBuilder()
                    .update({
                        number_of_matched_rows: numberOfMatchedRows
                    })
                    .where({
                        id: sheetsInSchemaRow.id
                    })
                    .execute();
            }
            else {
                return updateSchemaResponse;
            }
        }
        else {
            return updateSchemaResponse;
        }
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

    async detachSheetsFromSchemaBySheetsAndSchemaId(dataSheet, relationSheet, matchSchema) {
        return this.schemasSheetsRepository.delete({
            data_sheet: dataSheet,
            relation_sheet: relationSheet,
            match_schema: matchSchema
        });
    }

    async detachSheetsFromSchemaBySchemaId(id) {
        return this.schemasSheetsRepository.delete({id});
    }

    convertArrayOfObjectsToRowShortcuts(arrayOfObjects) {
        const regex = /[^A-Za-z0-9]/g;
        return arrayOfObjects.map((item) => {
            return Object.entries(item).filter((_, index) => (index < 10)).map((item) => (
                item[1].toString().replace(regex, '').substring(0, 10))).join(';');
        })
    }

    convertFileToArrayOfObjects(fileRow) {
        const fileContent = fs.readFileSync(fileRow.filepath, 'utf-8');
        return papa.parse(fileContent, { header: true }).data;
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

                const dataSheet = this.convertFileToArrayOfObjects(dataSheetRow);
                const relationSheet = this.convertFileToArrayOfObjects(relationSheetRow);

                const dataSheetShortcuts = this.convertArrayOfObjectsToRowShortcuts(dataSheet);
                const relationSheetShortcuts = this.convertArrayOfObjectsToRowShortcuts(relationSheet);

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

            const dataSheet = this.convertFileToArrayOfObjects(dataSheetRow);
            const relationSheet = this.convertFileToArrayOfObjects(relationSheetRow);

            const dataSheetShortcuts = this.convertArrayOfObjectsToRowShortcuts(dataSheet);
            const relationSheetShortcuts = this.convertArrayOfObjectsToRowShortcuts(relationSheet);

            const matchedRows = matchedStringsArray.map((item) => {
                const matchDataString = item[0];
                const matchRelationString = item[1];
                const dataSheetMatchIndex = dataSheetShortcuts.findIndex((item) =>
                    (item === matchDataString));
                const relationSheetMatchIndex = relationSheetShortcuts.findIndex((item) =>
                    (item === matchRelationString));

                if(dataSheetMatchIndex !== -1 && relationSheetMatchIndex !== -1) {
                    return [dataSheetMatchIndex, relationSheetMatchIndex];
                }
                else {
                    return null;
                }
            }).filter((item) => (item));

            const matchedRowsInRelationSheet = matchedRows.map((item) => (item[1]));

            return relationSheetShortcuts.map((item, relationSheetIndex) => {
                if(matchedRowsInRelationSheet.includes(relationSheetIndex)) {
                    const matchedRow = matchedRows.find((item) => (item[1] === relationSheetIndex))

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
