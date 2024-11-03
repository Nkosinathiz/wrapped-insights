export interface TrackData {
    id: string;
    name: string;
    artist: string;
    album: string;
    albumCover: string;
    playCount: number;
    duration: number;
    lastPlayed: string;
  }
  
  export interface TimeRange {
    value: '4weeks' | '6months' | 'lifetime';
    label: string;
  }