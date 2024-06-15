import { Injectable } from '@nestjs/common';
import { IMusicHubService, MusicHubService } from '../music-hub';
import { WeatherService, IWeatherService } from '../weather';
import { PlaylistResult } from './models/playlist-result.model';

const TEMPERATURE_RANGE = [
  { min: -1000, max: 10, genre: 'Classical' },
  { min: 10, max: 25, genre: 'Rock' },
  { min: 25, max: 1000, genre: 'Pop' },
];

@Injectable()
export class PlaylistService {
  private readonly musicHubService: IMusicHubService;

  private readonly weatherService: IWeatherService;

  constructor(musicHubService: MusicHubService, weatherService: WeatherService) {
    this.musicHubService = musicHubService.build();
    this.weatherService = weatherService.build();
  }

  async searchByName(city: string): Promise<PlaylistResult> {
    const { genre } = await this.getGenreByTemp(city);
    const playlist = await this.musicHubService.getPlaylistByName(genre);
    return playlist;
  }

  private async getGenreByTemp(city: string) {
    const { main } = await this.weatherService.getCityWeatherByName(city);
    return TEMPERATURE_RANGE.find((row) => main.temp > row.min && main.temp <= row.max);
  }
}
