import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('teams')
export class TeamsEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    creator_id: number;

    @Column()
    name: string;

    @Column()
    team_url: string;

    @Column()
    owner_id: number;

    @Column({
        nullable: true
    })
    current_subscription_plan_id: number;

    @Column({
        nullable: true
    })
    current_subscription_plan_deadline: Date;

    @Column({
        nullable: true
    })
    subscription_renewal: Date;
}
