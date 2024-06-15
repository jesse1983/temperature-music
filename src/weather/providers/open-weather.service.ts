import { HttpService } from '@nestjs/axios';
import { CacheKey } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Weather } from '../models/weather.model';
import { Geolocation } from '../models/geolocation.model';
import { IWeatherService } from '../interfaces/i-weather.service';

export class OpenWeatherService implements IWeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @CacheKey('getCityWeatherByName')
  public async getCityWeatherByName(city: string) {
    const geo = await this.getGeolocationByCity(city);
    const weather = await this.getWeatherByCoordinates(geo.lat, geo.lon);
    return weather;
  }

  @CacheKey('getGeolocationByCity')
  private async getGeolocationByCity(city: string): Promise<Geolocation> {
    const response = await this.httpService.axiosRef.get(this.configService.get('OPEN_WEATHER_GEO_URL'), {
      params: {
        q: city,
        limit: 1,
        appid: this.configService.get<string>('OPEN_WEATHER_API_KEY'),
      },
    });
    return response.data?.[0] as Geolocation;
  }

  @CacheKey('getWeatherByCoordinates')
  private async getWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    const response = await this.httpService.axiosRef.get(this.configService.get('OPEN_WEATHER_WEATHER_URL'), {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: this.configService.get<string>('OPEN_WEATHER_API_KEY'),
      },
    });
    return response?.data as Weather;
  }
}
