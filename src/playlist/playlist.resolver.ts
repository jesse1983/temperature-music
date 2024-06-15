import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PlaylistService } from './playlist.service';
import { PlaylistResult } from './models/playlist-result.model';

@Resolver(() => PlaylistResult)
export class PlaylistResolver {
  constructor(private readonly playlistService: PlaylistService) {}

  @Query(() => PlaylistResult, { description: 'Get playlists' })
  async getPlaylists(
    @Args('city', { description: 'Search by playlist name' }) city: string,
    @Args('limit', { type: () => Int, description: 'Limit rows per request', nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, description: 'Offset rows per request', nullable: true }) offset?: number,
  ){
    return this.playlistService.searchByName(city, limit, offset);
  }
}
