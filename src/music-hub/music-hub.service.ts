import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { MusicHubSpotifyService } from './providers/music-hub-spotify.service';
import { IMusicHubService } from './interfaces/i-music-hub.service';

export enum MusicHubProvider {
    SPOTIFY = 'SPOTIFY',
}

@Injectable()
export class MusicHubService {
  serviceProviders:Map<string, IMusicHubService> = new Map();

  constructor(
        @Inject(CACHE_MANAGER) cacheManager: Cache,
        httpService: HttpService,
        private readonly configService: ConfigService,

  ) {
    this.serviceProviders.set(MusicHubProvider.SPOTIFY, new MusicHubSpotifyService(cacheManager, httpService, configService));
  }

  build(): IMusicHubService {
    return this.serviceProviders.get(this.configService.get<string>('DEFAULT_MUSIC_HUB_PROVIDER'));
  }
}
