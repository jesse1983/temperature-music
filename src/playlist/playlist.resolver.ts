import { Args, Query, Resolver } from '@nestjs/graphql';
import { PlaylistService } from './playlist.service';
import { PlaylistResult } from './models/playlist-result.model';

@Resolver(() => PlaylistResult)
export class PlaylistResolver {
  constructor(private readonly playlistService: PlaylistService) {}

  @Query(() => PlaylistResult, { description: 'Get playlists' })
  async getPlaylists(@Args('city', { description: 'Search by playlist name' }) city: string) {
    return this.playlistService.searchByName(city);
  }
}
