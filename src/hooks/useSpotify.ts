import { useState, useEffect } from 'react';
import spotifyService from '../services/spotify';
import { TrackData } from '../types/spotify';

export function useSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage first
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken && !spotifyService.isTokenExpired()) {
      spotifyService.setAccessToken(storedToken);
      setIsAuthenticated(true);
    }

    // Then check URL hash for new token
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
    // Clear any existing tokens before login
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
    setIsAuthenticated(false);
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tracks';
      setError(errorMessage);
      
      if (errorMessage === 'Please login again') {
        setIsAuthenticated(false);
        login();
      }
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