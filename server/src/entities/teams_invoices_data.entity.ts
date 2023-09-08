import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('teams_invoices_data')
export class TeamsInvoicesDataEntity {
    @PrimaryColumn()
    team_id: number;

    @Column()
    name: string;

    @Column()
    nip: string;

    @Column()
    street_name: string;

    @Column()
    street_number: string;

    @Column()
    postal_code: string;
}
