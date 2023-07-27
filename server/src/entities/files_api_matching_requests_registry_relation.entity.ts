import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files_api_matching_requests_registry_relation')
export class FilesApiMatchingRequestsRegistryRelationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    api_request_id: number;

    @Column()
    file_id: number;
}
