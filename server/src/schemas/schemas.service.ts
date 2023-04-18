import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MatchSchemasEntity} from "../entities/match_schemas.entity";
import {Repository} from "typeorm";
import {UsersEntity} from "../entities/users.entity";
import {MatchSchemasSheetsEntity} from "../entities/match_schemas_sheets.entity";

@Injectable()
export class SchemasService {
    constructor(
        @InjectRepository(MatchSchemasEntity)
        private readonly schemasRepository: Repository<MatchSchemasEntity>,
        @InjectRepository(MatchSchemasSheetsEntity)
        private readonly schemasSheetsRepository: Repository<MatchSchemasSheetsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {
    }

    async getSchemasByUser(email) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            return this.schemasRepository.find({
                where: [
                    {owner_user_id: user.id},
                    {owner_team_id: user.team_id}
                ]
            });
        }
        else {
            throw new BadRequestException('Użytkownik o podanym adresie e-mail nie istnieje');
        }
    }

    async saveSchema(name, matchedStringsArray, automaticMatcherSettingsObject, email, teamOwner) {
        const user = await this.usersRepository.findOneBy({email});

        if(user) {
            try {
                return this.schemasRepository.save({
                    name,
                    matched_strings_array: JSON.stringify(matchedStringsArray),
                    automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject),
                    owner_user_id: teamOwner ? null : user.id,
                    owner_team_id: teamOwner ? user.team_id : null,
                    created_datetime: new Date()
                })
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
        return this.schemasRepository
            .createQueryBuilder()
            .update({
                name,
                matched_strings_array: JSON.stringify(matchedStringsArray),
                automatic_matcher_settings_object: JSON.stringify(automaticMatcherSettingsObject)
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
        return this.schemasSheetsRepository.save({
            data_sheet: dataSheet,
            relation_sheet: relationSheet,
            match_schema: matchSchema
        });
    }

    async detachSheetsFromSchema(dataSheet, relationSheet, matchSchema) {
        return this.schemasSheetsRepository.delete({
            data_sheet: dataSheet,
            relation_sheet: relationSheet,
            match_schema: matchSchema
        });
    }
}
