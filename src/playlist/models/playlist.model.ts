import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Playlist {
  @Field({ description: 'A playlist ID' })
    id: string;

  @Field({ description: 'Name' })
    name: string;

  @Field({ description: 'Description' })
    description: string;

  @Field({ description: 'URL' })
    href: string;

  @Field({ description: 'Tracks' })
    tracks: string;
}
