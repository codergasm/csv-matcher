import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_schemas')
export class MatchSchemasEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    matched_strings_array: string;

    @Column()
    automatic_matcher_settings_object: string;

    @Column()
    columns_settings_object: string;

    @Column()
    match_type: number;

    @Column()
    match_function: number;

    @Column({
        nullable: true
    })
    owner_user_id: number;

    @Column({
        nullable: true
    })
    owner_team_id: number;

    @Column()
    created_datetime: Date;
}
