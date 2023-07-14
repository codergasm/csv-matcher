import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('teams_current_subscriptions_plans_migrations_registry')
export class TeamsSubscriptionsMigrationsRegistryEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    current_datetime: Date;

    @Column()
    team_id: number;

    @Column()
    user_id: number;
}
