import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('users_verification')
export class UsersVerificationEntity {
    @PrimaryColumn()
    email: string;

    @Column()
    token: string;

    @Column()
    expire_date: Date;
}
