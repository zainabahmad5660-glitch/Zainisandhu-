import React, { useState } from 'react';
import { StoryEpisode, LanguageMode } from '../types';
import { Volume2, VolumeX, Type, Sparkles, Share2, Copy, Check, ArrowDown } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/audioNarrator';

interface ReadingModeViewProps {
  episode: StoryEpisode;
  languageMode: LanguageMode;
  onOpenTeaser: () => void;
}

export const ReadingModeView: React.FC<ReadingModeViewProps> = ({
  episode,
  languageMode,
  onOpenTeaser
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [readingSceneId, setReadingSceneId] = useState<number | null>(null);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'sepia':
        return 'bg-[#f7f1e5] text-[#2c2416] border-[#e4d7be]';
      case 'light':
        return 'bg-[#fcfbf9] text-[#1a1a1a] border-stone-200';
      case 'dark':
      default:
        return 'bg-stone-950 text-stone-100 border-stone-800';
    }
  };

  const getUrduFontSizeClass = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-lg sm:text-xl leading-[2.2]';
      case 'huge':
        return 'text-2xl sm:text-3xl leading-[2.6]';
      case 'large':
      default:
        return 'text-xl sm:text-2xl leading-[2.4]';
    }
  };

  const handleSpeakScene = (sceneId: number, urduText: string, englishText: string) => {
    if (readingSceneId === sceneId) {
      stopSpeech();
      setReadingSceneId(null);
    } else {
      stopSpeech();
      const textToSpeak = languageMode === 'english' ? englishText : urduText;
      speakText(
        textToSpeak,
        languageMode === 'english' ? 'en' : 'ur',
        () => setReadingSceneId(null),
        () => setReadingSceneId(sceneId)
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(text);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 transition-colors duration-300 ${getThemeClasses()}`}>
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Reading Controls Bar */}
        <div className={`p-4 rounded-2xl border backdrop-blur flex flex-wrap items-center justify-between gap-4 shadow-sm ${
          readingTheme === 'dark' ? 'bg-stone-900/60 border-stone-800' :
          readingTheme === 'sepia' ? 'bg-[#ede3d1]/80 border-[#dfd0b7]' :
          'bg-white/80 border-stone-200'
        }`}>
          {/* Font Size Adjuster */}
          <div className="flex items-center gap-2 text-xs">
            <Type className="w-4 h-4 opacity-70" />
            <span className="font-medium">فونٹ کا سائز:</span>
            <div className="inline-flex rounded-lg overflow-hidden border border-stone-700/40 p-0.5 bg-black/5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                عام
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                بڑا
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  fontSize === 'huge' ? 'bg-emerald-600 text-white font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                جلی
              </button>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-medium">تھیم:</span>
            <button
              onClick={() => setReadingTheme('dark')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                readingTheme === 'dark'
                  ? 'bg-stone-800 border-stone-600 text-stone-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              رات (ڈارک)
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                readingTheme === 'sepia'
                  ? 'bg-[#dfd0b7] border-[#cbb898] text-[#2c2416] font-medium'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              کتابی (سیپیا)
            </button>
            <button
              onClick={() => setReadingTheme('light')}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                readingTheme === 'light'
                  ? 'bg-white border-stone-300 text-stone-900 font-medium'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              دن (روشن)
            </button>
          </div>
        </div>

        {/* Story Title & Prologue */}
        <header className="text-center space-y-4 border-b pb-8 border-stone-800/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold">
            <span>قسط نمبر ۲</span>
            <span>•</span>
            <span>داستانِ زینب</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-urdu font-bold tracking-tight text-amber-500 drop-shadow-sm py-2" dir="rtl">
            {episode.titleUrdu}
          </h1>

          <p className="text-base text-stone-400 italic">
            "{episode.titleRoman}"
          </p>

          <p className="font-urdu text-sm sm:text-base max-w-xl mx-auto opacity-80" dir="rtl">
            {episode.descriptionUrdu}
          </p>
        </header>

        {/* Sequential Story Scenes */}
        <div className="space-y-16">
          {episode.scenes.map((scene, index) => {
            const isReadingThis = readingSceneId === scene.id;
            const fullUrduText = scene.urduParagraphs.join(' ');
            const fullEnglishText = scene.englishParagraphs.join(' ');

            return (
              <article
                key={scene.id}
                className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                  isReadingThis
                    ? 'ring-2 ring-emerald-500 shadow-xl ' + (readingTheme === 'dark' ? 'bg-stone-900/90' : 'bg-emerald-50/50')
                    : readingTheme === 'dark' ? 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700' :
                      readingTheme === 'sepia' ? 'bg-[#f2e9db] border-[#e2d5bd]' :
                      'bg-white border-stone-200'
                }`}
              >
                {/* Scene Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-700/20">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-lg font-urdu font-semibold" dir="rtl">
                        {scene.titleUrdu}
                      </h2>
                      <p className="text-xs opacity-60">
                        {scene.titleRoman}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakScene(scene.id, fullUrduText, fullEnglishText)}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                        isReadingThis
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'border-stone-700/30 hover:border-emerald-500/50 opacity-80 hover:opacity-100'
                      }`}
                      title="آواز میں سنیں"
                    >
                      {isReadingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span className="text-xs font-urdu hidden sm:inline">سنیں</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(scene.highlightQuoteUrdu)}
                      className="p-2 rounded-xl border border-stone-700/30 hover:border-amber-500/50 opacity-80 hover:opacity-100 text-xs transition-all"
                      title="اقتباس کاپی کریں"
                    >
                      {copiedQuote === scene.highlightQuoteUrdu ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid layout with photo and narrative paragraphs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Photo thumbnail */}
                  <div className="md:col-span-4 overflow-hidden rounded-2xl border border-stone-700/30 shadow-md group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-black">
                      <img
                        src={scene.imageSrc}
                        alt={scene.titleUrdu}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <p className="text-[11px] text-stone-300 font-sans">
                          {scene.cameraInfo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="md:col-span-8 space-y-6">
                    {/* Urdu original narrative */}
                    {languageMode !== 'roman' && (
                      <div className={`font-urdu ${getUrduFontSizeClass()} space-y-3 text-right text-stone-100`} dir="rtl">
                        {scene.urduParagraphs.map((para, pIdx) => (
                          <p
                            key={pIdx}
                            className={
                              para.includes("پیسے کہاں سے آئیں گے") || para.includes("خاموشی سے پڑھتی رہی")
                                ? "font-semibold text-amber-300 drop-shadow-sm"
                                : ""
                            }
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Roman Urdu Transliteration */}
                    {(languageMode === 'roman' || languageMode === 'both') && (
                      <div className="space-y-2 text-sm sm:text-base italic text-amber-200/90 border-t border-stone-800/40 pt-4 leading-relaxed font-serif">
                        {scene.romanParagraphs.map((rPara, rIdx) => (
                          <p key={rIdx}>{rPara}</p>
                        ))}
                      </div>
                    )}

                    {/* English Translation */}
                    {(languageMode === 'english') && (
                      <div className="space-y-2 text-sm sm:text-base text-stone-300 border-t border-stone-800/40 pt-4 leading-relaxed">
                        {scene.englishParagraphs.map((ePara, eIdx) => (
                          <p key={eIdx}>{ePara}</p>
                        ))}
                      </div>
                    )}

                    {/* Highlight Box Quote */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                      <div className="space-y-1">
                        <p className="font-urdu text-base sm:text-lg font-bold" dir="rtl">
                          {scene.highlightQuoteUrdu}
                        </p>
                        <p className="text-xs text-amber-200/80 italic">
                          “{scene.highlightQuoteRoman}”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Teaser Banner for Episode 3 */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-emerald-950/60 border border-amber-500/40 shadow-2xl text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            اگلی قسط کا تعارف (Next Episode Teaser)
          </div>

          <h3 className="text-2xl sm:text-3xl font-urdu font-bold text-stone-100" dir="rtl">
            {episode.nextEpisodeTeaserUrdu}
          </h3>

          <p className="text-sm text-stone-300 italic max-w-xl mx-auto">
            "{episode.nextEpisodeTeaserRoman}"
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenTeaser}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-urdu text-base shadow-lg transition-all"
            >
              اگلی قسط کی تفصیلات اور کردار دیکھیں
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
