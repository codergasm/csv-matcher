import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('languages')
export class LanguagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    shortcut: string;

    @Column()
    full_name: string;

    @Column()
    flag: string;

    @Column()
    currency: string;
}
