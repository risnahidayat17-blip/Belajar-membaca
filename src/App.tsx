/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Header, LearningMode } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ReadingHub } from './components/ReadingHub';
import { WordArranger } from './components/WordArranger';
import { WritingBoard } from './components/WritingBoard';
import { MathExplorer } from './components/MathExplorer';
import { ReadingQuiz } from './components/ReadingQuiz';
import {
  cancelAllSpeech,
  playTapNote,
  setSoundEnabled as applySoundEngineState,
  speakIndonesian,
} from './utils/soundEngine';

export default function App() {
  const [activeMode, setActiveMode] = useState<LearningMode>('baca');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [starsEarned, setStarsEarned] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem('bacalah_ceria_stars');
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bacalah_ceria_stars', String(starsEarned));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [starsEarned]);

  // Pre-warm speech voices list on mount for faster first tap response
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => window.speechSynthesis.getVoices();
      loadVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
        cancelAllSpeech();
      };
    }
    return () => cancelAllSpeech();
  }, []);

  const handleSelectMode = (mode: LearningMode) => {
    cancelAllSpeech();
    setActiveMode(mode);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    applySoundEngineState(next);
    if (next) {
      playTapNote(2);
      speakIndonesian('Yeay! Suara ceria aktif!');
    }
  };

  const handleEarnStar = () => {
    setStarsEarned((s) => s + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-storybook-wallpaper text-slate-900">
      <Header
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 pb-12">
        <HeroBanner
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          starsEarned={starsEarned}
        />

        {activeMode === 'baca' && <ReadingHub onEarnStar={handleEarnStar} />}
        {activeMode === 'susun' && <WordArranger onEarnStar={handleEarnStar} />}
        {activeMode === 'tulis' && <WritingBoard onEarnStar={handleEarnStar} />}
        {activeMode === 'hitung' && <MathExplorer onEarnStar={handleEarnStar} />}
        {activeMode === 'kuis' && <ReadingQuiz onEarnStar={handleEarnStar} />}
      </main>

      <footer className="border-t border-amber-200/70 bg-white/80 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Bacalah Ceria — Media Belajar Calistung TK & SD Kelas 1, 2, 3</span>
          <span>Gunakan suara perangkat untuk mendampingi si kecil belajar</span>
        </div>
      </footer>
    </div>
  );
}
