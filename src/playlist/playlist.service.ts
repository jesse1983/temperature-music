import { Injectable } from '@nestjs/common';
import { IMusicHubService, MusicHubService } from '../music-hub';
import { WeatherService, IWeatherService } from '../weather';

const TEMPERATURE_RANGE = [
  { min: -Infinity, max: 10, genre: 'Classical' },
  { min: 10, max: 25, genre: 'Rock' },
  { min: 25, max: Infinity, genre: 'Pop' },
];
  
@Injectable()
export class PlaylistService {
  private readonly musicHubService: IMusicHubService;
  private readonly weatherService: IWeatherService;

  constructor(musicHubService: MusicHubService, weatherService: WeatherService) {
    this.musicHubService = musicHubService.build();
    this.weatherService = weatherService.build();
  }

  async searchByName(cityName: string, limit?: number, offset?: number) {
    const { genre, city, state, temp } = await this.getGenreByTemp(cityName);
    const playlist = await this.musicHubService.getPlaylistByName(genre, limit, offset);
    return { ...playlist, city, state, temp, genre };
  }

  private async getGenreByTemp(cityName: string) {
    const { main, city, state } = await this.weatherService.getCityWeatherByName(cityName);
    const { temp } = main;
    const { genre } = TEMPERATURE_RANGE.find((row) => temp > row.min && temp <= row.max);
    return { city, state, genre, temp }
  }
}
