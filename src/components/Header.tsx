import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export type LearningMode = 'baca' | 'susun' | 'tulis' | 'hitung' | 'kuis';

interface HeaderProps {
  activeMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const NAV_ITEMS: { id: LearningMode; label: string }[] = [
  { id: 'baca', label: 'Membaca' },
  { id: 'susun', label: 'Susun Kata' },
  { id: 'tulis', label: 'Menulis' },
  { id: 'hitung', label: 'Berhitung' },
  { id: 'kuis', label: 'Kuis Seru' },
];

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sky-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectMode('baca')}
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md"
        >
          Bacalah Ceria
        </button>

        <nav
          aria-label="Menu belajar"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMode(item.id)}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-sm ${
                  isActive
                    ? 'text-sky-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sky-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              soundEnabled
                ? 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-600'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:ring-slate-500'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{soundEnabled ? 'Suara Aktif' : 'Suara Mati'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
