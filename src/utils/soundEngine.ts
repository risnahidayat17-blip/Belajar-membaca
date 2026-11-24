// Indonesian Child Voice & Sound Engine for Bacalah Ceria
// Uses server-side Gemini Child TTS (/api/tts) with local WAV caching and
// seamless Web Speech API child-pitched Indonesian fallback.

let audioCtx: AudioContext | null = null;
let globalSoundEnabled = true;
let activeSequenceToken = 0;
let activeAudioEl: HTMLAudioElement | null = null;
let activeBufferSource: AudioBufferSourceNode | null = null;
let activeFetchController: AbortController | null = null;
let ttsServerAvailable: boolean | null = null;
let ttsCooldownUntil = 0;

const clientBase64Cache = new Map<string, string>();
const clientBufferCache = new Map<string, AudioBuffer>();
const BRIGHT_KIDS_PENTATONIC = [659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

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
  if (!enabled) {
    cancelAllSpeech();
  }
}

export function isSoundEnabled(): boolean {
  return globalSoundEnabled;
}

export function cancelAllSpeech(): void {
  activeSequenceToken++;
  if (activeFetchController) {
    activeFetchController.abort();
    activeFetchController = null;
  }
  if (activeBufferSource) {
    try {
      activeBufferSource.onended = null;
      activeBufferSource.stop();
    } catch {
      // Ignore already stopped source
    }
    activeBufferSource = null;
  }
  if (activeAudioEl) {
    activeAudioEl.pause();
    activeAudioEl.currentTime = 0;
    activeAudioEl = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Indonesian letter phonetic names so TTS speaks authentic Indonesian alphabet sounds
const INDONESIAN_LETTER_SPEECH: Record<string, string> = {
  A: 'aa',
  B: 'bé',
  C: 'cé',
  D: 'dé',
  E: 'é',
  F: 'éf',
  G: 'gé',
  H: 'ha',
  I: 'ii',
  J: 'jé',
  K: 'ka',
  L: 'él',
  M: 'ém',
  N: 'én',
  O: 'oo',
  P: 'pé',
  Q: 'ki',
  R: 'ér',
  S: 'és',
  T: 'té',
  U: 'uu',
  V: 'fé',
  W: 'wé',
  X: 'éks',
  Y: 'yé',
  Z: 'zét',
};

export function getIndonesianLetterSpeech(letter: string): string {
  return INDONESIAN_LETTER_SPEECH[letter.toUpperCase()] || letter.toLowerCase();
}

// Prevent short open syllables like "be", "ce", "de", "nge", "nye" from being pronounced in English
function toIndonesianPhoneticText(rawText: string): string {
  const trimmed = rawText.trim().toLowerCase();
  return trimmed.replace(/\b(ng|ny|[bcdfghjklmnpqrstvwxyz])e\b/g, '$1é');
}

export function getPreferredIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const isIndoLang = (lang: string) => {
    const l = lang.toLowerCase().replace('_', '-');
    return l === 'id-id' || l === 'id' || l.startsWith('id-');
  };

  const idVoices = voices.filter(
    (v) => isIndoLang(v.lang) || v.name.toLowerCase().includes('indonesia')
  );

  if (idVoices.length > 0) {
    // Local OS voices honor utterance.pitch (e.g. 1.9 for childlike tone),
    // whereas cloud "Google Bahasa Indonesia" ignores pitch completely.
    const localIdVoices = idVoices.filter((v) => v.localService);
    const pool = localIdVoices.length > 0 ? localIdVoices : idVoices;
    const preferredOrder = [
      'gadis',
      'damayanti',
      'indonesia',
      'google bahasa indonesia',
    ];
    for (const keyword of preferredOrder) {
      const match = pool.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }
    return pool[0];
  }

  const msVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ms'));
  return msVoice || null;
}

export function getIndonesianVoiceLabel(): string {
  if (ttsServerAvailable !== false) {
    return 'Suara Anak Ceria (Indonesia)';
  }
  const voice = getPreferredIndonesianVoice();
  return voice ? `${voice.name} (Anak)` : 'Suara Anak Indonesia (id-ID)';
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
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.015);
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

function speakBrowserFallback(
  cleanText: string,
  rate: number,
  token: number,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (token !== activeSequenceToken || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = Math.min(rate, 0.78);
  // High cheerful childlike pitch for browser fallback
  utterance.pitch = 1.95;
  utterance.volume = 1;

  const voice = getPreferredIndonesianVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'id-ID';
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onEnd?.();
  };

  utterance.onstart = () => onStart?.();
  utterance.onend = finish;
  utterance.onerror = finish;

  onStart?.();
  window.speechSynthesis.speak(utterance);
  window.setTimeout(finish, Math.max(2000, cleanText.length * 220));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function fetchChildVoiceBase64(
  cleanText: string,
  speed: 'slow' | 'normal',
  signal: AbortSignal
): Promise<{ key: string; base64: string } | null> {
  if (ttsServerAvailable === false) return null;

  const key = `${speed}::${cleanText}`;
  const cached = clientBase64Cache.get(key);
  if (cached) return { key, base64: cached };

  if (Date.now() < ttsCooldownUntil) return null;

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, speed }),
      signal,
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 503) {
        ttsServerAvailable = false;
      } else if (res.status === 429) {
        ttsCooldownUntil = Date.now() + 30_000;
      }
      return null;
    }

    const data = (await res.json()) as { audioBase64?: string };
    if (!data.audioBase64) return null;

    ttsServerAvailable = true;
    if (clientBase64Cache.size > 150) {
      const oldest = clientBase64Cache.keys().next().value;
      if (oldest) {
        clientBase64Cache.delete(oldest);
        clientBufferCache.delete(oldest);
      }
    }
    clientBase64Cache.set(key, data.audioBase64);
    return { key, base64: data.audioBase64 };
  } catch {
    return null;
  }
}

