import React from 'react';
import { Music2, Clock, BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music2 className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Spotify Insights</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="h-5 w-5" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}