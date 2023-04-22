import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('correlation_jobs')
export class CorrelationJobsEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    user_id: number;

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
