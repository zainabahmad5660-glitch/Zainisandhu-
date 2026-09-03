/**
 * Audio narration and ambient soundtrack engine using Web Speech API & Web Audio API
 */

class AmbientSoundtrack {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private timer: number | null = null;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);
      this.gainNode.connect(this.ctx.destination);
      this.isPlaying = true;
      this.playHarmonicLoop();
    } catch (e) {
      console.warn("Ambient soundtrack not supported or blocked", e);
    }
  }

  private playHarmonicLoop() {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;

    // Poignant, gentle pentatonic / raga bhairavi peaceful notes (D minor / F major peaceful calm)
    const chords = [
      [220.00, 261.63, 329.63], // A minor
      [174.61, 220.00, 261.63], // F major
      [196.00, 246.94, 293.66], // G major
      [164.81, 196.00, 246.94]  // E minor
    ];

    let chordIdx = 0;
    const playNext = () => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const freqs = chords[chordIdx % chords.length];
      chordIdx++;

      freqs.forEach((freq) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.025, now + 1.5);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 6);
      });

      this.timer = window.setTimeout(playNext, 5000);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ctx?.close();
          this.ctx = null;
        }, 600);
      } catch {
        // clean exit
      }
    }
  }

  isActive() {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientSoundtrack();

export function speakText(
  text: string,
  lang: 'ur' | 'en' = 'ur',
  onEnd?: () => void,
  onStart?: () => void
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  if (lang === 'ur') {
    // Look for urdu or hindi voice
    const urduVoice = voices.find(v => v.lang.startsWith('ur')) ||
                      voices.find(v => v.lang.startsWith('hi')) ||
                      voices.find(v => v.name.toLowerCase().includes('urdu') || v.name.toLowerCase().includes('hindi'));
    if (urduVoice) {
      utterance.voice = urduVoice;
    }
    utterance.lang = urduVoice ? urduVoice.lang : 'ur-PK';
    utterance.rate = 0.88; // graceful, emotional narrative pace
  } else {
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
  }

  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
