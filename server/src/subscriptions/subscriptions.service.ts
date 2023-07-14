import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionTypesEntity} from "../entities/subscription_types.entity";
import {Repository} from "typeorm";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(SubscriptionTypesEntity)
        private readonly subscriptionTypesRepository: Repository<SubscriptionTypesEntity>
    ) {
    }

    getAllSubscriptionPlans() {
        return this.subscriptionTypesRepository.find();
    }

    getPlanById(id) {
        return this.subscriptionTypesRepository.findOneBy({id});
    }
}
