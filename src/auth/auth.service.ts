import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async signIn(username: string, password: string) {
        if (username === 'demo' && password === 'demo') {
            return {
                access_token: await this.jwtService.signAsync({ sub: username, username }),
            };
        }
        throw new UnauthorizedException();
    }
}
