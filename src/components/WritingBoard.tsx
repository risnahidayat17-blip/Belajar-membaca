import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Eye, EyeOff, Volume2, CheckCircle2, Sparkles } from 'lucide-react';
import {
  WRITING_LOWER,
  WRITING_NUMBERS,
  WRITING_UPPER,
  WRITING_WORDS,
} from '../data/calistungData';
import {
  getIndonesianLetterSpeech,
  playSuccessFanfare,
  playTapNote,
  speakIndonesian,
} from '../utils/soundEngine';

interface WritingBoardProps {
  onEarnStar: () => void;
}

type WritingCategory = 'upper' | 'lower' | 'number' | 'word';

const INK_COLORS = [
  { id: 'slate', label: 'Pensil', hex: '#0F172A', swatch: 'bg-slate-900' },
  { id: 'sky', label: 'Biru', hex: '#0284C7', swatch: 'bg-sky-600' },
  { id: 'rose', label: 'Merah', hex: '#E11D48', swatch: 'bg-rose-600' },
  { id: 'emerald', label: 'Hijau', hex: '#059669', swatch: 'bg-emerald-600' },
  { id: 'amber', label: 'Oranye', hex: '#D97706', swatch: 'bg-amber-600' },
];

export const WritingBoard: React.FC<WritingBoardProps> = ({ onEarnStar }) => {
  const [category, setCategory] = useState<WritingCategory>('upper');
  const [target, setTarget] = useState<string>('A');
  const [inkColor, setInkColor] = useState<string>(INK_COLORS[1].hex);
  const [brushWidth, setBrushWidth] = useState<number>(10);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [celebrated, setCelebrated] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const items =
    category === 'upper'
      ? WRITING_UPPER
      : category === 'lower'
      ? WRITING_LOWER
      : category === 'number'
      ? WRITING_NUMBERS
      : WRITING_WORDS;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setCelebrated(false);
  };

  useEffect(() => {
    clearCanvas();
  }, [target, category]);

  const handleCategoryChange = (nextCat: WritingCategory) => {
    playTapNote(0);
    setCategory(nextCat);
    const first =
      nextCat === 'upper'
        ? WRITING_UPPER[0]
        : nextCat === 'lower'
        ? WRITING_LOWER[0]
        : nextCat === 'number'
        ? WRITING_NUMBERS[0]
        : WRITING_WORDS[0];
    setTarget(first);
  };

  const speakTarget = (item: string) => {
    if (category === 'upper' || category === 'lower') {
      speakIndonesian(`Ayo menulis huruf ${getIndonesianLetterSpeech(item)}!`);
    } else if (category === 'number') {
      speakIndonesian(`Ayo menulis angka ${item}!`);
    } else {
      speakIndonesian(`Ayo menulis kata ${item}!`);
    }
  };

  const handleSelectItem = (item: string, idx: number) => {
    playTapNote(idx);
    setTarget(item);
    speakTarget(item);
  };

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pos = getPointerPos(e);
    lastPointRef.current = pos;
    setHasDrawn(true);
    setCelebrated(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = inkColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getPointerPos(e);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPointRef.current = pos;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleFinishWriting = () => {
    if (!hasDrawn) {
      speakIndonesian('Ayo tebalkan atau tulis dulu di papan garisnya ya!');
      return;
    }
    if (!celebrated) {
      onEarnStar();
    }
    setCelebrated(true);
    playSuccessFanfare();
    speakIndonesian(`Hebat sekali! Tulisan ${target} kamu rapi dan bagus!`);
  };

  return (
    <section aria-labelledby="menulis-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="menulis-heading" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Papan Latihan Menulis Halus (TK & SD)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Ikuti garis bantu putus-putus dengan jari atau mouse untuk berlatih menulis huruf, angka, dan kata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {(
            [
              { id: 'upper', label: 'Huruf Besar' },
              { id: 'lower', label: 'Huruf Kecil' },
              { id: 'number', label: 'Angka 0–9' },
              { id: 'word', label: 'Kata Pendek' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === tab.id
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
        {/* Left Canvas Area */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              {INK_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Warna ${c.label}`}
                  onClick={() => {
                    playTapNote(1);
                    setInkColor(c.hex);
                  }}
                  className={`w-8 h-8 rounded-full ${c.swatch} transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    inkColor === c.hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}

              <div className="flex items-center gap-1 ml-2 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBrushWidth(7)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    brushWidth === 7 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Sedang
                </button>
                <button
                  type="button"
                  onClick={() => setBrushWidth(13)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                    brushWidth === 13 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Tebal
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuide((g) => !g)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {showGuide ? (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{showGuide ? 'Panduan Aktif' : 'Panduan Mati'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapNote(0);
                  clearCanvas();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Eraser className="w-4 h-4" aria-hidden="true" />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          {/* Ruled SD Notebook Pad */}
          <div className="relative w-full aspect-[16/9] min-h-[260px] rounded-2xl border-2 border-sky-200 bg-[#FFFDF9] overflow-hidden select-none">
            {/* SD Notebook Horizontal Guidelines */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex flex-col justify-evenly">
              <div className="border-t border-sky-200/80" />
              <div className="border-t-2 border-dashed border-rose-300/80" />
              <div className="border-t border-sky-300" />
              <div className="border-t-2 border-dashed border-rose-300/80" />
              <div className="border-t border-sky-200/80" />
            </div>

            {/* Faint Tracing Guide Text */}
            {showGuide && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <span
                  className={`font-display font-extrabold text-slate-200 select-none leading-none ${
                    category === 'word'
                      ? 'text-7xl sm:text-9xl tracking-wide'
                      : 'text-[130px] sm:text-[180px]'
                  }`}
                >
                  {target}
                </span>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative z-10 w-full h-full touch-none cursor-crosshair"
            />
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={() => speakTarget(target)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>Dengarkan: {target}</span>
            </button>

            <button
              type="button"
              onClick={handleFinishWriting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Selesai Menulis & Dapat Bintang</span>
            </button>
          </div>

          {celebrated && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-sm font-semibold animate-gentle-pop">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>
                Bagus sekali! Kamu sudah berlatih menulis "{target}" dengan rapi dan mendapat 1 bintang!
              </span>
            </div>
          )}
        </div>

        {/* Right Character / Word Selector */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs font-bold text-slate-500 mb-3">
            Pilih Contoh Tulisan ({items.length})
          </div>
          <div
            className={`grid gap-2 ${
              category === 'word' ? 'grid-cols-2' : 'grid-cols-5 sm:grid-cols-6 lg:grid-cols-4'
            }`}
          >
            {items.map((item, idx) => {
              const isSelected = target === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectItem(item, idx)}
                  className={`min-h-[48px] px-2 py-2 rounded-xl border font-display text-lg font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-white'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
