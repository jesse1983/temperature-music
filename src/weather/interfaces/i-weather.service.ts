import { Weather } from '../models/weather.model';

export interface IWeatherService {
    getCityWeatherByName(city: string): Promise<Weather>;
}
