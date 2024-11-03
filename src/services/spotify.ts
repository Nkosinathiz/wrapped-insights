import SpotifyWebApi from 'spotify-web-api-js';
import { TrackData, SpotifyError } from '../types/spotify';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'https://wrapped-insights.vercel.app/';
const SCOPES = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
  'user-read-currently-playing'
].join(' ');

class SpotifyService {
  private api: SpotifyWebApi.SpotifyWebApiJs;
  private static instance: SpotifyService;

  private constructor() {
    this.api = new SpotifyWebApi();
  }

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: 'true' // Force show the auth dialog to handle expired tokens
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  setAccessToken(token: string): void {
    this.api.setAccessToken(token);
    localStorage.setItem('spotify_token', token);
    // Store token expiration time (1 hour from now)
    localStorage.setItem('spotify_token_expiry', String(Date.now() + 3600000));
  }

  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem('spotify_token_expiry');
    return !expiryTime || Date.now() > parseInt(expiryTime);
  }

  async getTopTracks(timeRange: string): Promise<TrackData[]> {
    try {
      if (this.isTokenExpired()) {
        throw new Error('Token expired');
      }

      const range = this.convertTimeRange(timeRange);
      const response = await this.api.getMyTopTracks({ limit: 20, time_range: range });
      
      return response.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumCover: track.album.images[0]?.url || '',
        playCount: 0,
        duration: Math.floor(track.duration_ms / 1000),
        lastPlayed: new Date().toISOString(),
      }));
    } catch (error) {
      const spotifyError = error as SpotifyError;
      if (spotifyError.error?.status === 401) {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_expiry');
        throw new Error('Please login again');
      }
      throw error;
    }
  }

  async getRecentlyPlayed(): Promise<TrackData[]> {
    try {
      if (this.isTokenExpired()) {
        throw new Error('Token expired');
      }

      const response = await this.api.getMyRecentlyPlayedTracks({ limit: 50 });
      

      return response.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        albumCover: item.track.album.images[0]?.url || '',
        playCount: 1,
        duration: Math.floor(item.track.duration_ms / 1000),
        lastPlayed: item.played_at,
      }));
    } catch (error) {
      const spotifyError = error as SpotifyError;
      if (spotifyError.error?.status === 401) {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_token_expiry');
        throw new Error('Please login again');
      }
      throw error;
    }
  }

  private convertTimeRange(range: string): string {
    switch (range) {
      case '4weeks':
        return 'short_term';
      case '6months':
        return 'medium_term';
      case 'lifetime':
        return 'long_term';
      default:
        return 'medium_term';
    }
  }
}

export default SpotifyService.getInstance();