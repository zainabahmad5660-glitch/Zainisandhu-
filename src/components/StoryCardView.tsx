import React, { useState, useEffect, useRef } from 'react';
import { StoryScene, LanguageMode } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Volume2, 
  Share2, 
  Bookmark, 
  Maximize2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText, stopSpeech } from '../utils/audioNarrator';

interface StoryCardViewProps {
  scenes: StoryScene[];
  languageMode: LanguageMode;
  onSelectScene?: (index: number) => void;
  onOpenTeaser: () => void;
}

export const StoryCardView: React.FC<StoryCardViewProps> = ({
  scenes,
  languageMode,
  onOpenTeaser
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [savedQuote, setSavedQuote] = useState(false);

  const scene = scenes[currentIdx];
  const timerRef = useRef<number | null>(null);

  // Auto-play story timer
  useEffect(() => {
    if (!isAutoPlaying) {
      setProgress(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const duration = 7500; // 7.5 seconds per scene
    const interval = 50;
    const step = (interval / duration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIdx < scenes.length - 1) {
            setCurrentIdx((c) => c + 1);
            return 0;
          } else {
            setIsAutoPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentIdx, scenes.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx]);

  const goToNext = () => {
    stopSpeech();
    setIsSpeaking(false);
    setProgress(0);
    if (currentIdx < scenes.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onOpenTeaser();
    }
  };

  const goToPrev = () => {
    stopSpeech();
    setIsSpeaking(false);
    setProgress(0);
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSpeakCurrentScene = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const textToSpeak = languageMode === 'english'
        ? scene.englishParagraphs.join(' ')
        : scene.urduParagraphs.join(' ');

      speakText(
        textToSpeak,
        languageMode === 'english' ? 'en' : 'ur',
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-2 sm:p-6 bg-stone-950 text-stone-100 select-none">
      {/* Container simulating high-end mobile story / reel screen */}
      <div className="relative w-full max-w-[440px] aspect-[9/16] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-black flex flex-col justify-between">
        
        {/* Background Image with Cinematic Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={scene.imageSrc}
              alt={scene.titleUrdu}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Top gradient for story indicators */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
            {/* Bottom heavy cinematic vignette for high readability */}
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Top Story Header & Segment Bars */}
        <div className="relative z-20 p-4 pt-3 space-y-2">
          {/* Multi-segment story progress indicators */}
          <div className="flex items-center gap-1.5 w-full">
            {scenes.map((s, idx) => {
              let fillWidth = '0%';
              if (idx < currentIdx) fillWidth = '100%';
              else if (idx === currentIdx) fillWidth = `${isAutoPlaying ? progress : 100}%`;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setProgress(0);
                    stopSpeech();
                    setIsSpeaking(false);
                  }}
                  className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors"
                >
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Episode Info Bar */}
          <div className="flex items-center justify-between text-xs text-white/90 pt-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-semibold text-[11px]">
                منظر {currentIdx + 1}/{scenes.length}
              </span>
              <span className="font-medium text-stone-200 drop-shadow">
                {scene.titleRoman}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="voice-read-btn"
                onClick={handleSpeakCurrentScene}
                className={`p-1.5 rounded-full transition-all ${
                  isSpeaking ? 'bg-emerald-500 text-black animate-pulse' : 'bg-black/40 hover:bg-black/60 text-white'
                }`}
                title="آواز میں سنیں (Audio Narration)"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                id="auto-play-toggle"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
                title={isAutoPlaying ? "روکیں" : "آٹو پلے"}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tap areas for quick Left / Right navigation */}
        <div className="absolute inset-y-16 inset-x-0 z-10 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={goToPrev}
            title="پچھلا منظر"
          />
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={() => setShowFullText(!showFullText)}
            title="مکمل متن دکھائیں"
          />
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={goToNext}
            title="اگلا منظر"
          />
        </div>

        {/* Bottom Story Content Overlay */}
        <div className="relative z-20 p-5 pb-6 flex flex-col justify-end space-y-3">
          
          {/* Optional Expanded Text Drawer */}
          <AnimatePresence>
            {showFullText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-2 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-700/70 backdrop-blur-md max-h-48 overflow-y-auto space-y-2 text-stone-200"
              >
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-1">
                  <span className="font-urdu">مکمل تحریر</span>
                  <button onClick={() => setShowFullText(false)} className="text-stone-400 hover:text-white">✕</button>
                </div>
                {languageMode !== 'english' && (
                  <div className="space-y-1.5 font-urdu text-sm leading-relaxed text-stone-100 text-right" dir="rtl">
                    {scene.urduParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {(languageMode === 'roman' || languageMode === 'both') && (
                  <div className="space-y-1 text-xs text-amber-200/90 italic pt-1 border-t border-stone-800/80">
                    {scene.romanParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {languageMode === 'english' && (
                  <div className="space-y-1 text-xs text-stone-300">
                    {scene.englishParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Highlight Subtitle Quote - Designed matching the user's image exactly */}
          <div className="text-center space-y-2">
            {/* Urdu Main Nastaliq Line */}
            {languageMode !== 'roman' && (
              <motion.p
                key={`urdu-${scene.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-urdu text-lg sm:text-xl font-bold text-amber-300 leading-loose drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                dir="rtl"
              >
                {scene.highlightQuoteUrdu}
              </motion.p>
            )}

            {/* Roman Urdu Subtitle (Matching the user's image text style: "Chupkey se parhti rahi… mehnat karti rahi.") */}
            {(languageMode === 'roman' || languageMode === 'both' || languageMode === 'urdu') && (
              <motion.p
                key={`roman-${scene.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-amber-200/95 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] italic"
              >
                “{scene.highlightQuoteRoman}”
              </motion.p>
            )}

            {languageMode === 'english' && (
              <p className="text-sm text-stone-200 font-light drop-shadow">
                “{scene.highlightQuoteEnglish}”
              </p>
            )}

            {/* Camera & Lens info matching the image footer */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-300/80 pt-1 font-sans">
              <span>{scene.cameraInfo}</span>
              <Sparkles className="w-3 h-3 text-amber-300 inline" />
            </div>
          </div>

          {/* Bottom Interactive Navigation & Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <button
              id="btn-prev-scene"
              onClick={goToPrev}
              disabled={currentIdx === 0}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-all ${
                currentIdx === 0
                  ? 'opacity-30 border-transparent cursor-not-allowed text-stone-500'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">پچھلا</span>
            </button>

            {/* Middle Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-info-drawer"
                onClick={() => setShowFullText(!showFullText)}
                className={`p-2 rounded-xl text-xs border flex items-center gap-1 transition-all ${
                  showFullText
                    ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
                title="مکمل منظر کی تحریر"
              >
                <Info className="w-4 h-4" />
                <span className="text-[11px] font-urdu">تفصیل</span>
              </button>

              <button
                id="btn-save-quote"
                onClick={() => {
                  setSavedQuote(!savedQuote);
                }}
                className={`p-2 rounded-xl text-xs border transition-all ${
                  savedQuote
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-stone-300'
                }`}
                title="محفوظ کریں"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <button
              id="btn-next-scene"
              onClick={goToNext}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
            >
              <span>{currentIdx < scenes.length - 1 ? 'اگلا' : 'اختتام'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* External Helper Controls for Desktop */}
      <div className="mt-4 flex items-center gap-3 text-xs text-stone-400">
        <span>کی بورڈ: اگلا منظر دیکھنے کے لیے سپیس بار یا ایرو کیز استعمال کریں</span>
      </div>
    </div>
  );
};
