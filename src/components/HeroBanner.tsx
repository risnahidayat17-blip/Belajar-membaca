import React from 'react';
import { Volume2, Star } from 'lucide-react';
import { GENERATED_IMAGES } from '../data/bacalahData';
import { StorybookImage } from './StorybookImage';
import { LearningMode } from './Header';
import { playTapNote, speakIndonesian } from '../utils/soundEngine';

interface HeroBannerProps {
  activeMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  starsEarned: number;
}

const MODE_CARDS: {
  id: LearningMode;
  title: string;
  subtitle: string;
  accentClass: string;
}[] = [
  {
    id: 'baca',
    title: '01. Membaca',
    subtitle: 'Buku Bacalah 1–3, huruf & cerita',
    accentClass: 'hover:border-sky-400',
  },
  {
    id: 'susun',
    title: '02. Susun Kata',
    subtitle: 'Urutkan suku kata & kalimat',
    accentClass: 'hover:border-indigo-400',
  },
  {
    id: 'tulis',
    title: '03. Menulis',
    subtitle: 'Latihan tulis huruf & angka',
    accentClass: 'hover:border-amber-400',
  },
  {
    id: 'hitung',
    title: '04. Berhitung',
    subtitle: 'Hitung seru kelas 1, 2, 3 SD',
    accentClass: 'hover:border-emerald-400',
  },
  {
    id: 'kuis',
    title: '05. Kuis Seru',
    subtitle: 'Kumpulkan bintang sambil main',
    accentClass: 'hover:border-rose-400',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeMode,
  onSelectMode,
  starsEarned,
}) => {
  const handleMascotGreeting = () => {
    playTapNote(2);
    speakIndonesian(
      'Halo adik pintar! Ayo belajar calistung bersama: membaca, menulis, menyusun kata, dan berhitung untuk TK serta kelas satu, dua, dan tiga SD!'
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs font-semibold text-sky-700 tracking-wide">
                Calistung TK & SD Kelas 1, 2, 3 · Baca · Tulis · Hitung
              </span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 tabular-nums">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                <span>{starsEarned} Bintang</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight text-balance">
              Belajar Calistung Jadi Seru dengan Gambar & Suara
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
              Latihan membaca huruf dan cerita pendek, menyusun kata, menulis halus di papan garis, serta berhitung angka kelas 1, 2, dan 3 SD.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleMascotGreeting}
              className="flex items-center gap-3.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1 -m-1"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-200 shrink-0 bg-amber-50">
                <StorybookImage
                  src={GENERATED_IMAGES.mascot}
                  alt="Kak Burung Hantu pemandu belajar"
                  className="w-full h-full object-cover"
                  fallbackTitle="Kak Hantu"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  <Volume2 className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                  <span>Sapa Kak Burung Hantu</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ketuk untuk mendengarkan sambutan suara
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-amber-50 min-h-[220px]">
          <StorybookImage
            src={GENERATED_IMAGES.hero}
            alt="Anak-anak TK ceria membaca buku bergambar di taman"
            className="w-full h-full object-cover"
            fallbackTitle="Anak TK Ceria Membaca"
          />
        </div>
      </div>

      {/* Mode Switcher Strip (Mobile + Desktop Quick Jump) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
        {MODE_CARDS.map((card) => {
          const isSelected = activeMode === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                playTapNote(1);
                onSelectMode(card.id);
              }}
              className={`text-left px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isSelected
                  ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                  : `bg-white border-slate-200 text-slate-900 ${card.accentClass}`
              }`}
            >
              <div className="font-display text-sm sm:text-base font-bold truncate">
                {card.title}
              </div>
              <div
                className={`text-xs mt-0.5 truncate ${
                  isSelected ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {card.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
