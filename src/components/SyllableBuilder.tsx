import React, { useState } from 'react';
import { Volume2, Shuffle, Play } from 'lucide-react';
import {
  CONSONANTS,
  VOWELS,
  SYLLABLE_WORD_PAIRS,
  SyllableWordPair,
} from '../data/bacalahData';
import { WordIllustration } from './WordIllustration';
import {
  playBlendSound,
  playTapNote,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

const FIRST_SYLLABLE_OPTIONS = ['BO', 'BU', 'SA', 'KU', 'RO', 'TO', 'MA', 'ME', 'GI', 'BA', 'DA', 'SU'];
const SECOND_SYLLABLE_OPTIONS = ['LA', 'KU', 'PI', 'DA', 'TI', 'TA', 'JA', 'GI', 'JU', 'DU', 'SU'];

const SYLLABLE_COLORS = [
  'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100',
  'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100',
  'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100',
  'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100',
  'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100',
];

export const SyllableBuilder: React.FC = () => {
  const [selectedConsonant, setSelectedConsonant] = useState('B');
  const [activeVowelRowIdx, setActiveVowelRowIdx] = useState<number | null>(null);

  const [firstSyl, setFirstSyl] = useState('BO');
  const [secondSyl, setSecondSyl] = useState('LA');
  const [highlightPart, setHighlightPart] = useState<number | null>(null);

  const combinedWord = `${firstSyl}${secondSyl}`;
  const matchedPair: SyllableWordPair | undefined = SYLLABLE_WORD_PAIRS.find(
    (p) => p.first === firstSyl && p.second === secondSyl
  );

  const handleTapRowSyllable = (consonant: string, vowel: string, idx: number) => {
    setActiveVowelRowIdx(idx);
    playTapNote(idx);
    const syl = `${consonant}${vowel}`.toLowerCase();
    speakIndonesian(syl, {
      rate: 0.78,
      onEnd: () => setActiveVowelRowIdx(null),
    });
  };

  const handleReadAllRow = () => {
    const syllables = VOWELS.map((v) => `${selectedConsonant}${v}`);
    speakSyllablesSequence(
      syllables,
      syllables.join(' '),
      (idx) => setActiveVowelRowIdx(idx),
      () => setActiveVowelRowIdx(null)
    );
  };

  const handleSelectFirst = (syl: string, idx: number) => {
    setFirstSyl(syl);
    playTapNote(idx);
    speakIndonesian(syl.toLowerCase(), { rate: 0.76 });
  };

  const handleSelectSecond = (syl: string, idx: number) => {
    setSecondSyl(syl);
    playTapNote(idx + 2);
    const newWord = `${firstSyl}${syl}`;
    speakSyllablesSequence([firstSyl, syl], newWord, (partIdx) =>
      setHighlightPart(partIdx)
    );
  };

  const handlePickPreset = (pair: SyllableWordPair) => {
    setFirstSyl(pair.first);
    setSecondSyl(pair.second);
    playBlendSound();
    speakSyllablesSequence([pair.first, pair.second], pair.word, (partIdx) =>
      setHighlightPart(partIdx)
    );
  };

  const handleRandomPair = () => {
    const randomPair =
      SYLLABLE_WORD_PAIRS[Math.floor(Math.random() * SYLLABLE_WORD_PAIRS.length)];
    handlePickPreset(randomPair);
  };

  const handleReadCombined = () => {
    speakSyllablesSequence([firstSyl, secondSyl], combinedWord, (partIdx) =>
      setHighlightPart(partIdx)
    );
  };

  return (
    <section aria-labelledby="sukukata-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Part 1: Classic Ba Bi Bu Be Bo Syllable Board */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="sukukata-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Papan Suku Kata (Metode Bacalah)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Pilih satu huruf konsonan, lalu ketuk kartu suku kata untuk mendengarkan bunyinya.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReadAllRow}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Baca Semua Berurutan</span>
          </button>
        </div>

        {/* Consonant selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CONSONANTS.map((c, idx) => {
            const isSelected = c === selectedConsonant;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setSelectedConsonant(c);
                  playTapNote(idx);
                }}
                className={`w-11 h-11 rounded-xl font-display text-lg font-bold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-400 hover:bg-white'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* 5 Vowel Syllable Cards: ba bi bu be bo */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {VOWELS.map((vowel, idx) => {
            const syl = `${selectedConsonant.toLowerCase()}${vowel.toLowerCase()}`;
            const isHighlighted = activeVowelRowIdx === idx || activeVowelRowIdx === -1;

            return (
              <button
                key={syl}
                type="button"
                onClick={() => handleTapRowSyllable(selectedConsonant, vowel, idx)}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-transform duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  SYLLABLE_COLORS[idx]
                } ${isHighlighted ? 'scale-105 ring-2 ring-amber-400 shadow-sm' : 'hover:-translate-y-0.5'}`}
              >
                <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {syl}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold opacity-80">
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{selectedConsonant} + {vowel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2: Two-Syllable Word Blender */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
              Gabung Dua Suku Kata Jadi Kata Baru
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Pilih balok kiri dan balok kanan, atau ketuk kartu kata bergambar di bawah.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRandomPair}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Shuffle className="w-4 h-4" aria-hidden="true" />
            <span>Acak Kata</span>
          </button>
        </div>

        {/* Word Assembly Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-sky-50/60 border border-sky-200 rounded-2xl p-6 mb-6">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start gap-4">
            <div className="flex items-center flex-wrap justify-center gap-3">
              <span
                className={`font-display text-3xl sm:text-4xl font-extrabold px-5 py-3 rounded-2xl border-2 transition-transform ${
                  highlightPart === 0
                    ? 'bg-amber-300 border-amber-500 text-slate-900 scale-105'
                    : 'bg-white border-sky-300 text-sky-700'
                }`}
              >
                {firstSyl.toLowerCase()}
              </span>

              <span className="font-display text-2xl font-bold text-slate-400" aria-hidden="true">
                +
              </span>

              <span
                className={`font-display text-3xl sm:text-4xl font-extrabold px-5 py-3 rounded-2xl border-2 transition-transform ${
                  highlightPart === 1
                    ? 'bg-amber-300 border-amber-500 text-slate-900 scale-105'
                    : 'bg-white border-rose-300 text-rose-600'
                }`}
              >
                {secondSyl.toLowerCase()}
              </span>

              <span className="font-display text-2xl font-bold text-slate-400" aria-hidden="true">
                =
              </span>

              <span
                className={`font-display text-4xl sm:text-5xl font-extrabold px-6 py-3 rounded-2xl border-2 transition-transform ${
                  highlightPart === -1
                    ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                    : 'bg-slate-900 border-slate-900 text-white'
                }`}
              >
                {combinedWord.toLowerCase()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReadCombined}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span>Eja & Baca: {combinedWord.toLowerCase()}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
            {matchedPair ? (
              <div className="flex flex-col items-center gap-2 animate-gentle-pop">
                <div className="w-32 h-32">
                  <WordIllustration illustKey={matchedPair.illustKey} />
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  Hebat! Kata yang terbentuk: {matchedPair.word}
                </span>
              </div>
            ) : (
              <div className="py-4 px-4 text-center">
                <p className="font-display text-lg font-bold text-slate-700">
                  Bunyi Gabungan: "{combinedWord.toLowerCase()}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Coba gabungkan kata bergambar di bawah untuk memunculkan gambarnya!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Manual Syllable Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs font-bold text-sky-700 mb-2">
              1. Pilih Suku Kata Depan
            </div>
            <div className="flex flex-wrap gap-2">
              {FIRST_SYLLABLE_OPTIONS.map((syl, idx) => (
                <button
                  key={syl}
                  type="button"
                  onClick={() => handleSelectFirst(syl, idx)}
                  className={`px-3.5 py-2 rounded-xl font-display text-base font-bold border transition-colors cursor-pointer ${
                    firstSyl === syl
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-400'
                  }`}
                >
                  {syl.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-rose-700 mb-2">
              2. Pilih Suku Kata Belakang
            </div>
            <div className="flex flex-wrap gap-2">
              {SECOND_SYLLABLE_OPTIONS.map((syl, idx) => (
                <button
                  key={syl}
                  type="button"
                  onClick={() => handleSelectSecond(syl, idx)}
                  className={`px-3.5 py-2 rounded-xl font-display text-base font-bold border transition-colors cursor-pointer ${
                    secondSyl === syl
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-rose-400'
                  }`}
                >
                  {syl.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Picture-Word Pairs */}
        <div className="pt-5 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 mb-3">
            Contoh Kata Bergambar Siap Gabung
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SYLLABLE_WORD_PAIRS.map((pair) => {
              const isActive =
                pair.first === firstSyl && pair.second === secondSyl;
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => handlePickPreset(pair)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="w-14 h-14">
                    <WordIllustration illustKey={pair.illustKey} />
                  </div>
                  <div className="font-display text-sm font-extrabold text-slate-900">
                    <span className="text-sky-700">{pair.first.toLowerCase()}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-rose-600">{pair.second.toLowerCase()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
