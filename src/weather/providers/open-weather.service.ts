import { HttpService } from '@nestjs/axios';
import { CacheKey } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { WeatherDTO } from '../models/weather.model';
import { GeolocationDTO } from '../models/geolocation.model';
import { IWeatherService } from '../interfaces/i-weather.service';

export class OpenWeatherService implements IWeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @CacheKey('getCityWeatherByName')
  public async getCityWeatherByName(city: string) {
    const geo = await this.getGeolocationByCity(city);
    const weather = await this.getWeatherByCoordinates(geo);
    return { city: geo.name, state: geo.state, ...weather };
  }

  @CacheKey('getGeolocationByCity')
  private async getGeolocationByCity(city: string): Promise<GeolocationDTO> {
    const response = await this.httpService.axiosRef.get(this.configService.get('OPEN_WEATHER_GEO_URL'), {
      params: {
        q: city,
        limit: 1,
        appid: this.configService.get<string>('OPEN_WEATHER_API_KEY'),
      },
    });
    return response.data?.[0] as GeolocationDTO;
  }

  @CacheKey('getWeatherByCoordinates')
  private async getWeatherByCoordinates(geo: GeolocationDTO): Promise<WeatherDTO> {
    const response = await this.httpService.axiosRef.get(this.configService.get('OPEN_WEATHER_WEATHER_URL'), {
      params: {
        lat: geo.lat,
        lon: geo.lon,
        units: 'metric',
        appid: this.configService.get<string>('OPEN_WEATHER_API_KEY'),
      },
    });
    return response?.data as WeatherDTO;
  }
}
