import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ALPHABET_ITEMS, AlphabetItem } from '../data/bacalahData';
import { WordIllustration } from './WordIllustration';
import {
  getIndonesianLetterSpeech,
  playTapNote,
  playVowelChime,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

type LetterFilter = 'all' | 'vowel' | 'consonant';

export const AlphabetExplorer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<LetterFilter>('all');
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const currentItem: AlphabetItem = ALPHABET_ITEMS[selectedIndex];

  const filteredItems = ALPHABET_ITEMS.filter((item) => {
    if (filter === 'vowel') return item.isVowel;
    if (filter === 'consonant') return !item.isVowel;
    return true;
  });

  const handleSelectLetter = (item: AlphabetItem, globalIdx: number) => {
    setSelectedIndex(globalIdx);
    setActiveSyllableIdx(null);
    setAnimKey((k) => k + 1);

    if (item.isVowel) {
      playVowelChime();
    } else {
      playTapNote(globalIdx);
    }

    const spokenLetter = getIndonesianLetterSpeech(item.letter);
    speakIndonesian(`${spokenLetter}... ${item.word}!`);
  };

  const handleSpeakLetterOnly = () => {
    if (currentItem.isVowel) {
      playVowelChime();
    } else {
      playTapNote(selectedIndex);
    }
    const spokenLetter = getIndonesianLetterSpeech(currentItem.letter);
    speakIndonesian(`Huruf ${spokenLetter}. ${currentItem.soundHint}`);
  };

  const handleSpellWord = () => {
    speakSyllablesSequence(
      currentItem.syllables,
      currentItem.word,
      (idx) => setActiveSyllableIdx(idx)
    );
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + ALPHABET_ITEMS.length) % ALPHABET_ITEMS.length;
    handleSelectLetter(ALPHABET_ITEMS[prevIdx], prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % ALPHABET_ITEMS.length;
    handleSelectLetter(ALPHABET_ITEMS[nextIdx], nextIdx);
  };

  return (
    <section aria-labelledby="huruf-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="huruf-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Mengenal Huruf A sampai Z
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Ketuk kotak huruf di bawah untuk melihat gambar berwarna dan mendengar suaranya.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {(
            [
              { id: 'all', label: 'Semua (26)' },
              { id: 'vowel', label: 'Vokal (A I U E O)' },
              { id: 'consonant', label: 'Konsonan' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playTapNote(0);
                setFilter(tab.id);
              }}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Spotlight Stage */}
        <div
          key={animKey}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 animate-gentle-pop"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-semibold text-slate-500">
              {currentItem.isVowel ? 'Huruf Vokal' : 'Huruf Konsonan'} · Urutan{' '}
              <span className="tabular-nums">{selectedIndex + 1}</span>/26
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Huruf sebelumnya"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Huruf berikutnya"
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 flex flex-col items-center text-center border ${currentItem.accentBg} ${currentItem.accentBorder}`}
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`font-display text-6xl sm:text-7xl font-extrabold ${currentItem.accentText}`}>
                {currentItem.letter}
              </span>
              <span className="font-display text-5xl sm:text-6xl font-bold text-slate-700">
                {currentItem.letter.toLowerCase()}
              </span>
            </div>

            <div className="w-40 h-40 my-2">
              <WordIllustration illustKey={currentItem.illustKey} />
            </div>

            {/* Syllable display with live highlight */}
            <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
              {currentItem.syllables.map((syl, idx) => {
                const isHighlighted =
                  activeSyllableIdx === idx || activeSyllableIdx === -1;
                return (
                  <React.Fragment key={`${syl}-${idx}`}>
                    {idx > 0 && (
                      <span className="text-slate-400 font-bold text-2xl" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span
                      className={`font-display text-3xl sm:text-4xl font-extrabold px-2.5 py-1 rounded-xl transition-transform duration-150 ${
                        isHighlighted
                          ? 'bg-amber-300 text-slate-900 scale-110'
                          : idx % 2 === 0
                          ? 'text-sky-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {syl}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>

            <p className="text-sm text-slate-700 mt-3 font-medium">
              {currentItem.soundHint}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={handleSpeakLetterOnly}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Bunyi Huruf</span>
            </button>
            <button
              type="button"
              onClick={handleSpellWord}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Eja Kata</span>
            </button>
          </div>
        </div>

        {/* Right Alphabet Grid */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {filteredItems.map((item) => {
              const globalIdx = ALPHABET_ITEMS.findIndex(
                (x) => x.letter === item.letter
              );
              const isSelected = globalIdx === selectedIndex;

              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => handleSelectLetter(item, globalIdx)}
                  className={`min-h-[78px] flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isSelected
                      ? `${item.accentBg} ${item.accentBorder} scale-[1.03] shadow-sm`
                      : item.isVowel
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400 hover:-translate-y-0.5'
                      : 'bg-slate-50/70 border-slate-200 hover:border-sky-300 hover:bg-white hover:-translate-y-0.5'
                  }`}
                >
                  <span
                    className={`font-display text-2xl sm:text-3xl font-extrabold leading-none ${
                      isSelected ? item.accentText : 'text-slate-900'
                    }`}
                  >
                    {item.letter}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 mt-1.5 truncate max-w-full">
                    {item.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
