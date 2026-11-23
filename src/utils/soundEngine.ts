// Sound & Indonesian Speech Engine for Bacalah Ceria
// Combines Web Audio API marimba/chime synthesis with Web Speech API (id-ID)

let audioCtx: AudioContext | null = null;
let globalSoundEnabled = true;
let activeSequenceToken = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean): void {
  globalSoundEnabled = enabled;
  if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeSequenceToken++;
  }
}

export function isSoundEnabled(): boolean {
  return globalSoundEnabled;
}

export function cancelAllSpeech(): void {
  activeSequenceToken++;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Indonesian letter phonetic names so TTS speaks natural Indonesian alphabet sounds
const INDONESIAN_LETTER_SPEECH: Record<string, string> = {
  A: 'a',
  B: 'be',
  C: 'ce',
  D: 'de',
  E: 'e',
  F: 'ef',
  G: 'ge',
  H: 'ha',
  I: 'i',
  J: 'je',
  K: 'ka',
  L: 'el',
  M: 'em',
  N: 'en',
  O: 'o',
  P: 'pe',
  Q: 'ki',
  R: 'er',
  S: 'es',
  T: 'te',
  U: 'u',
  V: 'fe',
  W: 'we',
  X: 'eks',
  Y: 'ye',
  Z: 'zet',
};

export function getIndonesianLetterSpeech(letter: string): string {
  return INDONESIAN_LETTER_SPEECH[letter.toUpperCase()] || letter.toLowerCase();
}

const BRIGHT_KIDS_PENTATONIC = [659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

function getPreferredIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const idVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('id'));
  if (idVoices.length > 0) {
    // Prefer bright female / youthful Indonesian voices when available
    const preferredNames = ['gadis', 'damayanti', 'google bahasa indonesia', 'female'];
    const brightVoice = idVoices.find((v) =>
      preferredNames.some((name) => v.name.toLowerCase().includes(name))
    );
    if (brightVoice) return brightVoice;

    const exactId = idVoices.find((v) => v.lang.toLowerCase() === 'id-id');
    return exactId || idVoices[0];
  }

  const malayFallback = voices.find((v) => v.lang.toLowerCase().startsWith('ms'));
  return malayFallback || null;
}

export function playTapNote(index = 0): void {
  if (!globalSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freq = BRIGHT_KIDS_PENTATONIC[Math.abs(index) % BRIGHT_KIDS_PENTATONIC.length];

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

export function playVowelChime(): void {
  if (!globalSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [659.25, 880.0].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);

    gain.gain.setValueAtTime(0.001, now + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.07 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.32);
  });
}

export function playBlendSound(): void {
  if (!globalSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.26);
  });
}

export function playSuccessFanfare(): void {
  if (!globalSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const start = now + idx * 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.17, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.36);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.38);
  });
}

export function playTryAgainSound(): void {
  if (!globalSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(340, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function speakIndonesian(text: string, options: SpeakOptions = {}): void {
  if (!globalSoundEnabled) {
    options.onEnd?.();
    return;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = Math.min(options.rate ?? 0.62, 0.66);
  utterance.pitch = options.pitch ?? 1.42;
  utterance.volume = 1;

  const voice = getPreferredIndonesianVoice();
  if (voice) {
    utterance.voice = voice;
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    options.onEnd?.();
  };

  utterance.onstart = () => options.onStart?.();
  utterance.onend = finish;
  utterance.onerror = finish;

  options.onStart?.();
  window.speechSynthesis.speak(utterance);

  // Safety timeout adjusted for slower speaking speed
  window.setTimeout(finish, Math.max(2200, text.length * 220));
}

function speakPromise(text: string, rate: number, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== activeSequenceToken) {
      resolve();
      return;
    }
    if (!globalSoundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      window.setTimeout(resolve, 680);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = Math.min(rate, 0.65);
    utterance.pitch = 1.44;
    utterance.volume = 1;
    const voice = getPreferredIndonesianVoice();
    if (voice) utterance.voice = voice;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    window.setTimeout(finish, Math.max(1300, text.length * 240));
  });
}

export async function speakSyllablesSequence(
  syllables: string[],
  fullWord: string,
  onSyllableIndex: (idx: number | null) => void,
  onComplete?: () => void
): Promise<void> {
  activeSequenceToken++;
  const token = activeSequenceToken;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  for (let i = 0; i < syllables.length; i++) {
    if (token !== activeSequenceToken) return;
    onSyllableIndex(i);
    playTapNote(i);
    await speakPromise(syllables[i].toLowerCase(), 0.52, token);
    await new Promise((r) => window.setTimeout(r, 260));
  }

  if (token !== activeSequenceToken) return;
  onSyllableIndex(-1); // indicates full word highlight
  playBlendSound();
  await speakPromise(fullWord.toLowerCase(), 0.62, token);

  if (token !== activeSequenceToken) return;
  onSyllableIndex(null);
  onComplete?.();
}
