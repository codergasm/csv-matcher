import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_schemas_sheets')
export class MatchSchemasSheetsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    data_sheet: number;

    @Column()
    relation_sheet: number;

    @Column()
    match_schema: number;
}
