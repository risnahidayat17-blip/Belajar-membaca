import React, { useState } from 'react';
import {
  Volume2,
  Play,
  ChevronLeft,
  ChevronRight,
  Palette,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import {
  BACALAH_LESSONS,
  BacalahPageLesson,
  BacalahWord,
} from '../data/bacalahLessonsData';
import {
  cancelAllSpeech,
  playSuccessFanfare,
  playTapNote,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

interface BacalahBookProps {
  onEarnStar: () => void;
}

export const BacalahBook: React.FC<BacalahBookProps> = ({ onEarnStar }) => {
  // Default to page 6 ("dana - dan") matching the user's reference photo!
  const [selectedPageIdx, setSelectedPageIdx] = useState<number>(5);
  const [jilidFilter, setJilidFilter] = useState<1 | 2 | 3 | 'all'>('all');
  const [colorSyllables, setColorSyllables] = useState<boolean>(true);
  const [activeDrillIdx, setActiveDrillIdx] = useState<number | null>(null);
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [completedPageIds, setCompletedPageIds] = useState<string[]>([]);
  const [isReadingPage, setIsReadingPage] = useState<boolean>(false);

  const currentLesson: BacalahPageLesson = BACALAH_LESSONS[selectedPageIdx];
  const isCompleted = completedPageIds.includes(currentLesson.id);

  const visibleLessons =
    jilidFilter === 'all'
      ? BACALAH_LESSONS
      : BACALAH_LESSONS.filter((l) => l.jilid === jilidFilter);

  const handleSelectLesson = (lesson: BacalahPageLesson) => {
    cancelAllSpeech();
    setIsReadingPage(false);
    setActiveDrillIdx(null);
    setActiveLineIdx(null);
    const globalIdx = BACALAH_LESSONS.findIndex((x) => x.id === lesson.id);
    setSelectedPageIdx(globalIdx);
    playTapNote(globalIdx);
    speakIndonesian(`Halaman ${lesson.pageNumber}. ${lesson.titleAnchor.replace(/-/g, ' ')}`);
  };

  const handleTapDrillWord = (item: BacalahWord, idx: number) => {
    setIsReadingPage(false);
    setActiveLineIdx(null);
    setActiveDrillIdx(idx);
    if (colorSyllables && item.syllables.length > 1) {
      speakSyllablesSequence(
        item.syllables,
        item.word,
        () => {},
        () => setActiveDrillIdx(null)
      );
    } else {
      playTapNote(idx);
      speakIndonesian(item.word, {
        rate: 0.82,
        onEnd: () => setActiveDrillIdx(null),
      });
    }
  };

  const handleTapLine = (line: string, idx: number) => {
    setIsReadingPage(false);
    setActiveDrillIdx(null);
    setActiveLineIdx(idx);
    playTapNote(idx % 6);
    speakIndonesian(line, {
      rate: 0.84,
      onEnd: () => setActiveLineIdx(null),
    });
  };

  const handleReadFullPage = () => {
    cancelAllSpeech();
    setIsReadingPage(true);
    setActiveDrillIdx(null);
    setActiveLineIdx(null);

    const linesToRead = currentLesson.lines;
    let idx = 0;

    const readNextLine = () => {
      if (idx >= linesToRead.length) {
        setIsReadingPage(false);
        setActiveLineIdx(null);
        return;
      }
      const currentIdx = idx;
      setActiveLineIdx(currentIdx);
      idx++;
      speakIndonesian(linesToRead[currentIdx], {
        rate: 0.84,
        onEnd: () => {
          window.setTimeout(readNextLine, 180);
        },
      });
    };

    readNextLine();
  };

  const handleMarkPageDone = () => {
    if (!isCompleted) {
      setCompletedPageIds((prev) => [...prev, currentLesson.id]);
      onEarnStar();
    }
    playSuccessFanfare();
    speakIndonesian(`Hebat! Kamu selesai membaca halaman ${currentLesson.pageNumber}!`);
  };

  const handlePrevPage = () => {
    const prevIdx =
      (selectedPageIdx - 1 + BACALAH_LESSONS.length) % BACALAH_LESSONS.length;
    handleSelectLesson(BACALAH_LESSONS[prevIdx]);
  };

  const handleNextPage = () => {
    const nextIdx = (selectedPageIdx + 1) % BACALAH_LESSONS.length;
    handleSelectLesson(BACALAH_LESSONS[nextIdx]);
  };

  return (
    <section aria-labelledby="buku-bacalah-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Section Header + Jilid Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="buku-bacalah-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buku Bacalah — Cara Cepat Belajar Membaca
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Ketuk kata latihan dan baris bacaan di halaman buku untuk mendengar suaranya. Tersedia <span className="font-semibold text-slate-900 tabular-nums">{BACALAH_LESSONS.length}</span> halaman dari Jilid 1, 2, dan 3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {(
            [
              { id: 'all', label: 'Semua (15 Hal)' },
              { id: 1, label: 'Jilid 1' },
              { id: 2, label: 'Jilid 2' },
              { id: 3, label: 'Jilid 3' },
            ] as const
          ).map((tab) => (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => {
                playTapNote(0);
                setJilidFilter(tab.id);
              }}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                jilidFilter === tab.id
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
        {/* Left Sidebar: Daftar Halaman Buku Bacalah */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Daftar Halaman Buku</span>
            <span className="tabular-nums">
              Selesai: {completedPageIds.length}/{BACALAH_LESSONS.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {visibleLessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              const done = completedPageIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 text-slate-900 hover:border-sky-300 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div
                      className={`text-[11px] font-semibold ${
                        isSelected ? 'text-sky-100' : 'text-slate-500'
                      }`}
                    >
                      Hal. <span className="tabular-nums">{lesson.pageNumber}</span> · Jilid {lesson.jilid} · {lesson.focusLabel}
                    </div>
                    <div className="font-display text-base font-bold truncate mt-0.5">
                      {lesson.titleAnchor}
                    </div>
                  </div>
                  {done && (
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        isSelected ? 'text-amber-300' : 'text-emerald-600'
                      }`}
                      aria-label="Halaman selesai"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Stage: Interactive Open Storybook Page */}
        <div className="lg:col-span-8 bg-[#FFFCF3] border-2 border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Top Book Header Strip (matching the photo's page number + book title) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold text-slate-500 tabular-nums">
                {currentLesson.pageNumber}.
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-600 inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" aria-hidden="true" />
                <span>Bacalah, Cara Cepat Belajar Membaca {currentLesson.jilid}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapNote(1);
                  setColorSyllables((v) => !v);
                }}
                aria-pressed={colorSyllables}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  colorSyllables
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{colorSyllables ? 'Warna Suku Kata' : 'Teks Biasa'}</span>
              </button>

              <button
                type="button"
                onClick={handleReadFullPage}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>{isReadingPage ? 'Sedang Membaca...' : 'Baca Semua Baris'}</span>
              </button>
            </div>
          </div>

          {/* Anchor Title (e.g. "dana - dan" underlined) */}
          <div className="py-6 text-center">
            <button
              type="button"
              onClick={() => {
                playTapNote(2);
                speakIndonesian(currentLesson.titleAnchor.replace(/-/g, ' '));
              }}
              className="inline-block font-display text-3xl sm:text-4xl font-extrabold text-slate-900 underline decoration-2 underline-offset-8 decoration-slate-800 hover:text-sky-700 transition-colors cursor-pointer"
            >
              {currentLesson.titleAnchor}
            </button>
          </div>

          {/* 3-Column Drill Words Grid (just like the photo!) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl mx-auto mb-8">
            {currentLesson.drillWords.map((item, idx) => {
              const isLit = activeDrillIdx === idx;
              return (
                <button
                  key={`${currentLesson.id}-w-${idx}`}
                  type="button"
                  onClick={() => handleTapDrillWord(item, idx)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isLit
                      ? 'bg-amber-200 border-amber-400 scale-105 shadow-sm'
                      : 'bg-white/90 border-amber-200/70 hover:border-sky-400 hover:bg-white'
                  }`}
                >
                  <span className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                    {colorSyllables
                      ? item.syllables.map((syl, sIdx) => (
                          <span
                            key={sIdx}
                            className={
                              sIdx % 2 === 0 ? 'text-slate-900' : 'text-rose-600'
                            }
                          >
                            {syl}
                          </span>
                        ))
                      : item.word}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rhythmic Reading Lines (matching the 6-8 lines below in the photo) */}
          <div className="space-y-2 max-w-2xl mx-auto">
            {currentLesson.lines.map((line, idx) => {
              const isLineActive = activeLineIdx === idx;
              return (
                <button
                  key={`${currentLesson.id}-l-${idx}`}
                  type="button"
                  onClick={() => handleTapLine(line, idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isLineActive
                      ? 'bg-amber-200/90 border-amber-400 text-slate-900 scale-[1.01]'
                      : 'bg-white/80 border-amber-100 text-slate-900 hover:bg-sky-50/70 hover:border-sky-300'
                  }`}
                >
                  <span className="font-display text-lg sm:text-2xl font-semibold tracking-tight leading-snug">
                    {line}
                  </span>
                  <Volume2
                    className={`w-4 h-4 shrink-0 ${
                      isLineActive ? 'text-amber-900' : 'text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Book Navigation & Star Reward */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-amber-200/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Halaman Sebelumnya</span>
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer"
              >
                <span>Halaman Berikutnya</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleMarkPageDone}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>
                {isCompleted ? 'Halaman Sudah Dibaca' : 'Selesai Baca & Dapat Bintang'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
