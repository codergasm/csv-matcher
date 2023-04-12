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
    owner_user_id: number;

    @Column()
    owner_team_id: number;
}
