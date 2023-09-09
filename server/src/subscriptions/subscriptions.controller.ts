import {Body, Controller, Get, Param, Post} from '@nestjs/common';
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

    @Get('/getNumberOfAutoMatchOperationsInCurrentMonth/:id')
    getAutoMatchOperationsInCurrentMonth(@Param('id') id) {
        return this.subscriptionsService.getAutoMatchOperationsInCurrentMonth(id);
    }

    @Get('/getTeamLimitsUsage/:id')
    getTeamLimitsUsage(@Param('id') id) {
        return this.subscriptionsService.getTeamLimitsUsage(id);
    }

    @Post('/validateConversionPossibility')
    validateConversionPossibility(@Body() body) {
        const { teamId, newPlanId } = body;
        return this.subscriptionsService.validateConversionPossibility(teamId, newPlanId);
    }

    @Post('/convertSubscription')
    convertSubscription(@Body() body) {
        const { teamId, newPlanId, newPlanDeadline } = body;
        return this.subscriptionsService.convertSubscription(teamId, newPlanId, newPlanDeadline);
    }

    @Get(`/getTeamTransactions/:id`)
    getTeamTransactions(@Param('id') id) {
        return this.subscriptionsService.getTeamTransactions(id);
    }

    @Get('/getTeamInvoiceData/:id')
    getTeamInvoiceData(@Param('id') id) {
        return this.subscriptionsService.getTeamInvoiceData(id);
    }

    @Post('/registerPayment')
    registerPayment(@Body() body) {
        return this.subscriptionsService.registerPayment(body);
    }

    @Post('/verifyPayment')
    verifyPayment(@Body() body) {
        return this.subscriptionsService.verifyPayment(body);
    }
}
