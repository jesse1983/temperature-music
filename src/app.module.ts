import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { WeatherModule } from './weather/weather.module';
import { MusicHubModule } from './music-hub';
import { PlaylistModule } from './playlist';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';


const getCacheParams = () => {
  if (process.env.REDIS_CACHE_HOST) {
    return {
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_CACHE_HOST,
      port: process.env.REDIS_CACHE_PORT,
    }
  }
  return { isGlobal: true };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register<RedisClientOptions>(getCacheParams()),    
    PlaylistModule,
    MusicHubModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    WeatherModule],
})
export class AppModule {}
