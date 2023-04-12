import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('add_to_team_users_requests')
export class AddToTeamUsersRequestsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    team_id: number;

    @Column()
    created_datetime: Date;

    @Column()
    status: string;
}
