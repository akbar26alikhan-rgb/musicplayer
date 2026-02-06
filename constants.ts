
import { Song } from './types';

export const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Dreams',
    album: 'Retro Future',
    duration: 185,
    coverUrl: 'https://picsum.photos/seed/music1/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Synthwave'
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Lofi Girl',
    album: 'Study Session',
    duration: 210,
    coverUrl: 'https://picsum.photos/seed/music2/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Lofi'
  },
  {
    id: '3',
    title: 'Urban Jungle',
    artist: 'Metro Beats',
    album: 'City Lights',
    duration: 145,
    coverUrl: 'https://picsum.photos/seed/music3/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Electronic'
  },
  {
    id: '4',
    title: 'Ocean Breeze',
    artist: 'Nature Chill',
    album: 'Horizon',
    duration: 240,
    coverUrl: 'https://picsum.photos/seed/music4/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Ambient'
  }
];

export const INITIAL_EQ = [0, 0, 0, 0, 0];
