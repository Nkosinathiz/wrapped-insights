import React, { useState, useEffect } from 'react';
import { Clock, Music, Headphones, BarChart3 } from 'lucide-react';
import Header from './components/Header';
import TimeRangeSelector from './components/TimeRangeSelector';
import TrackList from './components/TrackList';
import StatsCard from './components/StatsCard';
import LoginButton from './components/LoginButton';
import { TimeRange } from './types/spotify';
import { useSpotify } from './hooks/useSpotify';

function App() {
  const [timeRange, setTimeRange] = useState<TimeRange['value']>('4weeks');
  const { isAuthenticated, tracks, loading, error, login, fetchTracks } = useSpotify();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTracks(timeRange);
    }
  }, [isAuthenticated, timeRange]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Spotify Insights</h1>
        <p className="text-gray-600">Connect your Spotify account to see your listening history</p>
        <LoginButton onClick={login} />
      </div>
    );
  }

  const totalListeningTime = tracks.reduce((acc, track) => acc + track.duration, 0);
  const hours = Math.floor(totalListeningTime / 3600);
  const minutes = Math.floor((totalListeningTime % 3600) / 60);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Listening History</h2>
            <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Listening Time"
              value={`${hours}h ${minutes}m`}
              icon={Clock}
            />
            <StatsCard
              title="Unique Tracks"
              value={tracks.length}
              icon={Music}
            />
            <StatsCard
              title="Listening Sessions"
              value={tracks.reduce((acc, track) => acc + track.playCount, 0)}
              icon={Headphones}
            />
            <StatsCard
              title="Most Played Artist"
              value={tracks[0]?.artist || 'N/A'}
              icon={BarChart3}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Tracks</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <TrackList tracks={tracks} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;