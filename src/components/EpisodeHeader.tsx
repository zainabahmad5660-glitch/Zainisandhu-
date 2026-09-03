import React from 'react';
import { ViewMode, LanguageMode } from '../types';
import { Film, BookOpen, Quote, Volume2, VolumeX, Sparkles, Languages } from 'lucide-react';

interface EpisodeHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  isAudioOn: boolean;
  toggleAudio: () => void;
  onOpenTeaser: () => void;
}

export const EpisodeHeader: React.FC<EpisodeHeaderProps> = ({
  viewMode,
  setViewMode,
  languageMode,
  setLanguageMode,
  isAudioOn,
  toggleAudio,
  onOpenTeaser
}) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Episode Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-inner">
            E2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider uppercase text-emerald-400 font-medium">
                داستانِ زینب • قسط ۲
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-base sm:text-lg font-urdu font-bold tracking-tight text-stone-100 line-clamp-1">
              کچھ خواب، جو حالات سے بڑے تھے
            </h1>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
          <button
            id="tab-cinematic"
            onClick={() => setViewMode('cinematic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'cinematic'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
            title="سینما و ریل موڈ"
          >
            <Film className="w-3.5 h-3.5" />
            <span>ریل موڈ</span>
          </button>

          <button
            id="tab-reader"
            onClick={() => setViewMode('reader')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'reader'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
            title="مطالعہ موڈ"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>مطالعہ</span>
          </button>

          <button
            id="tab-quotes"
            onClick={() => setViewMode('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'quotes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
            }`}
            title="خاص اقتباسات"
          >
            <Quote className="w-3.5 h-3.5" />
            <span>اقتباسات</span>
          </button>
        </div>

        {/* Secondary controls: Language & Sound & Next Teaser */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-stone-800/70 border border-stone-700/60 rounded-xl px-2 py-1">
            <Languages className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
            <select
              id="language-select"
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value as LanguageMode)}
              className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="urdu" className="bg-stone-800 text-stone-100">اردو (Urdu)</option>
              <option value="roman" className="bg-stone-800 text-stone-100">Roman Urdu</option>
              <option value="english" className="bg-stone-800 text-stone-100">English</option>
              <option value="both" className="bg-stone-800 text-stone-100">اردو + Roman</option>
            </select>
          </div>

          {/* Ambient BGM toggle */}
          <button
            id="toggle-audio"
            onClick={toggleAudio}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              isAudioOn
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-stone-800/70 border-stone-700/60 text-stone-400 hover:text-stone-200'
            }`}
            title={isAudioOn ? "پس منظر موسیقی بند کریں" : "دھیمی پس منظر موسیقی چلائیں"}
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">دھن آن</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">دھن آف</span>
              </>
            )}
          </button>

          {/* Next Episode Teaser Button */}
          <button
            id="open-teaser-btn"
            onClick={onOpenTeaser}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-amber-600/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-urdu text-xs">قسط ۳ جھلک</span>
          </button>
        </div>
      </div>
    </header>
  );
};
