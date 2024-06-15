import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MusicHubService } from './music-hub.service';

@Module({
  imports: [HttpModule],
  providers: [MusicHubService],
  exports: [MusicHubService],
})
export class MusicHubModule {}
