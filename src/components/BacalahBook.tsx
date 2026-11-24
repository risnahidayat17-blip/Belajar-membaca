import React, { useMemo, useState } from 'react';
import {
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
import { WordIllustration } from './WordIllustration';
import {
  cancelAllSpeech,
  getIndonesianVoiceLabel,
  playSuccessFanfare,
  playTapNote,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

interface BacalahBookProps {
  onEarnStar: () => void;
}

interface BookSpread {
  id: string;
  label: string;
  jilid: 1 | 2 | 3 | 4;
  leftPage: BacalahPageLesson;
  rightPage: BacalahPageLesson;
}

const ACCENT_RIBBON: Record<BacalahPageLesson['accentTheme'], string> = {
  sky: 'bg-sky-600 text-white',
  rose: 'bg-rose-500 text-white',
  amber: 'bg-amber-400 text-slate-900',
  emerald: 'bg-emerald-600 text-white',
  indigo: 'bg-indigo-600 text-white',
};

const ACCENT_CORE_BG: Record<BacalahPageLesson['accentTheme'], string> = {
  sky: 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100',
  rose: 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100',
  amber: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100',
  emerald: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100',
  indigo: 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100',
};

const ACCENT_ILLUSTRATION_BG: Record<BacalahPageLesson['accentTheme'], string> = {
  sky: 'bg-sky-50 border-sky-200',
  rose: 'bg-rose-50 border-rose-200',
  amber: 'bg-amber-50 border-amber-200',
  emerald: 'bg-emerald-50 border-emerald-200',
  indigo: 'bg-indigo-50 border-indigo-200',
};

export const BacalahBook: React.FC<BacalahBookProps> = ({ onEarnStar }) => {
  const spreads: BookSpread[] = useMemo(() => {
    const pairs: BookSpread[] = [];
    for (let i = 0; i < BACALAH_LESSONS.length; i += 2) {
      const left = BACALAH_LESSONS[i];
      const right = BACALAH_LESSONS[i + 1];
      if (left && right) {
        pairs.push({
          id: `sp-${left.pageNumber}-${right.pageNumber}`,
          label: `Hal. ${left.pageNumber}–${right.pageNumber}`,
          jilid: left.jilid,
          leftPage: left,
          rightPage: right,
        });
      }
    }
    return pairs;
  }, []);

  const [jilidFilter, setJilidFilter] = useState<1 | 2 | 3 | 4 | 'all'>('all');
  const [spreadIdx, setSpreadIdx] = useState<number>(0);
  const [colorSyllables, setColorSyllables] = useState<boolean>(true);
  const [activeTargetKey, setActiveTargetKey] = useState<string | null>(null);
  const [completedPageIds, setCompletedPageIds] = useState<string[]>([]);
  const [readingPageId, setReadingPageId] = useState<string | null>(null);

  const visibleSpreads = useMemo(
    () =>
      jilidFilter === 'all'
        ? spreads
        : spreads.filter(
            (s) => s.leftPage.jilid === jilidFilter || s.rightPage.jilid === jilidFilter
          ),
    [jilidFilter, spreads]
  );

  const currentSpread = visibleSpreads[spreadIdx] || visibleSpreads[0];
  const voiceLabel = getIndonesianVoiceLabel();

  const handleSelectJilid = (nextJilid: 1 | 2 | 3 | 4 | 'all') => {
    cancelAllSpeech();
    setReadingPageId(null);
    setActiveTargetKey(null);
    setJilidFilter(nextJilid);
    setSpreadIdx(0);
    playTapNote(0);
  };

  const handleSelectSpread = (idx: number) => {
    cancelAllSpeech();
    setReadingPageId(null);
    setActiveTargetKey(null);
    setSpreadIdx(idx);
    playTapNote(idx);
  };

  const handleTapCoreSyllable = (pageId: string, syl: string, idx: number) => {
    setReadingPageId(null);
    const key = `${pageId}-core-${idx}`;
    setActiveTargetKey(key);
    playTapNote(idx);
    const clean = syl.replace(/-/g, ' ');
    speakIndonesian(clean, {
      rate: 0.68,
      onEnd: () => setActiveTargetKey(null),
    });
  };

  const handleTapDrillWord = (pageId: string, item: BacalahWord, idx: number) => {
    setReadingPageId(null);
    const key = `${pageId}-w-${idx}`;
    setActiveTargetKey(key);
    speakSyllablesSequence(
      item.syllables,
      item.word,
      () => {},
      () => setActiveTargetKey(null)
    );
  };

  const handleReadAllCoreSyllables = (lesson: BacalahPageLesson) => {
    cancelAllSpeech();
    setReadingPageId(lesson.id);
    let idx = 0;

    const next = () => {
      if (idx >= lesson.coreSyllables.length) {
        setReadingPageId(null);
        setActiveTargetKey(null);
        return;
      }
      const cur = idx;
      setActiveTargetKey(`${lesson.id}-core-${cur}`);
      playTapNote(cur);
      idx++;
      speakIndonesian(lesson.coreSyllables[cur].replace(/-/g, ' '), {
        rate: 0.68,
        onEnd: () => window.setTimeout(next, 240),
      });
    };

    next();
  };

  const handleMarkPageDone = (lesson: BacalahPageLesson) => {
    if (!completedPageIds.includes(lesson.id)) {
      setCompletedPageIds((prev) => [...prev, lesson.id]);
      onEarnStar();
    }
    playSuccessFanfare();
    speakIndonesian(`Hebat! Kamu selesai membaca suku kata halaman ${lesson.pageNumber}!`);
  };

  const renderSyllablePage = (lesson: BacalahPageLesson, side: 'left' | 'right') => {
    const done = completedPageIds.includes(lesson.id);
    const isReadingThisPage = readingPageId === lesson.id;

    return (
      <article className="p-5 sm:p-6 flex flex-col justify-between gap-4 bg-[#FFFCF4] h-full">
        <div>
          {/* Magazine Running Header */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-200/80">
            {side === 'left' ? (
              <>
                <span className="font-display text-sm font-extrabold text-slate-600 tabular-nums">
                  {lesson.pageNumber}.
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  Majalah Bacalah Suku Kata · Jilid {lesson.jilid}
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                  Majalah Bacalah Suku Kata · Jilid {lesson.jilid}
                </span>
                <span className="font-display text-sm font-extrabold text-slate-600 tabular-nums">
                  {lesson.pageNumber}.
                </span>
              </>
            )}
          </div>

          {/* Feature Header + Illustration */}
          <div className="flex items-center justify-between gap-3 mt-3.5 mb-4">
            <div className="min-w-0">
              <span
                className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                  ACCENT_RIBBON[lesson.accentTheme]
                }`}
              >
                {lesson.focusLabel}
              </span>
              <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-slate-900 underline decoration-2 underline-offset-4 decoration-slate-800">
                {lesson.titleAnchor}
              </h3>
            </div>

            <div
              className={`w-16 h-16 rounded-2xl border p-1.5 shrink-0 ${
                ACCENT_ILLUSTRATION_BG[lesson.accentTheme]
              }`}
            >
              <WordIllustration illustKey={lesson.illustKey} />
            </div>
          </div>

          {/* Core Syllable Strip (ba bi bu be bo) */}
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-500 mb-2">
              Suku Kata Inti (Ketuk satu per satu)
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {lesson.coreSyllables.map((syl, idx) => {
                const key = `${lesson.id}-core-${idx}`;
                const isLit = activeTargetKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTapCoreSyllable(lesson.id, syl, idx)}
                    className={`py-2 px-1 rounded-xl border-2 font-display text-lg sm:text-xl font-extrabold text-center transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      isLit
                        ? 'bg-amber-300 border-amber-500 text-slate-900 scale-105 shadow-sm'
                        : ACCENT_CORE_BG[lesson.accentTheme]
                    }`}
                  >
                    {syl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 18 Full Syllable Drills Grid (3 columns x 6 rows) */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-2">
              Latihan Gabungan Suku Kata (Ketuk untuk Eja & Baca)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {lesson.drillWords.map((item, idx) => {
                const key = `${lesson.id}-w-${idx}`;
                const isLit = activeTargetKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTapDrillWord(lesson.id, item, idx)}
                    className={`py-2.5 px-1.5 rounded-xl border text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      isLit
                        ? 'bg-amber-200 border-amber-400 scale-105 shadow-sm'
                        : 'bg-white border-amber-200/70 hover:border-sky-400'
                    }`}
                  >
                    <span className="font-display text-base sm:text-lg font-extrabold tracking-tight">
                      {colorSyllables ? (
                        item.syllables.map((syl, sIdx) => (
                          <React.Fragment key={sIdx}>
                            {sIdx > 0 && (
                              <span className="text-slate-300 font-normal mx-0.5">-</span>
                            )}
                            <span
                              className={
                                sIdx % 2 === 0
                                  ? 'text-sky-800'
                                  : sIdx % 3 === 1
                                  ? 'text-rose-600'
                                  : 'text-emerald-700'
                              }
                            >
                              {syl}
                            </span>
                          </React.Fragment>
                        ))
                      ) : (
                        item.syllables.join('-')
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200/80">
          <button
            type="button"
            onClick={() => handleReadAllCoreSyllables(lesson)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{isReadingThisPage ? 'Sedang Membaca...' : 'Baca Suku Kata Inti'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleMarkPageDone(lesson)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              done
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{done ? 'Sudah Dibaca' : 'Tandai Selesai'}</span>
          </button>
        </div>
      </article>
    );
  };

  return (
    <section aria-labelledby="buku-bacalah-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
        <div>
          <h2 id="buku-bacalah-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buku & Majalah Bacalah — Penuh Suku Kata
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            20 halaman penuh suku kata (A–Z, akhiran konsonan, ng, dan ny). Suara Indonesia aktif:{' '}
            <span className="font-semibold text-sky-700">{voiceLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playTapNote(1);
              setColorSyllables((v) => !v);
            }}
            aria-pressed={colorSyllables}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              colorSyllables
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" aria-hidden="true" />
            <span>{colorSyllables ? 'Warna Suku Kata' : 'Teks Polos'}</span>
          </button>

          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl tabular-nums">
            Selesai: {completedPageIds.length}/{BACALAH_LESSONS.length} Hal
          </span>
        </div>
      </div>

      {/* Jilid Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl mb-3 self-start w-fit">
        {(
          [
            { id: 'all', label: 'Semua (20 Hal)' },
            { id: 1, label: 'Jilid 1: Dasar (B–M)' },
            { id: 2, label: 'Jilid 2: Lanjut (N–Z)' },
            { id: 3, label: 'Jilid 3: Akhiran (-n, -m, -r, -s, -t)' },
            { id: 4, label: 'Jilid 4: ng & ny' },
          ] as const
        ).map((tab) => (
          <button
            key={String(tab.id)}
            type="button"
            onClick={() => handleSelectJilid(tab.id)}
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

      {/* Spread Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/90 border border-slate-200 rounded-2xl mb-5">
        {visibleSpreads.map((sp, idx) => {
          const isCurrent = idx === spreadIdx;
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => handleSelectSpread(idx)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-sky-50 hover:text-sky-800'
              }`}
            >
              {sp.label}
            </button>
          );
        })}
      </div>

      {/* Open Two-Page Magazine / Book Spread */}
      <div className="relative rounded-3xl border-4 border-amber-300/90 bg-amber-100/60 p-2 sm:p-3 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-amber-200 bg-[#FFFCF4] relative">
          {/* Center Book Spine Shadow */}
          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent z-10"
          />

          <div className="border-b lg:border-b-0 lg:border-r border-amber-200/80">
            {renderSyllablePage(currentSpread.leftPage, 'left')}
          </div>

          <div>{renderSyllablePage(currentSpread.rightPage, 'right')}</div>
        </div>
      </div>

      {/* Bottom Book Page-Flip Controls */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <button
          type="button"
          onClick={() =>
            handleSelectSpread(
              (spreadIdx - 1 + visibleSpreads.length) % visibleSpreads.length
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Balik Halaman Sebelumnya</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
          <BookOpen className="w-4 h-4 text-amber-700" aria-hidden="true" />
          <span className="tabular-nums">
            Lembar {spreadIdx + 1} dari {visibleSpreads.length} · Jilid {currentSpread.jilid}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            handleSelectSpread((spreadIdx + 1) % visibleSpreads.length)
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Balik Halaman Berikutnya</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
