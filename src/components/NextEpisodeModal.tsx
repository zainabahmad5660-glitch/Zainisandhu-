import React from 'react';
import { X, Sparkles, ArrowRight, Bell, Heart, BookMarked } from 'lucide-react';
import horizonImg from '../assets/images/zainab_horizon_future_1788432060017.jpg';

interface NextEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextEpisodeModal: React.FC<NextEpisodeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border border-stone-700 shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-stone-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Hero Banner */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-black">
          <img
            src={horizonImg}
            alt="Episode 3 Teaser"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-semibold">
              جلد آ رہا ہے • ایپی سوڈ ۳
            </span>
            <h2 className="text-xl sm:text-2xl font-urdu font-bold text-stone-100 mt-2" dir="rtl">
              حقیقت کی تلخیاں اور زندگی کا نیا موڑ
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-3 font-urdu text-base leading-loose text-stone-200 text-right" dir="rtl">
            <p className="text-amber-400 font-bold text-lg">
              "یہ تو صرف شروعات تھی… اصل کہانی ابھی باقی تھی۔"
            </p>
            <p className="text-stone-300">
              اگلے ایپی سوڈ میں زینب کی زندگی کا وہ موڑ، جہاں بچپن کے خواب آہستہ آہستہ حقیقت کی سختیوں سے ٹکرانے لگے۔ جب معصوم امیدوں کا مقابلہ دنیا کی بے رحم حقیقتوں سے ہو گا…
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-1.5 text-xs text-stone-300">
            <p className="font-semibold text-stone-100">Roman Urdu Teaser:</p>
            <p className="italic text-amber-200">
              "Yeh to sirf shuruat thi… Asal kahani abhi baqi thi. Agle episode mein Zainab ki zindagi ka woh morr, jahan bachpan ke khwab aahista aahista haqeeqat ki sakhtiyon se takrane lagay."
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-all"
            >
              واپس جائیں (Back)
            </button>

            <button
              onClick={() => {
                alert("آپ کا شکریہ! ایپی سوڈ 3 جاری ہوتے ہی آپ کو مطلع کر دیا جائے گا۔");
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>ایپی سوڈ ۳ کے لیے سبسکرائب کریں</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
