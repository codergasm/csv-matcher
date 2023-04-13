import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    filepath: string;

    @Column()
    filesize: number;

    @Column()
    row_count: number;

    @Column({
        nullable: true
    })
    owner_user_id: number;

    @Column({
        nullable: true
    })
    owner_team_id: number;
}