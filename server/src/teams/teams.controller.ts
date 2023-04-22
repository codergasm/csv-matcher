import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {TeamsService} from "./teams.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";

@Controller('teams')
export class TeamsController {
    constructor(
        private readonly teamsService: TeamsService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getTeamById/:id')
    async getTeamById(@Param('id') id) {
        return this.teamsService.getTeamById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAllTeams')
    getAllTeams() {
        return this.teamsService.getAllTeams();
    }

    @UseGuards(JwtAuthGuard)
    @Post('/createTeam')
    createTeam(@Body() body) {
        return this.teamsService.createTeam(body.name, body.teamUrl, body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateTeamName')
    updateTeamName(@Body() body) {
        return this.teamsService.updateTeamName(body.name, body.team_url, body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getWaitingJoinTeamRequests/:id')
    getWaitingJoinTeamRequests(@Param('id') id) {
        return this.teamsService.getWaitingJoinTeamRequests(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getTeamMembers/:id')
    getTeamMembers(@Param('id') id) {
        return this.teamsService.getTeamMembers(id);
    }
}
