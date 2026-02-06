
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  url: string;
  genre?: string;
}

export type ViewType = 'library' | 'player' | 'settings' | 'ai';

export interface AudioSettings {
  equalizer: number[];
  bassBoost: number;
  playbackSpeed: number;
  volume: number;
  isLooping: boolean;
  isShuffle: boolean;
}

export const EQ_BANDS = [60, 230, 910, 3600, 14000];

export interface AISuggestion {
  reason: string;
  mood: string;
  suggestedGenre: string;
}
