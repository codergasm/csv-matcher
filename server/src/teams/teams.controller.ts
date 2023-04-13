import {Body, Controller, Get, Param, Post} from '@nestjs/common';
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

    @Get('/getAllTeams')
    getAllTeams() {
        return this.teamsService.getAllTeams();
    }

    @Post('/createTeam')
    createTeam(@Body() body) {
        return this.teamsService.createTeam(body.name, body.teamUrl, body.email);
    }
}
