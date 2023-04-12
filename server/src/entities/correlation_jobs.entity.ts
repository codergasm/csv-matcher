import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('correlation_jobs')
export class CorrelationJobsEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        nullable: true,
        default: null
    })
    creation_datetime: Date;

    @Column()
    rowCount: number;

    @Column()
    totalRows: number;

    @Column()
    status: string;
}
