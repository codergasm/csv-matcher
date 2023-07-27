import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ApiService} from "./api.service";
import {AuthGuard} from "@nestjs/passport";

@Controller('api')
export class ApiController {
    constructor(
        private readonly apiService: ApiService
    ) {
    }

    getUsernameAndPassword(request) {
        const authHeader = request.headers['authorization'];
        const encodedCredentials = authHeader.replace('Basic ', '');
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
        return decodedCredentials.split(':');
    }

    @UseGuards(AuthGuard('basic'))
    @Post('/match')
    match(@Body() body, @Req() request) {
        const [username, password] = this.getUsernameAndPassword(request);

        const { sheet1, sheet2, outputEndpoint,
            userRedirectionWebsite, relationType } = body;

        return this.apiService.matching(username, password, sheet1, sheet2,
            outputEndpoint, userRedirectionWebsite, relationType);
    }
}
