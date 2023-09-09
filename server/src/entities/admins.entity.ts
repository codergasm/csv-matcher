import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('admins')
export class AdminsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    password: string;
}
