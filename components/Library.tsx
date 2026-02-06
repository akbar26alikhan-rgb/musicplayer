
import React from 'react';
import { Song } from '../types';

interface LibraryProps {
  songs: Song[];
  onSongSelect: (index: number) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentSongId: string;
}

const Library: React.FC<LibraryProps> = ({ songs, onSongSelect, onFileUpload, currentSongId }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <label className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-full cursor-pointer flex items-center space-x-2 transition-colors">
          <i className="fa-solid fa-plus"></i>
          <span className="text-sm font-medium">Add Music</span>
          <input type="file" multiple accept="audio/*" className="hidden" onChange={onFileUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {songs.map((song, index) => (
          <div 
            key={song.id}
            onClick={() => onSongSelect(index)}
            className={`group flex items-center p-3 rounded-2xl transition-all cursor-pointer ${
              song.id === currentSongId ? 'bg-sky-500/20 border-sky-500/50 border' : 'bg-slate-800/50 hover:bg-slate-800'
            }`}
          >
            <div className="relative h-14 w-14 flex-shrink-0">
              <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover rounded-lg shadow-lg" />
              {song.id === currentSongId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  <div className="flex space-x-0.5 items-end h-4">
                    <div className="w-1 bg-white animate-[bounce_1s_infinite]"></div>
                    <div className="w-1 bg-white animate-[bounce_0.7s_infinite]"></div>
                    <div className="w-1 bg-white animate-[bounce_1.3s_infinite]"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
              <h3 className={`font-semibold truncate ${song.id === currentSongId ? 'text-sky-400' : 'text-slate-100'}`}>
                {song.title}
              </h3>
              <p className="text-slate-400 text-xs truncate">{song.artist} • {song.album}</p>
            </div>
            <div className="text-slate-500 text-xs pr-2">
              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
