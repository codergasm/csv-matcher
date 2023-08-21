import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('correlations')
export class CorrelationsEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    indexes_of_correlated_rows: string;

    @Column()
    schema_correlated_rows: string;

    @Column()
    correlation_matrix: string;

    @Column()
    select_list_data_sheet: string;

    @Column()
    select_list_relation_sheet: string;
}
