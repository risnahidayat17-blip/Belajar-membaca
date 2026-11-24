import React, { useState } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { AlphabetExplorer } from './AlphabetExplorer';
import { SyllableBuilder } from './SyllableBuilder';
import { PictureWords } from './PictureWords';
import { BacalahBook } from './BacalahBook';
import { READING_PASSAGES, ReadingPassage, SdGrade } from '../data/calistungData';
import { WordIllustration } from './WordIllustration';
import {
  playSuccessFanfare,
  playTapNote,
  playTryAgainSound,
  speakIndonesian,
} from '../utils/soundEngine';

interface ReadingHubProps {
  onEarnStar: () => void;
}

type ReadingSubTab = 'bacalah' | 'huruf' | 'sukukata' | 'kata' | 'cerita';

export const ReadingHub: React.FC<ReadingHubProps> = ({ onEarnStar }) => {
  const [subTab, setSubTab] = useState<ReadingSubTab>('bacalah');
  const [gradeFilter, setGradeFilter] = useState<SdGrade | 'all'>('all');
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    READING_PASSAGES[0].id
  );
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(false);
  const [wrongAnswerIdx, setWrongAnswerIdx] = useState<number | null>(null);

  const filteredPassages =
    gradeFilter === 'all'
      ? READING_PASSAGES
      : READING_PASSAGES.filter((p) => p.grade === gradeFilter);

  const currentPassage: ReadingPassage =
    filteredPassages.find((p) => p.id === selectedPassageId) ||
    filteredPassages[0];

  const handleSelectPassage = (p: ReadingPassage, idx: number) => {
    playTapNote(idx);
    setSelectedPassageId(p.id);
    setActiveSentenceIdx(null);
    setAnsweredCorrectly(false);
    setWrongAnswerIdx(null);
  };

  const handleReadSentence = (sentence: string, idx: number) => {
    playTapNote(idx);
    setActiveSentenceIdx(idx);
    speakIndonesian(sentence, {
      rate: 0.85,
      onEnd: () => setActiveSentenceIdx(null),
    });
  };

  const handleReadWholeStory = () => {
    playTapNote(0);
    setActiveSentenceIdx(-1);
    const fullStory = `${currentPassage.title}. ${currentPassage.sentences.join(' ')}`;
    speakIndonesian(fullStory, {
      rate: 0.84,
      onEnd: () => setActiveSentenceIdx(null),
    });
  };

  const handleAnswerQuestion = (idx: number) => {
    if (answeredCorrectly) return;
    if (idx === currentPassage.answerIdx) {
      setAnsweredCorrectly(true);
      setWrongAnswerIdx(null);
      onEarnStar();
      playSuccessFanfare();
      speakIndonesian('Pintar sekali! Jawabanmu benar!');
    } else {
      setWrongAnswerIdx(idx);
      playTryAgainSound();
      speakIndonesian('Coba baca lagi ceritanya pelan-pelan ya!');
    }
  };

  return (
    <div>
      {/* Sub-navigation for Membaca */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3">
        <div className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 rounded-xl">
          {(
            [
              { id: 'bacalah', label: 'Buku Bacalah (20 Hal)' },
              { id: 'huruf', label: 'Huruf A–Z' },
              { id: 'sukukata', label: 'Suku Kata' },
              { id: 'kata', label: 'Kata Bergambar' },
              { id: 'cerita', label: 'Cerita SD 1–3' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playTapNote(0);
                setSubTab(tab.id);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subTab === tab.id
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {subTab === 'bacalah' && <BacalahBook onEarnStar={onEarnStar} />}
      {subTab === 'huruf' && <AlphabetExplorer />}
      {subTab === 'sukukata' && <SyllableBuilder />}
      {subTab === 'kata' && <PictureWords />}

      {subTab === 'cerita' && (
        <section aria-labelledby="cerita-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 id="cerita-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                Bacaan Pendek Kelas 1, 2, 3 SD
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Ketuk setiap kalimat untuk mendengar bacaannya, lalu jawab pertanyaan pemahaman di bawah.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
              {(
                [
                  { id: 'all', label: 'Semua Kelas' },
                  { id: 1, label: 'Kelas 1' },
                  { id: 2, label: 'Kelas 2' },
                  { id: 3, label: 'Kelas 3' },
                ] as const
              ).map((tab) => (
                <button
                  key={String(tab.id)}
                  type="button"
                  onClick={() => {
                    playTapNote(0);
                    setGradeFilter(tab.id);
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    gradeFilter === tab.id
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
            {/* Story List */}
            <div className="lg:col-span-4 space-y-3">
              {filteredPassages.map((p, idx) => {
                const isSelected = p.id === currentPassage.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPassage(p, idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-sky-300'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 shrink-0">
                      <WordIllustration illustKey={p.illustKey} />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-sky-100' : 'text-sky-700'
                        }`}
                      >
                        Kelas {p.grade} SD
                      </div>
                      <div className="font-display text-base font-bold truncate">
                        {p.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Story Reader & Comprehension Question */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 p-2 shrink-0">
                    <WordIllustration illustKey={currentPassage.illustKey} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-700">
                      Bacaan Kelas {currentPassage.grade} SD
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-slate-900">
                      {currentPassage.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReadWholeStory}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>Bacakan Cerita</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {currentPassage.sentences.map((sentence, idx) => {
                  const isActive =
                    activeSentenceIdx === idx || activeSentenceIdx === -1;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleReadSentence(sentence, idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 border-amber-300 text-slate-900'
                          : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-sky-50/60 hover:border-sky-300'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-medium leading-relaxed">
                        {sentence}
                      </span>
                      <Volume2
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-amber-700' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Comprehension Check */}
              <div className="pt-5 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 mb-1.5">
                  Pertanyaan Pemahaman Bacaan
                </div>
                <p className="font-display text-lg font-bold text-slate-900 mb-3">
                  {currentPassage.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentPassage.options.map((opt, idx) => {
                    const isRight = answeredCorrectly && idx === currentPassage.answerIdx;
                    const isWrong = wrongAnswerIdx === idx;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerQuestion(idx)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-all cursor-pointer ${
                          isRight
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : isWrong
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-sky-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {answeredCorrectly && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-sm font-semibold text-emerald-900 animate-gentle-pop">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span>Bagus! Kamu memahami isi bacaan dengan baik dan mendapat 1 bintang.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
