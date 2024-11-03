import { useState, useEffect } from 'react';
import spotifyService from '../services/spotify';
import { TrackData } from '../types/spotify';

export function useSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      spotifyService.setAccessToken(token);
      setIsAuthenticated(true);
      window.history.pushState({}, '', window.location.pathname);
    }
  }, []);

  const login = () => {
    window.location.href = spotifyService.getAuthUrl();
  };

  const fetchTracks = async (timeRange: string) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await spotifyService.getTopTracks(timeRange);
      setTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    tracks,
    loading,
    error,
    login,
    fetchTracks,
  };
}