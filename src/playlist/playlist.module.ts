import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { WeatherModule } from '../weather';
import { MusicHubModule } from '../music-hub';

@Module({
  providers: [PlaylistResolver, PlaylistService],
  imports: [MusicHubModule, WeatherModule],
})
export class PlaylistModule {}
