import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription_types')
export class SubscriptionTypesEntity {
    @Column()
    is_default_and_free: boolean;

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
    users_per_team: number;

    @Column()
    files_per_team: number;

    @Column()
    rows_per_file: number;

    @Column()
    columns_per_file: number;

    @Column()
    size_per_file: number;

    @Column()
    size_per_team: number;

    @Column()
    schemas_per_team: number;

    @Column()
    matches_per_month: number;
}
