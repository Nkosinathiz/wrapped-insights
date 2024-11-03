import React from 'react';
import { Play, Clock } from 'lucide-react';
import { TrackData } from '../types/spotify';

interface Props {
  tracks: TrackData[];
}

export default function TrackList({ tracks }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="p-4 hover:bg-gray-50 transition-colors flex items-center space-x-4"
          >
            <span className="text-lg font-medium text-gray-400 w-8">{index + 1}</span>
            <img
              src={track.albumCover}
              alt={track.album}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{track.name}</h3>
              <p className="text-sm text-gray-500">{track.artist}</p>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1">
                <Play className="h-4 w-4" />
                <span className="text-sm">{track.playCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}