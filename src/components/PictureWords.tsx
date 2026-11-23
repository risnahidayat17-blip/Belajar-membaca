import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import {
  CATEGORY_META,
  PICTURE_WORDS,
  WordCardItem,
  WordCategory,
} from '../data/bacalahData';
import { WordIllustration } from './WordIllustration';
import { StorybookImage } from './StorybookImage';
import {
  playTapNote,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

type FilterType = 'all' | WordCategory;

const ACCENT_STYLES: Record<WordCardItem['accentColor'], string> = {
  sky: 'bg-sky-50/70 border-sky-200',
  amber: 'bg-amber-50/70 border-amber-200',
  rose: 'bg-rose-50/70 border-rose-200',
  emerald: 'bg-emerald-50/70 border-emerald-200',
  indigo: 'bg-indigo-50/70 border-indigo-200',
};

export const PictureWords: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const [activeSylIndex, setActiveSylIndex] = useState<number | null>(null);

  const visibleWords =
    filter === 'all'
      ? PICTURE_WORDS
      : PICTURE_WORDS.filter((w) => w.category === filter);

  const handleSlowRead = (item: WordCardItem) => {
    setSpeakingCardId(item.id);
    speakSyllablesSequence(
      item.syllables,
      item.word,
      (idx) => setActiveSylIndex(idx),
      () => {
        setSpeakingCardId(null);
        setActiveSylIndex(null);
      }
    );
  };

  const handleNormalRead = (item: WordCardItem, idx: number) => {
    playTapNote(idx);
    setSpeakingCardId(item.id);
    setActiveSylIndex(-1);
    speakIndonesian(`${item.word}. ${item.funFact}`, {
      onEnd: () => {
        setSpeakingCardId(null);
        setActiveSylIndex(null);
      },
    });
  };

  return (
    <section aria-labelledby="kata-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="kata-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kata Bergambar Warna-Warni
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Pilih tema kesukaanmu, ketuk tombol Eja Pelan untuk membaca suku kata demi suku kata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {(
            [
              { id: 'all', label: 'Semua Tema' },
              { id: 'hewan', label: 'Hewan' },
              { id: 'buah', label: 'Buah & Makanan' },
              { id: 'benda', label: 'Benda' },
              { id: 'alam', label: 'Alam' },
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

      {/* Generated Theme Illustration Gallery / Spotlight */}
      {filter === 'all' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {(Object.keys(CATEGORY_META) as WordCategory[]).map((catKey, idx) => {
            const meta = CATEGORY_META[catKey];
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => {
                  playTapNote(idx);
                  setFilter(catKey);
                  speakIndonesian(`Tema ${meta.label}`);
                }}
                className="group text-left bg-white border border-slate-200 hover:border-sky-400 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <div className="aspect-[4/3] bg-amber-50 overflow-hidden">
                  <StorybookImage
                    src={meta.image}
                    alt={meta.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackTitle={meta.label}
                  />
                </div>
                <div className="p-3.5">
                  <div className="font-display text-base font-bold text-slate-900">
                    {meta.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    Ketuk untuk membuka tema
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden mb-7">
          <div className="md:col-span-4 aspect-[4/3] md:aspect-auto bg-amber-50">
            <StorybookImage
              src={CATEGORY_META[filter].image}
              alt={CATEGORY_META[filter].label}
              className="w-full h-full object-cover"
              fallbackTitle={CATEGORY_META[filter].label}
            />
          </div>
          <div className="md:col-span-8 p-6 flex flex-col justify-center gap-2">
            <span className="text-xs font-semibold text-sky-700">
              Tema Pilihan · <span className="tabular-nums">{visibleWords.length}</span> Kata Bergambar
            </span>
            <h3 className="font-display text-2xl font-extrabold text-slate-900">
              {CATEGORY_META[filter].label}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              {CATEGORY_META[filter].description}
            </p>
          </div>
        </div>
      )}

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleWords.map((item, idx) => {
          const isThisCardSpeaking = speakingCardId === item.id;

          return (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-shadow hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">
                  <span>{CATEGORY_META[item.category].label}</span>
                  <span className="tabular-nums">{item.syllables.length} Suku Kata</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNormalRead(item, idx)}
                  className={`w-full rounded-xl p-4 border flex flex-col items-center justify-center gap-3 cursor-pointer transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    ACCENT_STYLES[item.accentColor]
                  }`}
                >
                  <div className="w-28 h-28">
                    <WordIllustration illustKey={item.illustKey} />
                  </div>

                  {/* Syllable-colored word */}
                  <div className="flex items-center justify-center flex-wrap gap-1">
                    {item.syllables.map((syl, sIdx) => {
                      const isLit =
                        isThisCardSpeaking &&
                        (activeSylIndex === sIdx || activeSylIndex === -1);
                      return (
                        <React.Fragment key={`${item.id}-${sIdx}`}>
                          {sIdx > 0 && (
                            <span className="text-slate-400 font-bold text-lg" aria-hidden="true">
                              ·
                            </span>
                          )}
                          <span
                            className={`font-display text-2xl font-extrabold px-2 py-0.5 rounded-lg transition-transform ${
                              isLit
                                ? 'bg-amber-300 text-slate-900 scale-110'
                                : sIdx % 2 === 0
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
                </button>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {item.funFact}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSlowRead(item)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Eja Pelan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNormalRead(item, idx)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Baca Kata</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
