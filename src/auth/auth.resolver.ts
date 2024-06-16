import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignIn } from './model/signin.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => SignIn, { description: 'SignIn' })
    async signIn(
        @Args({ name: 'username', description: 'Username' }) username: string,
        @Args({ name: 'password', description: 'Password' }) password: string,
    ) {
        return this.authService.signIn(username, password);
    }
}
