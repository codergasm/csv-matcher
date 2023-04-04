import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CorrelationJobs {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    creation_datetime: Date;

    @Column()
    rowCount: number;

    @Column()
    totalRows: number;

    @Column()
    status: string;
}
