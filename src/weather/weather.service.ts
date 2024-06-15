import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IWeatherService } from './interfaces/i-weather.service';
import { OpenWeatherService } from './providers/open-weather.service';

export enum WeatherProvider {
    OPENWEATHER = 'OPENWEATHER',
}

@Injectable()
export class WeatherService {
  serviceProviders:Map<string, IWeatherService> = new Map();

  constructor(httpService: HttpService, private readonly configService: ConfigService) {
    this.serviceProviders
      .set(WeatherProvider.OPENWEATHER, new OpenWeatherService(httpService, configService));
  }

  build(): IWeatherService {
    return this.serviceProviders.get(this.configService.get<WeatherProvider>('DEFAULT_WEATHER_PROVIDER'));
  }
}
