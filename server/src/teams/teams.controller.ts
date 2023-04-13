import {Controller, Get, Param} from '@nestjs/common';
import {TeamsService} from "./teams.service";

@Controller('teams')
export class TeamsController {
    constructor(
        private readonly teamsService: TeamsService
    ) {
    }

    @Get('/getTeamById/:id')
    async getTeamById(@Param('id') id) {
        return this.teamsService.getTeamById(id);
    }
}
