import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    team_id: number;

    @Column()
    show_user_files: boolean;

    @Column()
    show_user_match_schemas: boolean;

    @Column()
    can_edit_team_match_schemas: boolean;

    @Column()
    can_delete_team_match_schemas: boolean;

    @Column()
    can_edit_team_files: boolean;

    @Column()
    can_delete_team_files: boolean;

    @Column({
        default: false
    })
    active: boolean;
}
