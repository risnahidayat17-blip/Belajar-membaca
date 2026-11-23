import React, { useState } from 'react';
import { Volume2, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  generateMathQuestion,
  MathQuestion,
  SdGrade,
} from '../data/calistungData';
import { WordIllustration } from './WordIllustration';
import {
  playSuccessFanfare,
  playTapNote,
  playTryAgainSound,
  speakIndonesian,
} from '../utils/soundEngine';

interface MathExplorerProps {
  onEarnStar: () => void;
}

const GRADE_DESC: Record<SdGrade, string> = {
  1: 'Penjumlahan dan pengurangan bilangan 1–20 dengan gambar benda yang dapat dihitung.',
  2: 'Penjumlahan, pengurangan puluhan, serta pengenalan perkalian dasar dalam kelompok.',
  3: 'Perkalian lanjutan, pembagian sama rata, dan latihan soal cerita berhitung.',
};

export const MathExplorer: React.FC<MathExplorerProps> = ({ onEarnStar }) => {
  const [grade, setGrade] = useState<SdGrade>(1);
  const [question, setQuestion] = useState<MathQuestion>(() =>
    generateMathQuestion(1)
  );
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);
  const [solved, setSolved] = useState<boolean>(false);
  const [countedIdx, setCountedIdx] = useState<number | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const loadNewQuestion = (targetGrade: SdGrade) => {
    const next = generateMathQuestion(targetGrade);
    setQuestion(next);
    setWrongOptions([]);
    setSolved(false);
    setCountedIdx(null);
  };

  const handleSelectGrade = (nextGrade: SdGrade) => {
    playTapNote(nextGrade - 1);
    setGrade(nextGrade);
    loadNewQuestion(nextGrade);
    speakIndonesian(`Berhitung kelas ${nextGrade} SD!`);
  };

  const handleSpeakQuestion = () => {
    playTapNote(1);
    speakIndonesian(question.spokenPrompt);
  };

  const handleTapCounterItem = (numberOrder: number) => {
    setCountedIdx(numberOrder);
    playTapNote(numberOrder - 1);
    speakIndonesian(String(numberOrder), { rate: 0.95 });
  };

  const handleSelectAnswer = (opt: number) => {
    if (solved) return;
    if (opt === question.answer) {
      setSolved(true);
      setSolvedCount((c) => c + 1);
      onEarnStar();
      playSuccessFanfare();
      speakIndonesian(
        `Benar sekali! ${question.a} ${
          question.operator === '+'
            ? 'ditambah'
            : question.operator === '-'
            ? 'dikurangi'
            : question.operator === '×'
            ? 'dikali'
            : 'dibagi'
        } ${question.b} sama dengan ${question.answer}!`
      );
    } else {
      if (!wrongOptions.includes(opt)) {
        setWrongOptions((prev) => [...prev, opt]);
      }
      playTryAgainSound();
      speakIndonesian(`Bukan ${opt}, ayo hitung lagi pelan-pelan ya!`);
    }
  };

  const renderVisualAid = () => {
    // Kelas 1: Clickable individual objects to count
    if (question.grade === 1 && question.operator === '+') {
      return (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-wrap justify-center gap-1.5 p-3 rounded-xl bg-sky-50 border border-sky-200 max-w-xs">
            {Array.from({ length: question.a }).map((_, i) => (
              <button
                key={`a-${i}`}
                type="button"
                onClick={() => handleTapCounterItem(i + 1)}
                className={`w-10 h-10 transition-transform cursor-pointer ${
                  countedIdx === i + 1 ? 'scale-125' : 'hover:scale-110'
                }`}
                title={`Hitung ${i + 1}`}
              >
                <WordIllustration illustKey={question.visualItem} />
              </button>
            ))}
          </div>

          <span className="font-display text-3xl font-extrabold text-slate-500">+</span>

          <div className="flex flex-wrap justify-center gap-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200 max-w-xs">
            {Array.from({ length: question.b }).map((_, i) => {
              const order = question.a + i + 1;
              return (
                <button
                  key={`b-${i}`}
                  type="button"
                  onClick={() => handleTapCounterItem(order)}
                  className={`w-10 h-10 transition-transform cursor-pointer ${
                    countedIdx === order ? 'scale-125' : 'hover:scale-110'
                  }`}
                  title={`Hitung ${order}`}
                >
                  <WordIllustration illustKey={question.visualItem} />
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.grade === 1 && question.operator === '-') {
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 p-3 rounded-xl bg-rose-50/70 border border-rose-200 max-w-md">
            {Array.from({ length: question.a }).map((_, i) => {
              const isRemoved = i >= question.answer;
              return (
                <button
                  key={`sub-${i}`}
                  type="button"
                  onClick={() => !isRemoved && handleTapCounterItem(i + 1)}
                  className={`relative w-10 h-10 transition-transform ${
                    isRemoved
                      ? 'opacity-30 grayscale cursor-default'
                      : 'cursor-pointer hover:scale-110'
                  }`}
                >
                  <WordIllustration illustKey={question.visualItem} />
                  {isRemoved && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-display text-xl font-extrabold text-rose-700"
                    >
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-xs font-medium text-slate-500">
            Ketuk gambar yang terang untuk menghitung sisanya
          </span>
        </div>
      );
    }

    // Multiplication: show groups of baskets
    if (question.operator === '×' && question.a <= 6 && question.b <= 6) {
      return (
        <div className="flex flex-wrap justify-center gap-2.5">
          {Array.from({ length: question.a }).map((_, gIdx) => (
            <div
              key={`grp-${gIdx}`}
              className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap gap-1 max-w-[130px] justify-center"
            >
              {Array.from({ length: question.b }).map((__, iIdx) => (
                <div key={`item-${gIdx}-${iIdx}`} className="w-7 h-7">
                  <WordIllustration illustKey={question.visualItem} />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Division: show equal groups
    if (question.operator === '÷') {
      return (
        <div className="flex flex-wrap justify-center gap-2.5">
          {Array.from({ length: question.b }).map((_, gIdx) => (
            <div
              key={`div-${gIdx}`}
              className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center gap-1"
            >
              <span className="text-[11px] font-bold text-emerald-700">
                Anak {gIdx + 1}
              </span>
              <div className="flex flex-wrap gap-1 max-w-[110px] justify-center">
                {Array.from({ length: question.answer }).map((__, iIdx) => (
                  <div key={`ditem-${gIdx}-${iIdx}`} className="w-6 h-6">
                    <WordIllustration illustKey={question.visualItem} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Grade 2 tens addition/subtraction: Place value breakdown (Puluhan & Satuan)
    const aTens = Math.floor(question.a / 10);
    const aOnes = question.a % 10;
    const bTens = Math.floor(question.b / 10);
    const bOnes = question.b % 10;

    return (
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-semibold tabular-nums">
          {question.a} = {aTens} puluhan + {aOnes} satuan
        </div>
        <span className="font-display text-2xl font-extrabold text-slate-500">
          {question.operator}
        </span>
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold tabular-nums">
          {question.b} = {bTens} puluhan + {bOnes} satuan
        </div>
      </div>
    );
  };

  return (
    <section aria-labelledby="berhitung-heading" className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="berhitung-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Berhitung Seru Kelas 1, 2, 3 SD
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            {GRADE_DESC[grade]}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {([1, 2, 3] as SdGrade[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleSelectGrade(g)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                grade === g
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas {g} SD
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-600">
            Tingkat <strong className="text-slate-900">Kelas {grade} SD</strong> · Soal terjawab:{' '}
            <strong className="text-emerald-700 tabular-nums">{solvedCount}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSpeakQuestion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>Bacakan Soal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTapNote(0);
                loadNewQuestion(grade);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Ganti Soal</span>
            </button>
          </div>
        </div>

        {/* Problem Display */}
        <div className="py-6 flex flex-col items-center text-center gap-5">
          {question.storyPrompt && (
            <p className="text-base sm:text-lg font-semibold text-slate-700 max-w-xl bg-amber-50/80 border border-amber-200 px-5 py-3 rounded-xl">
              {question.storyPrompt}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
            <span className="font-display text-5xl sm:text-6xl font-extrabold text-sky-700 tabular-nums">
              {question.a}
            </span>
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-rose-600">
              {question.operator}
            </span>
            <span className="font-display text-5xl sm:text-6xl font-extrabold text-amber-600 tabular-nums">
              {question.b}
            </span>
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-slate-400">
              =
            </span>
            <span
              className={`min-w-[84px] px-5 py-2 rounded-2xl border-2 font-display text-5xl sm:text-6xl font-extrabold tabular-nums ${
                solved
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {solved ? question.answer : '?'}
            </span>
          </div>

          {/* Visual Helper */}
          <div className="w-full pt-2">{renderVisualAid()}</div>
        </div>

        {/* 4 Answer Choices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
          {question.options.map((opt) => {
            const isWrong = wrongOptions.includes(opt);
            const isCorrectOpt = solved && opt === question.answer;
            return (
              <button
                key={opt}
                type="button"
                disabled={solved}
                onClick={() => handleSelectAnswer(opt)}
                className={`py-4 px-5 rounded-2xl border-2 font-display text-3xl sm:text-4xl font-extrabold tabular-nums transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isCorrectOpt
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-300 scale-[1.03]'
                    : isWrong
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-sky-400 hover:-translate-y-0.5'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {solved && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-gentle-pop">
            <div className="flex items-center gap-2.5 text-emerald-900 font-semibold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">
                Hebat! {question.a} {question.operator} {question.b} = {question.answer}. Kamu dapat 1 bintang!
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playTapNote(2);
                loadNewQuestion(grade);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
