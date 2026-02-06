
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Corrected: INITIAL_EQ is exported from constants, not types.
import { Song, ViewType, AudioSettings } from './types';
import { MOCK_SONGS, INITIAL_EQ } from './constants';
import { audioService } from './services/audioService';
import Library from './components/Library';
import Player from './components/Player';
import Settings from './components/Settings';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('library');
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<AudioSettings>({
    equalizer: [...INITIAL_EQ],
    bassBoost: 0,
    playbackSpeed: 1.0,
    volume: 0.8,
    isLooping: false,
    isShuffle: false
  });

  const currentSong = songs[currentSongIndex];

  // Initialize audio service once
  useEffect(() => {
    audioService.init();
    const audio = audioService.getAudio();
    if (audio) {
      audio.onended = () => handleNext();
      const updateProgress = () => setProgress(audio.currentTime);
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!isPlaying) {
      if (!audioService.getAudio()?.src) {
        audioService.setSrc(currentSong.url);
      }
      audioService.play();
    } else {
      audioService.pause();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentSong.url]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    audioService.setSrc(songs[nextIndex].url);
    if (isPlaying) audioService.play();
  }, [currentSongIndex, songs, isPlaying]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    audioService.setSrc(songs[prevIndex].url);
    if (isPlaying) audioService.play();
  }, [currentSongIndex, songs, isPlaying]);

  const onSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    audioService.setSrc(songs[index].url);
    setIsPlaying(true);
    audioService.play();
    setCurrentView('player');
  };

  const updateSetting = (newSettings: Partial<AudioSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    if (newSettings.volume !== undefined) audioService.setVolume(newSettings.volume);
    if (newSettings.playbackSpeed !== undefined) audioService.setSpeed(newSettings.playbackSpeed);
    if (newSettings.bassBoost !== undefined) audioService.setBass(newSettings.bassBoost);
    if (newSettings.equalizer !== undefined) {
      newSettings.equalizer.forEach((val, i) => audioService.setEQ(i, val));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fixed: Explicitly typed the map parameter as File to resolve 'unknown' type property access errors.
    const newSongs: Song[] = Array.from(files).map((file: File, i) => ({
      id: `local-${Date.now()}-${i}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Local Artist',
      album: 'Internal Storage',
      duration: 0, // In a real app, we'd extract metadata
      coverUrl: `https://picsum.photos/seed/${file.name}/400/400`,
      url: URL.createObjectURL(file),
      genre: 'Unknown'
    }));

    setSongs([...newSongs, ...songs]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden relative">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundImage: `url(${currentSong.coverUrl})`, backgroundSize: 'cover' }}
      ></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 p-4 pb-32">
        {currentView === 'library' && (
          <Library 
            songs={songs} 
            onSongSelect={onSongSelect} 
            onFileUpload={handleFileUpload}
            currentSongId={currentSong.id}
          />
        )}
        {currentView === 'player' && (
          <Player 
            song={currentSong} 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            progress={progress}
            onSeek={(t) => audioService.setCurrentTime(t)}
          />
        )}
        {currentView === 'settings' && (
          <Settings 
            settings={settings}
            onUpdate={updateSetting}
          />
        )}
        {currentView === 'ai' && (
          <AIInsights currentSong={currentSong} />
        )}
      </main>

      {/* Mini Player / Navigation Area */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-md border-t border-slate-700 z-50 flex flex-col">
        {currentView !== 'player' && isPlaying && (
          <div className="h-1 bg-slate-700 w-full overflow-hidden">
             <div 
               className="h-full bg-sky-500 transition-all duration-300" 
               style={{ width: `${(progress / (currentSong.duration || 1)) * 100}%` }}
             ></div>
          </div>
        )}
        
        {/* Bottom Navigation */}
        <div className="flex justify-around items-center h-16 px-2">
          <NavItem 
            icon="fa-music" 
            label="Library" 
            active={currentView === 'library'} 
            onClick={() => setCurrentView('library')} 
          />
          <NavItem 
            icon="fa-play-circle" 
            label="Playing" 
            active={currentView === 'player'} 
            onClick={() => setCurrentView('player')} 
          />
          <NavItem 
            icon="fa-brain" 
            label="AI" 
            active={currentView === 'ai'} 
            onClick={() => setCurrentView('ai')} 
          />
          <NavItem 
            icon="fa-sliders" 
            label="Settings" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')} 
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-sky-400' : 'text-slate-400'}`}
  >
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
