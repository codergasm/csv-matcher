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
    team_id_of_user_at_time_of_this_action_happened: number;

    @Column()
    automatic_matched_rows_value: number;
}
