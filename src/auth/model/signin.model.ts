import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignIn {
  @Field({ description: 'Token authentication' })
  access_token: string;
}
