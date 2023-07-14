import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    create_datetime: number;

    @Column()
    user_id: number;

    @Column()
    status: string;

    @Column()
    payment_operator_token: string;

    @Column()
    invoice_row_id: number;

    @Column()
    payment_operator_name: string;

    @Column({
        nullable: true
    })
    payment_operator_unit_id: number;

    @Column()
    is_invoice_applicable: boolean;

    @Column()
    invoice_buyer_name: string;

    @Column()
    invoice_nip: string;
}
