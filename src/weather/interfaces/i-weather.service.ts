import { WeatherDTO } from '../models/weather.model';

export interface IWeatherService {
    getCityWeatherByName(city: string): Promise<WeatherDTO>;
}
