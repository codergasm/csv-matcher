import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/auth')
    auth(@Req() req) {
        const decodedJwt: any = this.jwtService.decode(req.headers.authorization.split(' ')[1]);

        if(decodedJwt.username !== req.body.email) {
            throw new UnauthorizedException();
        }

        return true;
    }

    @Post('/register')
    registerUser(@Body() body) {
        return this.usersService.registerUser(body.email, body.password);
    }

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.usersService.verifyUser(body.token);
    }

    @Post('/login')
    loginUser(@Body() body) {
        return this.usersService.loginUser(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/addToTeamRequest')
    async addToTeamRequest(@Body() body) {
        return this.usersService.addToTeamRequest(body.userId, body.teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserData/:email')
    getUserData(@Param('email') email) {
        return this.usersService.getUserData(email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/changePassword')
    changePassword(@Body() body) {
        return this.usersService.changePassword(body.oldPassword, body.newPassword, body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/joinTeam')
    joinTeam(@Body() body) {
        return this.usersService.joinTeam(body.teamId, body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getWaitingJoinTeamRequest/:email')
    getWaitingJoinTeamRequest(@Param('email') email) {
        return this.usersService.getUserWaitingJoinTeamRequest(email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deleteJoinTeamRequest/:email')
    deleteJoinTeamRequest(@Param('email') email) {
        return this.usersService.deleteJoinTeamRequest(email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/leaveTeam')
    leaveTeam(@Body() body) {
        return this.usersService.leaveTeam(body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateUserRights')
    updateUserRights(@Body() body) {
        const { email, can_edit_team_match_schemas, can_delete_team_match_schemas,
            can_edit_team_files, can_delete_team_files } = body;
        return this.usersService.updateUserRights(email, can_edit_team_match_schemas, can_delete_team_match_schemas,
            can_edit_team_files, can_delete_team_files);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/acceptJoinRequest')
    acceptJoinRequest(@Body() body) {
        return this.usersService.acceptJoinRequest(body.userId, body.teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/rejectJoinRequest')
    rejectJoinRequest(@Body() body) {
        return this.usersService.rejectJoinRequest(body.userId, body.teamId);
    }
}
