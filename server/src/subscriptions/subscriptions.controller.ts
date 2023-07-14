import {Controller, Get} from '@nestjs/common';
import {SubscriptionsService} from "./subscriptions.service";

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService
    ) {
    }

    @Get('/getAll')
    getAllSubscriptionPlans() {
        return this.subscriptionsService.getAllSubscriptionPlans();
    }
}
