import {Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AdminService} from "./admin.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/auth')
    auth(@Req() req) {
        const decodedJwt: any = this.jwtService.decode(req.headers.authorization.split(' ')[1]);

        if(decodedJwt.username !== req.body.login) {
            throw new UnauthorizedException();
        }

        return true;
    }

    @Post('/login')
    loginAdmin(@Body() body) {
        const  { login, password } = body;
        return this.adminService.loginAdmin(login, password);
    }

    @Get('/getAllTransactions')
    getAllTransactions() {
        return this.adminService.getAllTransactions();
    }
}
