
import React from 'react';
import { AudioSettings, EQ_BANDS } from '../types';

interface SettingsProps {
  settings: AudioSettings;
  onUpdate: (settings: Partial<AudioSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const handleEqChange = (index: number, value: number) => {
    const newEq = [...settings.equalizer];
    newEq[index] = value;
    onUpdate({ equalizer: newEq });
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-bold">Audio Settings</h1>

      {/* 10-Band Style Equalizer (using our 5 bands for simplicity but mimicking high-end feel) */}
      <section className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fa-solid fa-wave-square text-sky-400"></i>
            Equalizer
          </h2>
          <button 
            onClick={() => onUpdate({ equalizer: [0,0,0,0,0] })}
            className="text-xs text-sky-400 font-bold uppercase tracking-wider"
          >
            Reset
          </button>
        </div>
        <div className="flex justify-around items-end h-40 pt-4">
          {EQ_BANDS.map((freq, i) => (
            <div key={freq} className="flex flex-col items-center h-full space-y-4">
              <div className="relative h-full flex-1 w-2">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={settings.equalizer[i]}
                  onChange={(e) => handleEqChange(i, parseFloat(e.target.value))}
                  style={{
                    appearance: 'none',
                    width: '80px',
                    height: '2px',
                    background: '#334155',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    zIndex: 1
                  }}
                  className="accent-sky-500"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {freq >= 1000 ? `${freq/1000}k` : freq}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bass Boost */}
      <section className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fa-solid fa-drum text-sky-400"></i>
            Bass Boost
          </h2>
          <span className="text-sm font-mono text-sky-400">{settings.bassBoost}dB</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="20" 
          value={settings.bassBoost} 
          onChange={(e) => onUpdate({ bassBoost: parseInt(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
      </section>

      {/* Playback Speed */}
      <section className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className="fa-solid fa-gauge-high text-sky-400"></i>
            Playback Speed
          </h2>
          <span className="text-sm font-mono text-sky-400">{settings.playbackSpeed}x</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => onUpdate({ playbackSpeed: 0.5 })} className="px-3 py-1 bg-slate-700 rounded text-xs">0.5x</button>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1"
            value={settings.playbackSpeed} 
            onChange={(e) => onUpdate({ playbackSpeed: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <button onClick={() => onUpdate({ playbackSpeed: 1.0 })} className="px-3 py-1 bg-slate-700 rounded text-xs">Normal</button>
        </div>
      </section>

      {/* Volume Control */}
      <section className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i className={`fa-solid ${settings.volume === 0 ? 'fa-volume-mute' : 'fa-volume-high'} text-sky-400`}></i>
            Master Volume
          </h2>
          <span className="text-sm font-mono text-sky-400">{Math.round(settings.volume * 100)}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={settings.volume} 
          onChange={(e) => onUpdate({ volume: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
      </section>
    </div>
  );
};

export default Settings;
