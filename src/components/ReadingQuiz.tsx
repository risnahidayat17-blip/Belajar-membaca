import React, { useMemo, useState } from 'react';
import { Volume2, RotateCcw, Star, CheckCircle2 } from 'lucide-react';
import { PICTURE_WORDS, WordCardItem } from '../data/bacalahData';
import { WordIllustration } from './WordIllustration';
import {
  playSuccessFanfare,
  playTapNote,
  playTryAgainSound,
  speakIndonesian,
  speakSyllablesSequence,
} from '../utils/soundEngine';

interface ReadingQuizProps {
  onEarnStar: () => void;
}

type QuestionType = 'find-picture' | 'find-word';

interface QuizQuestion {
  type: QuestionType;
  target: WordCardItem;
  options: WordCardItem[];
}

function buildQuizRound(roundSize = 6): QuizQuestion[] {
  const shuffledPool = [...PICTURE_WORDS].sort(() => Math.random() - 0.5);
  const targets = shuffledPool.slice(0, roundSize);

  return targets.map((target, idx) => {
    const distractors = PICTURE_WORDS.filter((w) => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    return {
      type: idx % 2 === 0 ? 'find-picture' : 'find-word',
      target,
      options,
    };
  });
}

const CONFETTI_COLORS = ['#F43F5E', '#F59E0B', '#10B981', '#0EA5E9', '#6366F1'];

export const ReadingQuiz: React.FC<ReadingQuizProps> = ({ onEarnStar }) => {
  const [roundSeed, setRoundSeed] = useState(0);
  const questions = useMemo(() => buildQuizRound(6), [roundSeed]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStars, setRoundStars] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [showSpellingHint, setShowSpellingHint] = useState(false);
  const [hintSylIdx, setHintSylIdx] = useState<number | null>(null);

  const currentQ = questions[currentIdx];

  const handlePlayPrompt = () => {
    playTapNote(1);
    if (currentQ.type === 'find-picture') {
      speakIndonesian(`Cari gambar... ${currentQ.target.word}!`);
    } else {
      speakIndonesian('Gambar apakah ini? Ayo pilih kata yang tepat!');
    }
  };

  const handleSpellHint = () => {
    setShowSpellingHint(true);
    speakSyllablesSequence(
      currentQ.target.syllables,
      currentQ.target.word,
      (idx) => setHintSylIdx(idx)
    );
  };

  const handleSelectOption = (option: WordCardItem) => {
    if (isCorrect) return;

    if (option.id === currentQ.target.id) {
      setIsCorrect(true);
      setRoundStars((s) => s + 1);
      onEarnStar();
      playSuccessFanfare();
      speakIndonesian(`Hebat sekali! Itu ${currentQ.target.word}!`);
    } else {
      if (!wrongIds.includes(option.id)) {
        setWrongIds((prev) => [...prev, option.id]);
      }
      playTryAgainSound();
      speakIndonesian(`Itu ${option.word}. Ayo coba cari lagi ya!`);
    }
  };

  const handleNextQuestion = () => {
    playTapNote(3);
    if (currentIdx + 1 >= questions.length) {
      setRoundFinished(true);
      playSuccessFanfare();
      speakIndonesian('Luar biasa! Kamu menyelesaikan semua soal kuis membaca!');
      return;
    }
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    setWrongIds([]);
    setIsCorrect(false);
    setShowSpellingHint(false);
    setHintSylIdx(null);

    const nextQ = questions[nextIdx];
    if (nextQ.type === 'find-picture') {
      speakIndonesian(`Soal berikutnya! Cari gambar ${nextQ.target.word}!`);
    } else {
      speakIndonesian('Soal berikutnya! Gambar apakah ini?');
    }
  };

  const handleRestartRound = () => {
    playTapNote(0);
    setRoundSeed((s) => s + 1);
    setCurrentIdx(0);
    setWrongIds([]);
    setIsCorrect(false);
    setRoundStars(0);
    setRoundFinished(false);
    setShowSpellingHint(false);
    setHintSylIdx(null);
  };

  if (roundFinished) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center gap-4 animate-gentle-pop">
          <div className="flex items-center gap-2 text-amber-500">
            {[...Array(3)].map((_, idx) => (
              <Star key={idx} className="w-10 h-10 fill-amber-400 text-amber-500" />
            ))}
          </div>

          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Yeay! Kamu Hebat Sekali!
          </h2>
          <p className="text-slate-600 text-base max-w-md">
            Semua <span className="font-bold text-slate-900 tabular-nums">{questions.length}</span> soal kuis membaca berhasil diselesaikan dan kamu mendapatkan{' '}
            <span className="font-bold text-amber-700 tabular-nums">{roundStars} bintang</span> baru.
          </p>

          <button
            type="button"
            onClick={handleRestartRound}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            <span>Main Kuis Lagi</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="kuis-heading" className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Celebration Confetti Burst */}
        {isCorrect && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-around">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-sm animate-confetti"
                style={{
                  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  animationDelay: `${(i % 4) * 70}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Top Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h2 id="kuis-heading" className="font-display text-2xl font-extrabold text-slate-900">
              Kuis Tebak Kata & Gambar
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Soal <span className="font-bold text-slate-900 tabular-nums">{currentIdx + 1}</span> dari{' '}
              <span className="tabular-nums">{questions.length}</span> · Bintang ronde ini:{' '}
              <span className="font-bold text-amber-700 tabular-nums">{roundStars}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlayPrompt}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Dengar Soal</span>
          </button>
        </div>

        {/* Question Prompt Box */}
        <div className="py-6 flex flex-col items-center text-center gap-4">
          {currentQ.type === 'find-picture' ? (
            <>
              <span className="text-sm font-semibold text-slate-600">
                Ketuk gambar yang sesuai dengan kata ini:
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentQ.target.syllables.map((syl, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && showSpellingHint && (
                      <span className="font-display text-3xl text-slate-400 font-bold">·</span>
                    )}
                    <span
                      className={`font-display text-4xl sm:text-5xl font-extrabold px-2 py-1 rounded-xl transition-transform ${
                        hintSylIdx === idx || hintSylIdx === -1
                          ? 'bg-amber-300 text-slate-900 scale-110'
                          : showSpellingHint
                          ? idx % 2 === 0
                            ? 'text-sky-700'
                            : 'text-rose-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {showSpellingHint ? syl : idx === 0 ? currentQ.target.word : ''}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSpellHint}
                className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Bantu Eja Suku Kata
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-slate-600">
                Gambar apakah ini? Pilih kata yang benar!
              </span>
              <div className="w-36 h-36 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <WordIllustration illustKey={currentQ.target.illustKey} />
              </div>
            </>
          )}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentQ.options.map((opt) => {
            const isWrong = wrongIds.includes(opt.id);
            const isTargetAndSolved = isCorrect && opt.id === currentQ.target.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={isCorrect}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 min-h-[150px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isTargetAndSolved
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 scale-[1.03]'
                    : isWrong
                    ? 'bg-slate-100 border-slate-200 opacity-55'
                    : 'bg-white border-slate-200 hover:border-sky-400 hover:-translate-y-0.5'
                }`}
              >
                {currentQ.type === 'find-picture' ? (
                  <>
                    <div className="w-24 h-24">
                      <WordIllustration illustKey={opt.illustKey} />
                    </div>
                    {(isTargetAndSolved || isWrong) && (
                      <span className="font-display text-sm font-bold text-slate-800">
                        {opt.word}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {opt.syllables.map((syl, sIdx) => (
                        <React.Fragment key={sIdx}>
                          {sIdx > 0 && (
                            <span className="text-slate-400 font-bold">·</span>
                          )}
                          <span
                            className={`font-display text-2xl font-extrabold ${
                              sIdx % 2 === 0 ? 'text-sky-700' : 'text-rose-600'
                            }`}
                          >
                            {syl}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Ketuk untuk memilih
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {isCorrect && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-gentle-pop">
            <div className="flex items-center gap-2.5 text-emerald-900 font-semibold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>
                Benar sekali! Kata "{currentQ.target.word}" terdiri dari suku kata{' '}
                {currentQ.target.syllables.join(' - ')}.
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {currentIdx + 1 >= questions.length ? 'Lihat Hasil' : 'Soal Berikutnya'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
