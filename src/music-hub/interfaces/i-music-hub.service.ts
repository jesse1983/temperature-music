import { Playlist } from 'src/playlist/models/playlist.model';
import { MusicHubDTO } from '../models/music-hub.model';

export interface IMusicHubService {
    getToken(): Promise<string>;
    getPlaylistByName(name: string, limit?: number, offset?: number): Promise<MusicHubDTO<Playlist>>;
}
