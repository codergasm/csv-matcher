import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersEntity} from "../entities/users.entity";
import {Repository} from "typeorm";
import createPasswordHash from "../common/createPasswordHash";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (req, username, password): Promise<boolean> => {
        const hash = createPasswordHash(password);

        const user = await this.usersRepository.findOneBy({
            email: username,
            password: hash
        });

        if(user) {
            return true;
        }
        throw new UnauthorizedException();
    }
}
