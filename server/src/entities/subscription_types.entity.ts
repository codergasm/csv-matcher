import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription_types')
export class SubscriptionTypesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price_pln: number;

    @Column()
    price_eur: number;

    @Column()
    price_usd: number;

    @Column()
    users_per_team_limit: number;

    @Column()
    files_per_team_limit: number;

    @Column()
    file_max_row_per_team_limit: number;

    @Column()
    file_max_filesize_per_team_limit: number;

    @Column()
    match_schemas_per_team_limit: number;

    @Column()
    automatic_matched_rows_per_team_limit: number;
}
