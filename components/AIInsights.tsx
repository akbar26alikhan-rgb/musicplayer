
import React, { useState, useEffect } from 'react';
import { Song, AISuggestion } from '../types';
import { getMusicInsights } from '../services/geminiService';

interface AIInsightsProps {
  currentSong: Song;
}

const AIInsights: React.FC<AIInsightsProps> = ({ currentSong }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AISuggestion | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await getMusicInsights(currentSong);
    setInsight(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-sky-500/10 p-2 rounded-xl">
           <i className="fa-solid fa-sparkles text-sky-400 text-2xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Insights</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="w-12 h-12 bg-sky-500/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-circle-notch fa-spin text-sky-500 text-xl"></i>
            </div>
            <p className="text-slate-400 text-sm italic">Analyzing audio patterns...</p>
          </div>
        ) : insight ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
               <img src={currentSong.coverUrl} className="w-16 h-16 rounded-xl shadow-lg border-2 border-slate-700" alt="" />
               <div>
                 <h3 className="text-slate-100 font-bold">{currentSong.title}</h3>
                 <span className="inline-block px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded text-[10px] font-bold uppercase tracking-wider mt-1">
                   {insight.mood}
                 </span>
               </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">AI Logic</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{insight.reason}</p>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/30">
                <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Up Next Suggestion</h4>
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-arrow-right-long text-sky-500"></i>
                  <span className="text-slate-100 font-medium">Explore some <span className="text-sky-400">{insight.suggestedGenre}</span> tracks</span>
                </div>
              </div>
            </div>

            <button 
              onClick={fetchInsights}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 transition-colors rounded-2xl text-sm font-bold"
            >
              Refresh Analysis
            </button>
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10">
            <p>No insights found for this track.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center space-y-2">
          <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Listening Streak</span>
          <span className="text-xl font-bold">12 Days</span>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center space-y-2">
          <i className="fa-solid fa-heart-pulse text-rose-500"></i>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Top Genre</span>
          <span className="text-xl font-bold">Synthwave</span>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
