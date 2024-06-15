import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from 'cache-manager';
import { PlaylistResult } from 'src/playlist/models/playlist-result.model';
import { Playlist } from 'src/playlist/models/playlist.model';
import { ConfigService } from '@nestjs/config';
import { IMusicHubService } from '../interfaces/i-music-hub.service';

@Injectable()
export class MusicHubSpotifyService implements IMusicHubService {
  tokenKey = 'SPOTIFY_TOKEN';

  constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
  ) {}

  public handlePlaylist(body): PlaylistResult {
    return {
      count: body.playlists.total,
      data: body.playlists.items.map((e) => ({ ...e, tracks: e.tracks.href } as Playlist)),
    };
  }

  public async getToken(): Promise<string> {
    const cachedToken: string = await this.cacheManager.get(this.tokenKey);
    if (cachedToken) return cachedToken;

    const result = await this.httpService.axiosRef.post(
      this.configService.get<string>('SPOTIFY_ACCOUNTS_BASE_URL'),
      { grant_type: 'client_credentials' },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: this.getAuthorizationHeaders(),
        },
      },
    );
    const { access_token, expires_in } = result.data;
    await this.cacheManager.set(this.tokenKey, access_token, expires_in * 1000);

    return access_token;
  }

  public async getPlaylistByName(q: string): Promise<PlaylistResult> {
    const token = await this.getToken();
    const type = 'playlist';

    const result = await this.httpService.axiosRef.get(
      this.configService.get<string>('SPOTIFY_BASE_URL'),
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { q, type },
      },
    );

    return this.handlePlaylist(result.data);
  }

  private getAuthorizationHeaders(): string {
    const clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
    return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  }
}
