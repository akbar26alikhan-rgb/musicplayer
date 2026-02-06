
import React, { useEffect, useRef } from 'react';
import { Song } from '../types';
import { audioService } from '../services/audioService';

interface PlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
  onSeek: (time: number) => void;
}

const Player: React.FC<PlayerProps> = ({ song, isPlaying, onPlayPause, onNext, onPrev, progress, onSeek }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioService.getAnalyser();
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 255)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-between h-[calc(100vh-12rem)] max-w-md mx-auto py-8">
      {/* Album Art Section */}
      <div className="relative w-full aspect-square max-w-[320px] group">
        <div className={`absolute -inset-4 bg-sky-500/20 blur-2xl rounded-full transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}></div>
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className={`w-full h-full object-cover rounded-3xl shadow-2xl z-10 relative transition-transform duration-500 ${isPlaying ? 'scale-100' : 'scale-95'}`}
        />
        <canvas ref={canvasRef} className="absolute bottom-4 left-0 right-0 w-full h-12 opacity-50 z-20 pointer-events-none" width={320} height={48} />
      </div>

      {/* Info Section */}
      <div className="text-center w-full px-4 mt-8">
        <h2 className="text-2xl font-bold truncate text-slate-100">{song.title}</h2>
        <p className="text-sky-400 font-medium">{song.artist}</p>
      </div>

      {/* Controls Section */}
      <div className="w-full space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <input 
            type="range"
            min="0"
            max={song.duration || 100}
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(song.duration || 0)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-around">
          <button className="text-slate-400 hover:text-white transition-colors" title="Shuffle">
            <i className="fa-solid fa-shuffle text-lg"></i>
          </button>
          
          <div className="flex items-center space-x-8">
            <button onClick={onPrev} className="text-slate-100 text-3xl hover:scale-110 transition-transform">
              <i className="fa-solid fa-backward-step"></i>
            </button>
            <button 
              onClick={onPlayPause}
              className="bg-sky-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
            </button>
            <button onClick={onNext} className="text-slate-100 text-3xl hover:scale-110 transition-transform">
              <i className="fa-solid fa-forward-step"></i>
            </button>
          </div>

          <button className="text-slate-400 hover:text-white transition-colors" title="Loop">
            <i className="fa-solid fa-repeat text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
