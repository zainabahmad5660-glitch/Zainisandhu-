import React, { useState } from 'react';
import { StoryEpisode, LanguageMode } from '../types';
import { Quote, Sparkles, Copy, Check, Volume2, Bookmark, Heart } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/audioNarrator';

interface QuotesGalleryViewProps {
  episode: StoryEpisode;
  languageMode: LanguageMode;
}

export const QuotesGalleryView: React.FC<QuotesGalleryViewProps> = ({
  episode,
  languageMode
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({
    1: 42,
    2: 89,
    3: 135,
    4: 76,
    5: 64
  });

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: number, textUrdu: string, textRoman: string) => {
    if (speakingId === id) {
      stopSpeech();
      setSpeakingId(null);
    } else {
      stopSpeech();
      speakText(
        textUrdu,
        'ur',
        () => setSpeakingId(null),
        () => setSpeakingId(id)
      );
    }
  };

  const toggleLike = (id: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-stone-950 text-stone-100">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ایپی سوڈ ۲ کے یادگار جملے اور احساسات</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-urdu font-bold text-stone-100" dir="rtl">
            کچھ خواب، جو حالات سے بڑے تھے
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
            وہ خاموش سبق اور دلی جذبات جو زینب کی زندگی کے اس اہم موڑ کو بیان کرتے ہیں
          </p>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {episode.scenes.map((scene) => {
            const isSpeaking = speakingId === scene.id;
            const isCopied = copiedId === scene.id;

            return (
              <div
                key={scene.id}
                className="relative rounded-3xl p-6 bg-stone-900/60 border border-stone-800 hover:border-stone-700 transition-all shadow-lg flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Accent Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                    <Quote className="w-4 h-4 rotate-180 opacity-60" />
                    <span>منظر {scene.id}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(scene.id, scene.highlightQuoteUrdu, scene.highlightQuoteRoman)}
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        isSpeaking ? 'bg-emerald-500 text-black' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      }`}
                      title="آواز میں سنیں"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(scene.id, `"${scene.highlightQuoteUrdu}" - زینب کی کہانی (ایپی سوڈ 2)`)}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-all text-xs"
                      title="اقتباس کاپی کریں"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="py-6 space-y-3">
                  <p className="font-urdu text-xl sm:text-2xl font-bold leading-relaxed text-stone-100 text-right" dir="rtl">
                    "{scene.highlightQuoteUrdu}"
                  </p>

                  <p className="text-sm font-serif italic text-amber-200/90 leading-relaxed">
                    “{scene.highlightQuoteRoman}”
                  </p>

                  {languageMode === 'english' && (
                    <p className="text-xs text-stone-400 pt-1">
                      "{scene.highlightQuoteEnglish}"
                    </p>
                  )}
                </div>

                {/* Card Footer with Interactions */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span className="text-[11px] font-urdu">زینب کا احساس</span>

                  <button
                    onClick={() => toggleLike(scene.id)}
                    className="flex items-center gap-1 text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 hover:fill-rose-500" />
                    <span>{likes[scene.id] || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
