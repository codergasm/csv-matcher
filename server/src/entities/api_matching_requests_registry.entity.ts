import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('api_matching_requests_registry')
export class ApiMatchingRequestsRegistryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    create_datetime: Date;

    @Column()
    user_id: number;

    @Column()
    output_endpoint: string;

    @Column()
    user_redirection_website: string;

    @Column()
    relation_type: string;

    @Column()
    token: string;
}
