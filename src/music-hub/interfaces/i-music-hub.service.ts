import { PlaylistResult } from 'src/playlist/models/playlist-result.model';

export interface IMusicHubService {
    getToken(): Promise<string>;
    getPlaylistByName(name: string): Promise<PlaylistResult>;
    handlePlaylist(body: unknown): PlaylistResult;
}
