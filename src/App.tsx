import React, { useState, useEffect } from 'react';
import { ViewMode, LanguageMode } from './types';
import { episode2Data } from './data/storyEpisode2';
import { EpisodeHeader } from './components/EpisodeHeader';
import { StoryCardView } from './components/StoryCardView';
import { ReadingModeView } from './components/ReadingModeView';
import { QuotesGalleryView } from './components/QuotesGalleryView';
import { NextEpisodeModal } from './components/NextEpisodeModal';
import { ambientSound, stopSpeech } from './utils/audioNarrator';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('cinematic');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isTeaserOpen, setIsTeaserOpen] = useState<boolean>(false);

  // Toggle ambient background score
  const toggleAudio = () => {
    if (isAudioOn) {
      ambientSound.stop();
      setIsAudioOn(false);
    } else {
      ambientSound.start();
      setIsAudioOn(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
      ambientSound.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <EpisodeHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        isAudioOn={isAudioOn}
        toggleAudio={toggleAudio}
        onOpenTeaser={() => setIsTeaserOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {viewMode === 'cinematic' && (
          <StoryCardView
            scenes={episode2Data.scenes}
            languageMode={languageMode}
            onOpenTeaser={() => setIsTeaserOpen(true)}
          />
        )}

        {viewMode === 'reader' && (
          <ReadingModeView
            episode={episode2Data}
            languageMode={languageMode}
            onOpenTeaser={() => setIsTeaserOpen(true)}
          />
        )}

        {viewMode === 'quotes' && (
          <QuotesGalleryView
            episode={episode2Data}
            languageMode={languageMode}
          />
        )}
      </main>

      {/* Episode 3 Teaser Modal */}
      <NextEpisodeModal
        isOpen={isTeaserOpen}
        onClose={() => setIsTeaserOpen(false)}
      />

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-stone-800/80 bg-stone-900/50 text-xs text-stone-400 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-urdu font-medium text-stone-300">داستانِ زینب</span>
          <span>•</span>
          <span>ایپی سوڈ ۲: کچھ خواب، جو حالات سے بڑے تھے</span>
        </div>
        <div className="text-stone-500 text-[11px]">
          اردو ادب اور ڈیجیٹل کہانیاں • تمام جملہ حقوق محفوظ ہیں
        </div>
      </footer>
    </div>
  );
}
