import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from './playlist.model';

@ObjectType()
export class PlaylistResult {
  @Field(() => Int)
    count: number;

  @Field(() => [Playlist])
    data: Playlist[];
}
