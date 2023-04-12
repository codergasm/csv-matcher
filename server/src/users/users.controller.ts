import {Body, Controller, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
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

    @Post('/addToTeamRequest')
    async addToTeamRequest(@Body() body) {
        return this.usersService.addToTeamRequest(body.userId, body.teamId);
    }
}
