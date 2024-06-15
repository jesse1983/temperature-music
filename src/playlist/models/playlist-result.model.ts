import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Playlist } from './playlist.model';

@ObjectType()
export class PlaylistResult {
  @Field(() => Int, { description: 'Play list total count' })
  count: number;

  @Field({ description: 'City name' })
  city: string;

  @Field({ description: 'City state', nullable: true })
  state?: string;

  @Field({ description: 'Genre', nullable: true })
  genre?: string;

  @Field(() => Float, { description: 'Temperature' })
  temp: number;

  @Field(() => [Playlist])
  data: Playlist[];
}
