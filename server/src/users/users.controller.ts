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
        const { email, password } = body;
        return this.usersService.registerUser(email, password);
    }

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.usersService.verifyUser(body.token);
    }

    @Post('/login')
    loginUser(@Body() body) {
        const  { email, password } = body;
        return this.usersService.loginUser(email, password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/addToTeamRequest')
    async addToTeamRequest(@Body() body) {
        const { userId, teamId } = body;
        return this.usersService.addToTeamRequest(userId, teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserData/:email')
    getUserData(@Param('email') email) {
        return this.usersService.getUserData(email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/changePassword')
    changePassword(@Body() body) {
        const { oldPassword, newPassword, email } = body;
        return this.usersService.changePassword(oldPassword, newPassword, email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/joinTeam')
    joinTeam(@Body() body) {
        const { teamId, email } = body;
        return this.usersService.joinTeam(teamId, email);
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
        return this.usersService.updateUserRights(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/acceptJoinRequest')
    acceptJoinRequest(@Body() body) {
        const { userId, teamId } = body;
        return this.usersService.acceptJoinRequest(userId, teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/rejectJoinRequest')
    rejectJoinRequest(@Body() body) {
        const { userId, teamId } = body;
        return this.usersService.rejectJoinRequest(userId, teamId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserTeamPlan/:email')
    getUserTeamPlan(@Param('email') email) {
        return this.usersService.getUserTeamPlan(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/checkIfUserCanLeaveTeam/:email')
    checkIfUserCanLeaveTeam(@Param('email') email) {
        return this.usersService.checkIfUserCanLeaveTeam(email);
    }
}
