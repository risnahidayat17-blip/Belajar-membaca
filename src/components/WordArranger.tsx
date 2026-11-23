import React, { useMemo, useState } from 'react';
import { Volume2, RotateCcw, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import {
  PICTURE_WORDS,
  SENTENCE_PUZZLES,
  SentencePuzzle,
  WordCardItem,
} from '../data/bacalahData';
import { WordIllustration } from './WordIllustration';
import {
  playBlendSound,
  playSuccessFanfare,
  playTapNote,
  playTryAgainSound,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

interface WordArrangerProps {
  onEarnStar: () => void;
}

type ArrangeLevel = 'syllables' | 'sentence';

interface TileItem {
  uid: string;
  text: string;
}

function shuffleAvoidSame<T extends { text: string }>(
  items: T[],
  expectedOrder: string[]
): T[] {
  if (items.length <= 1) return items;
  let copy = [...items];
  for (let attempt = 0; attempt < 8; attempt++) {
    copy = [...items].sort(() => Math.random() - 0.5);
    const same = copy.every((item, i) => item.text === expectedOrder[i]);
    if (!same) return copy;
  }
  return [items[items.length - 1], ...items.slice(0, items.length - 1)];
}

const TILE_PALETTE = [
  'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100',
  'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
  'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100',
  'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
];

export const WordArranger: React.FC<WordArrangerProps> = ({ onEarnStar }) => {
  const [level, setLevel] = useState<ArrangeLevel>('syllables');

  // Level 1: Susun Suku Kata -> Kata
  const wordPool: WordCardItem[] = useMemo(
    () => PICTURE_WORDS.filter((w) => w.syllables.length >= 2),
    []
  );
  const [wordIdx, setWordIdx] = useState(0);
  const currentWordItem = wordPool[wordIdx];

  const [wordPlaced, setWordPlaced] = useState<TileItem[]>([]);
  const [wordStatus, setWordStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wordHighlightIdx, setWordHighlightIdx] = useState<number | null>(null);

  const scrambledSyllableTiles: TileItem[] = useMemo(() => {
    const base = currentWordItem.syllables.map((s, idx) => ({
      uid: `${currentWordItem.id}-syl-${idx}`,
      text: s,
    }));
    return shuffleAvoidSame(base, currentWordItem.syllables);
  }, [currentWordItem]);

  // Level 2: Susun Kata -> Kalimat Sederhana
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const currentSentence: SentencePuzzle = SENTENCE_PUZZLES[sentenceIdx];

  const [sentencePlaced, setSentencePlaced] = useState<TileItem[]>([]);
  const [sentenceStatus, setSentenceStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sentenceHighlightIdx, setSentenceHighlightIdx] = useState<number | null>(null);

  const scrambledSentenceTiles: TileItem[] = useMemo(() => {
    const base = currentSentence.words.map((w, idx) => ({
      uid: `${currentSentence.id}-w-${idx}`,
      text: w,
    }));
    return shuffleAvoidSame(base, currentSentence.words);
  }, [currentSentence]);

  // --- Handlers for Level 1 (Susun Suku Kata) ---
  const handlePickSyllableTile = (tile: TileItem, idx: number) => {
    if (wordStatus === 'correct') return;
    if (wordPlaced.some((p) => p.uid === tile.uid)) return;

    playTapNote(idx);
    speakIndonesian(tile.text.toLowerCase(), { rate: 0.78 });

    const nextPlaced = [...wordPlaced, tile];
    setWordPlaced(nextPlaced);
    setWordStatus('idle');

    if (nextPlaced.length === currentWordItem.syllables.length) {
      const formed = nextPlaced.map((t) => t.text).join('');
      if (formed.toLowerCase() === currentWordItem.word.toLowerCase().replace('-', '')) {
        setWordStatus('correct');
        onEarnStar();
        playSuccessFanfare();
        speakSyllablesSequence(
          currentWordItem.syllables,
          currentWordItem.word,
          (sIdx) => setWordHighlightIdx(sIdx)
        );
      } else {
        setWordStatus('wrong');
        playTryAgainSound();
        speakIndonesian(`Belum pas, bunyinya jadi ${formed.toLowerCase()}. Ayo susun ulang!`);
      }
    }
  };

  const handleRemoveWordTile = (uid: string) => {
    if (wordStatus === 'correct') return;
    playTapNote(0);
    setWordPlaced((prev) => prev.filter((t) => t.uid !== uid));
    setWordStatus('idle');
  };

  const handleResetWord = () => {
    playTapNote(0);
    setWordPlaced([]);
    setWordStatus('idle');
    setWordHighlightIdx(null);
  };

  const handleNextWord = () => {
    playBlendSound();
    const next = (wordIdx + 1) % wordPool.length;
    setWordIdx(next);
    setWordPlaced([]);
    setWordStatus('idle');
    setWordHighlightIdx(null);
    speakIndonesian(`Ayo susun kata ${wordPool[next].word}!`);
  };

  const handleListenWordTarget = () => {
    speakSyllablesSequence(
      currentWordItem.syllables,
      currentWordItem.word,
      (sIdx) => setWordHighlightIdx(sIdx)
    );
  };

  // --- Handlers for Level 2 (Susun Kalimat) ---
  const handlePickSentenceTile = (tile: TileItem, idx: number) => {
    if (sentenceStatus === 'correct') return;
    if (sentencePlaced.some((p) => p.uid === tile.uid)) return;

    playTapNote(idx);
    speakIndonesian(tile.text.toLowerCase(), { rate: 0.85 });

    const nextPlaced = [...sentencePlaced, tile];
    setSentencePlaced(nextPlaced);
    setSentenceStatus('idle');

    if (nextPlaced.length === currentSentence.words.length) {
      const isMatch = nextPlaced.every(
        (t, i) => t.text.toLowerCase() === currentSentence.words[i].toLowerCase()
      );
      if (isMatch) {
        setSentenceStatus('correct');
        onEarnStar();
        playSuccessFanfare();
        const fullText = currentSentence.words.join(' ');
        speakSyllablesSequence(currentSentence.words, fullText, (sIdx) =>
          setSentenceHighlightIdx(sIdx)
        );
      } else {
        setSentenceStatus('wrong');
        playTryAgainSound();
        speakIndonesian('Urutan katanya belum tepat. Yuk coba susun lagi!');
      }
    }
  };

  const handleRemoveSentenceTile = (uid: string) => {
    if (sentenceStatus === 'correct') return;
    playTapNote(0);
    setSentencePlaced((prev) => prev.filter((t) => t.uid !== uid));
    setSentenceStatus('idle');
  };

  const handleResetSentence = () => {
    playTapNote(0);
    setSentencePlaced([]);
    setSentenceStatus('idle');
    setSentenceHighlightIdx(null);
  };

  const handleNextSentence = () => {
    playBlendSound();
    const next = (sentenceIdx + 1) % SENTENCE_PUZZLES.length;
    setSentenceIdx(next);
    setSentencePlaced([]);
    setSentenceStatus('idle');
    setSentenceHighlightIdx(null);
    speakIndonesian(`Susun kalimat: ${SENTENCE_PUZZLES[next].clue}`);
  };

  const handleListenSentenceTarget = () => {
    const fullText = currentSentence.words.join(' ');
    speakSyllablesSequence(currentSentence.words, fullText, (sIdx) =>
      setSentenceHighlightIdx(sIdx)
    );
  };

  return (
    <section aria-labelledby="susun-heading" className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="susun-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Susun Kata Agar Bisa Dibaca
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Ketuk potongan kartu secara berurutan ke dalam kotak jawaban untuk membentuk bacaan yang benar.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          <button
            type="button"
            onClick={() => {
              playTapNote(0);
              setLevel('syllables');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              level === 'syllables'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Susun Suku Kata
          </button>
          <button
            type="button"
            onClick={() => {
              playTapNote(1);
              setLevel('sentence');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              level === 'sentence'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Susun Kalimat
          </button>
        </div>
      </div>

      {level === 'syllables' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 flex-wrap">
            <span className="text-sm font-semibold text-slate-600">
              Latihan <span className="tabular-nums font-bold text-slate-900">{wordIdx + 1}</span> /{' '}
              <span className="tabular-nums">{wordPool.length}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleListenWordTarget}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-colors cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                <span>Dengar Petunjuk</span>
              </button>
              <button
                type="button"
                onClick={handleResetWord}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Ulangi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
            <div className="md:col-span-4 flex flex-col items-center text-center gap-3">
              <div className="w-36 h-36 p-3 rounded-2xl bg-sky-50 border border-sky-200">
                <WordIllustration illustKey={currentWordItem.illustKey} />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {currentWordItem.funFact}
              </p>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6">
              {/* Target Slots */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2.5">
                  Kotak Susunan Kata (ketuk kartu terpasang untuk melepas)
                </div>
                <div className="flex flex-wrap items-center gap-3 min-h-[76px] p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
                  {currentWordItem.syllables.map((_, slotIdx) => {
                    const placed = wordPlaced[slotIdx];
                    const isLit =
                      wordHighlightIdx === slotIdx || wordHighlightIdx === -1;
                    return placed ? (
                      <button
                        key={placed.uid}
                        type="button"
                        onClick={() => handleRemoveWordTile(placed.uid)}
                        className={`px-6 py-3 rounded-xl border-2 font-display text-3xl font-extrabold transition-transform cursor-pointer ${
                          isLit
                            ? 'bg-amber-300 border-amber-500 text-slate-900 scale-105'
                            : wordStatus === 'correct'
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : wordStatus === 'wrong'
                            ? 'bg-rose-100 border-rose-400 text-rose-800'
                            : 'bg-sky-600 border-sky-700 text-white hover:bg-sky-700'
                        }`}
                      >
                        {placed.text}
                      </button>
                    ) : (
                      <div
                        key={`empty-${slotIdx}`}
                        className="w-24 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center font-display text-lg font-bold text-slate-300 tabular-nums"
                      >
                        {slotIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scrambled Syllable Bank */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2.5">
                  Pilihan Suku Kata Acak
                </div>
                <div className="flex flex-wrap gap-3">
                  {scrambledSyllableTiles.map((tile, idx) => {
                    const isUsed = wordPlaced.some((p) => p.uid === tile.uid);
                    return (
                      <button
                        key={tile.uid}
                        type="button"
                        disabled={isUsed || wordStatus === 'correct'}
                        onClick={() => handlePickSyllableTile(tile, idx)}
                        className={`px-6 py-3.5 rounded-2xl border-2 font-display text-3xl font-extrabold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                          isUsed
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-default'
                            : `${TILE_PALETTE[idx % TILE_PALETTE.length]} hover:-translate-y-0.5 shadow-sm`
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {wordStatus === 'correct' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-gentle-pop">
              <div className="flex items-center gap-2.5 text-emerald-900 font-semibold">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>
                  Pintar! Susunan yang benar adalah{' '}
                  <strong className="font-display text-lg">{currentWordItem.word}</strong> (
                  {currentWordItem.syllables.join(' - ')}).
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleListenWordTarget}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>Baca Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextWord}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  <span>Kata Berikutnya</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {wordStatus === 'wrong' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-rose-800">
                Urutannya belum pas nih. Ketuk suku kata di kotak atas atau tekan Ulangi untuk mencoba lagi!
              </span>
              <button
                type="button"
                onClick={handleResetWord}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shrink-0 cursor-pointer"
              >
                Susun Ulang
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 flex-wrap">
            <span className="text-sm font-semibold text-slate-600">
              Kalimat <span className="tabular-nums font-bold text-slate-900">{sentenceIdx + 1}</span> /{' '}
              <span className="tabular-nums">{SENTENCE_PUZZLES.length}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleListenSentenceTarget}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span>Dengar Contoh Kalimat</span>
              </button>
              <button
                type="button"
                onClick={handleResetSentence}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Ulangi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6">
            <div className="md:col-span-4 flex flex-col items-center text-center gap-3">
              <div className="w-36 h-36 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <WordIllustration illustKey={currentSentence.illustKey} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {currentSentence.clue}
              </p>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6">
              {/* Target Sentence Slots */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2.5">
                  Susun Menjadi Kalimat Lengkap
                </div>
                <div className="flex flex-wrap items-center gap-3 min-h-[76px] p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
                  {currentSentence.words.map((_, slotIdx) => {
                    const placed = sentencePlaced[slotIdx];
                    const isLit =
                      sentenceHighlightIdx === slotIdx || sentenceHighlightIdx === -1;
                    return placed ? (
                      <button
                        key={placed.uid}
                        type="button"
                        onClick={() => handleRemoveSentenceTile(placed.uid)}
                        className={`px-5 py-3 rounded-xl border-2 font-display text-2xl sm:text-3xl font-extrabold transition-transform cursor-pointer ${
                          isLit
                            ? 'bg-amber-300 border-amber-500 text-slate-900 scale-105'
                            : sentenceStatus === 'correct'
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : sentenceStatus === 'wrong'
                            ? 'bg-rose-100 border-rose-400 text-rose-800'
                            : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {placed.text}
                      </button>
                    ) : (
                      <div
                        key={`s-empty-${slotIdx}`}
                        className="w-28 h-14 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center font-display text-sm font-bold text-slate-400 tabular-nums"
                      >
                        Kata {slotIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scrambled Word Bank */}
              <div>
                <div className="text-xs font-bold text-slate-500 mb-2.5">
                  Pilihan Kata Acak (ketuk sesuai urutan)
                </div>
                <div className="flex flex-wrap gap-3">
                  {scrambledSentenceTiles.map((tile, idx) => {
                    const isUsed = sentencePlaced.some((p) => p.uid === tile.uid);
                    return (
                      <button
                        key={tile.uid}
                        type="button"
                        disabled={isUsed || sentenceStatus === 'correct'}
                        onClick={() => handlePickSentenceTile(tile, idx)}
                        className={`px-5 py-3.5 rounded-2xl border-2 font-display text-2xl sm:text-3xl font-extrabold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                          isUsed
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-default'
                            : `${TILE_PALETTE[idx % TILE_PALETTE.length]} hover:-translate-y-0.5 shadow-sm`
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {sentenceStatus === 'correct' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-gentle-pop">
              <div className="flex items-center gap-2.5 text-emerald-900 font-semibold">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>
                  Hebat! Kalimatnya bisa dibaca:{' '}
                  <strong className="font-display text-lg">
                    "{currentSentence.words.join(' ')}."
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleListenSentenceTarget}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>Baca Kalimat</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSentence}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  <span>Kalimat Berikutnya</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {sentenceStatus === 'wrong' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-rose-800">
                Urutan katanya belum pas. Coba susun dari siapa dulu yang melakukan kegiatan ya!
              </span>
              <button
                type="button"
                onClick={handleResetSentence}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shrink-0 cursor-pointer"
              >
                Susun Ulang
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
