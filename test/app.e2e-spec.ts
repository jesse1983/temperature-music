import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpService } from '@nestjs/axios';
const gql = '/graphql';

describe('GraphQL AppResolver', () => {
  let app: INestApplication;
  const mockedPlaylists = {
    playlists: {
      href: 'https://api.spotify.com/v1/search?query=Rock&type=playlist&offset=0&limit=20',
      items: [
        {
          collaborative: false,
          description: '<a href=spotify:playlist:37i9dQZF1EIYWwGqC3GC7o>Linkin Park</a>, <a href=spotify:playlist:37i9dQZF1EIVJW7PzIkjtQ>Creedence Clearwater Revival</a>, <a href=spotify:playlist:37i9dQZF1EIWwyR3K8WKlr>The Police</a> and more',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/37i9dQZF1EQpj7X7UK8OOF'
          },
          href: 'https://api.spotify.com/v1/playlists/37i9dQZF1EQpj7X7UK8OOF',
          id: '37i9dQZF1EQpj7X7UK8OOF',
          images: [
            {
              height: null,
              url: 'https://seed-mix-image.spotifycdn.com/v6/img/rock/6XyY86QOPPrYVGvF9ch6wz/pt/large',
              width: null
            }
          ],
          name: 'Rock Mix',
          owner: {
            display_name: 'Spotify',
            external_urls: { spotify: 'https://open.spotify.com/user/spotify' },
            href: 'https://api.spotify.com/v1/users/spotify',
            id: 'spotify',
            type: 'user',
            uri: 'spotify:user:spotify'
          },
          primary_color: null,
          public: null,
          snapshot_id: 'MCwwMDAwMDAwMDNmYjdjODg1NGQ0MzIzMzRkNTQ2MzY4N2M2MDQ0NDE3',
          tracks: {
            href: 'https://api.spotify.com/v1/playlists/37i9dQZF1EQpj7X7UK8OOF/tracks',
            total: 50
          },
          type: 'playlist',
          uri: 'spotify:playlist:37i9dQZF1EQpj7X7UK8OOF'
        }
      ],
      limit: 20,
      next: 'https://api.spotify.com/v1/search?query=Rock&type=playlist&offset=20&limit=20',
      offset: 0,
      previous: null,
      total: 1
    }
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        axiosRef: {
          get: jest.fn().mockImplementation((url) => {
            if (url.includes(process.env.OPEN_WEATHER_GEO_URL)) {
              return {
                data: [
                  {
                    name: 'Rio de Janeiro',
                    local_names: [],
                    lat: -31.4173391,
                    lon: -64.183319,
                    country: 'AR',
                    state: 'Rio de Janeiro'
                  }
                ]
              }
            }

            if (url.includes(process.env.OPEN_WEATHER_WEATHER_URL)) {
              return { 
                data: {
                  coord: { lon: -64.1833, lat: -31.4173 },
                  weather: [ [] ],
                  base: 'stations',
                  main: {
                    temp: 22.09,
                    feels_like: 21.27,
                    temp_min: 21.31,
                    temp_max: 22.32,
                    pressure: 969,
                    humidity: 35
                  },
                  visibility: 10000,
                  wind: { speed: 6.71, deg: 0, gust: 9.39 },
                  clouds: { all: 12 },
                  dt: 1718381216,
                  sys: {
                    type: 2,
                    id: 2074146,
                    country: 'BR',
                    sunrise: 1718363627,
                    sunset: 1718400034
                  },
                  timezone: -10800,
                  id: 3860259,
                  name: 'Rio de Janeiro',
                  cod: 200
                }
              }
            }

            if(url.includes(process.env.SPOTIFY_BASE_URL)) {
              return {
                data: mockedPlaylists,
               };
            }
            return { data: [], };
          }),
          post: jest.fn().mockImplementation((url) => {
            if (url.includes(process.env.SPOTIFY_ACCOUNTS_BASE_URL)) {
              return { data: { access_token: 'XPTO', expires_in: 20000 } };
            }
          }),
        }
      })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(gql, () => {
    describe('getPlaylists', () => {
      let accessToken = '';
      beforeEach(async () => {
        await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation LOGIN {
              signIn(username: "demo", password: "demo") {
                access_token
              }
            }
        `,
        }).expect((res) => {
          accessToken = res.body.data.signIn.access_token;
        });
      });

      it('should show playlists', () => {
        return request(app.getHttpServer())
          .post(gql)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            query: `
              query GETPLAYLIST {
                getPlaylists(city: "Rio de Janeiro") {
                  count
                  data {
                    id
                    name
                    href
                    description
                    tracks
                  }
                }
              }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getPlaylists.count).toBe(1);
            expect(res.body.data.getPlaylists.data).toHaveLength(1);
          });
      });

      it('should show playlists cached', async () => {
        const query = `
                query GETPLAYLIST {
                  getPlaylists(city: "Rio de Janeiro") {
                    count
                    data {
                      id
                      name
                      href
                      description
                      tracks
                    }
                  }
                }
            `;
        const server = request(app.getHttpServer());
        await server.post(gql).set({ Authorization: `Bearer ${accessToken}` }).send({ query });    
        await server.post(gql).set({ Authorization: `Bearer ${accessToken}` }).send({ query }).expect(200);
      });
    });

    describe('signIn', () => {
      it('should return 403 when try sign in with wrong user and password', () => {
        return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation LOGIN {
              signIn(username: "wrong", password: "wrong") {
                access_token
              }
            }
        `,
        })
        .expect((res) => {
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
          expect(res.body.errors[0].extensions.originalError.message).toBe('Unauthorized');
          expect(res.body.errors[0].extensions.originalError.statusCode).toBe(401);
        });
      });

      it('should return 403 when protected request without token', () => {
        return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query GETPLAYLIST {
              getPlaylists(city: "Rio de Janeiro") {
                count
                data {
                  id
                  name
                  href
                  description
                  tracks
                }
              }
            }
        `,
        })
        .expect((res) => {
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
          expect(res.body.errors[0].extensions.originalError.message).toBe('Unauthorized');
          expect(res.body.errors[0].extensions.originalError.statusCode).toBe(401);
        });
      });

      it('should return 403 when protected request with invalid token', () => {
        return request(app.getHttpServer())
        .post(gql)
        .set({ Authorization: `Bearer INVALID_JWT_TOKEN` })
        .send({
          query: `
            query GETPLAYLIST {
              getPlaylists(city: "Rio de Janeiro") {
                count
                data {
                  id
                  name
                  href
                  description
                  tracks
                }
              }
            }
        `,
        })
        .expect((res) => {
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED');
          expect(res.body.errors[0].extensions.originalError.message).toBe('Unauthorized');
          expect(res.body.errors[0].extensions.originalError.statusCode).toBe(401);
        });
      });
    })
  });

  afterAll(async () => {
    await app.close();
  });
});