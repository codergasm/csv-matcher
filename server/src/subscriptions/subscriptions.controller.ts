import {Controller, Get, Param} from '@nestjs/common';
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

    @Get('/getPlanById/:id')
    getPlanById(@Param('id') id) {
        return this.subscriptionsService.getPlanById(id);
    }
}
