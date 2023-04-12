import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teams')
export class TeamsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creator_id: number;

    @Column()
    name: string;

    @Column()
    team_url: string;

    @Column()
    owner_id: string;
}
