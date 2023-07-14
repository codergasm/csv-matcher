import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('automatic_match_operations_registry')
export class AutomaticMatchOperationsRegistryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_datetime: Date;

    @Column()
    user_id: number;

    @Column()
    team_id: number;

    @Column()
    automatic_matched_rows_value: number;

    @Column()
    analyzed_row_count_sheet1: number;

    @Column()
    analyzed_row_count_sheet2: number;

    @Column()
    matched_rows_count: number;
}
