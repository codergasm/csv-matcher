import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {Repository} from "typeorm";
import {AutomaticMatchOperationsRegistryEntity} from "../entities/automatic_match_operations_registry.entity";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>,
        @InjectRepository(AutomaticMatchOperationsRegistryEntity)
        private readonly automaticMatchOperationsRegistryRepository: Repository<AutomaticMatchOperationsRegistryEntity>
    ) {
    }

    async getAllSubscriptionPlans() {
        return this.subscriptionTypesRepository.find();
    }

    async getPlanById(id) {
        return this.subscriptionTypesRepository.findOneBy({id});
    }

    async getAutoMatchOperationsInCurrentMonth(teamId) {
        const allTeamOperations = await this.automaticMatchOperationsRegistryRepository.findBy({
           team_id: teamId,
        });

        const currentMonth = new Date().getMonth();

        return allTeamOperations.filter((item) => {
            return item.created_datetime.getMonth() === currentMonth;
        }).reduce((prev, curr) => {
            return prev + curr.matched_rows_count;
        }, 0);
    }
}
