import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('transactions')
export class TransactionsEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    create_datetime: Date;

    @Column()
    user_id: number;

    @Column()
    status: string;

    @Column()
    payment_operator_token: string;

    @Column()
    payment_operator_name: string;

    @Column({
        nullable: true
    })
    payment_operator_unit_id: number;

    @Column()
    is_invoice_applicable: boolean;

    @Column({
        nullable: true
    })
    invoice_number: string;

    @Column({
        nullable: true
    })
    invoice_name: string;

    @Column({
        nullable: true
    })
    invoice_nip: string;

    @Column({
        nullable: true
    })
    invoice_street_name: string;

    @Column({
        nullable: true
    })
    invoice_street_number: string;

    @Column({
        nullable: true
    })
    invoice_postal_code: string;

    @Column({
        nullable: true
    })
    payment_token: string;

    @Column()
    amount: number;

    @Column()
    currency: string;

    @Column()
    team_id: number;

    @Column()
    plan_id: number;

    @Column()
    plan_deadline: Date;
}