async function playChildWavAudio(
  key: string,
  base64: string,
  token: number,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (token !== activeSequenceToken) {
    onEnd?.();
    return;
  }

  const ctx = getAudioContext();
  if (ctx) {
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      let audioBuffer = clientBufferCache.get(key);
      if (!audioBuffer) {
        const arrayBuf = base64ToArrayBuffer(base64);
        audioBuffer = await ctx.decodeAudioData(arrayBuf);
        clientBufferCache.set(key, audioBuffer);
      }
      if (token !== activeSequenceToken) {
        onEnd?.();
        return;
      }

      await new Promise<void>((resolve) => {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = audioBuffer!;
        // +2.87 semitone vocal-tract & pitch lift so it sounds unmistakably like a cute 5-year-old child
        source.playbackRate.value = 1.18;
        gain.gain.value = 1;

        source.connect(gain);
        gain.connect(ctx.destination);
        activeBufferSource = source;

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          if (activeBufferSource === source) activeBufferSource = null;
          onEnd?.();
          resolve();
        };

        source.onended = finish;
        onStart?.();
        source.start(0);
      });
      return;
    } catch {
      // Fall through to HTMLAudioElement fallback below
    }
  }

  await new Promise<void>((resolve) => {
    if (token !== activeSequenceToken) {
      onEnd?.();
      resolve();
      return;
    }

    const audio = new Audio(`data:audio/wav;base64,${base64}`);
    audio.playbackRate = 1.1;
    activeAudioEl = audio;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      if (activeAudioEl === audio) activeAudioEl = null;
      onEnd?.();
      resolve();
    };

    audio.onended = finish;
    audio.onerror = finish;
    onStart?.();
    audio.play().catch(finish);
  });
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

  // Unlock AudioContext synchronously during user gesture before async fetch
  getAudioContext();
  cancelAllSpeech();
  const token = activeSequenceToken;
  const cleanText = toIndonesianPhoneticText(text);
  const speed: 'slow' | 'normal' = (options.rate ?? 0.72) <= 0.68 ? 'slow' : 'normal';

  const controller = new AbortController();
  activeFetchController = controller;

  fetchChildVoiceBase64(cleanText, speed, controller.signal).then((result) => {
    if (token !== activeSequenceToken) return;
    if (result) {
      playChildWavAudio(result.key, result.base64, token, options.onStart, options.onEnd);
    } else {
      speakBrowserFallback(
        cleanText,
        options.rate ?? 0.72,
        token,
        options.onStart,
        options.onEnd
      );
    }
  });
}

async function speakPromise(
  text: string,
  rate: number,
  token: number
): Promise<void> {
  if (token !== activeSequenceToken) return;
  if (!globalSoundEnabled) {
    await new Promise((r) => window.setTimeout(r, 520));
    return;
  }

  const cleanText = toIndonesianPhoneticText(text);
  const speed: 'slow' | 'normal' = rate <= 0.68 ? 'slow' : 'normal';
  const controller = new AbortController();
  activeFetchController = controller;

  const result = await fetchChildVoiceBase64(cleanText, speed, controller.signal);
  if (token !== activeSequenceToken) return;

  if (result) {
    await playChildWavAudio(result.key, result.base64, token);
  } else {
    await new Promise<void>((resolve) => {
      speakBrowserFallback(cleanText, rate, token, undefined, resolve);
    });
  }
}

export async function speakSyllablesSequence(
  syllables: string[],
  fullWord: string,
  onSyllableIndex: (idx: number | null) => void,
  onComplete?: () => void
): Promise<void> {
  getAudioContext();
  cancelAllSpeech();
  const token = activeSequenceToken;

  for (let i = 0; i < syllables.length; i++) {
    if (token !== activeSequenceToken) return;
    onSyllableIndex(i);
    playTapNote(i);
    await speakPromise(syllables[i].toLowerCase(), 0.64, token);
    await new Promise((r) => window.setTimeout(r, 200));
  }

  if (token !== activeSequenceToken) return;
  onSyllableIndex(-1);
  playBlendSound();
  await speakPromise(fullWord.toLowerCase(), 0.72, token);

  if (token !== activeSequenceToken) return;
  onSyllableIndex(null);
  onComplete?.();
}
