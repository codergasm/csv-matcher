import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
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

    @Patch('/updateTeamName')
    updateTeamName(@Body() body) {
        return this.teamsService.updateTeamName(body.name, body.id);
    }

    @Get('/getWaitingJoinTeamRequests/:id')
    getWaitingJoinTeamRequests(@Param('id') id) {
        return this.teamsService.getWaitingJoinTeamRequests(id);
    }

    @Get('/getTeamMembers/:id')
    getTeamMembers(@Param('id') id) {
        return this.teamsService.getTeamMembers(id);
    }
}
