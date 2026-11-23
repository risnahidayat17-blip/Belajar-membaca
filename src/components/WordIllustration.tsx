import React from 'react';

interface WordIllustrationProps {
  illustKey: string;
  className?: string;
}

export const WordIllustration: React.FC<WordIllustrationProps> = ({
  illustKey,
  className = 'w-full h-full',
}) => {
  const renderScene = () => {
    switch (illustKey) {
      case 'apel':
        return (
          <g>
            <circle cx="60" cy="64" r="44" fill="#FFE4E6" />
            <path d="M60 36 C42 26, 26 42, 28 64 C30 86, 46 94, 60 90 C74 94, 90 86, 92 64 C94 42, 78 26, 60 36 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <ellipse cx="44" cy="54" rx="5" ry="10" transform="rotate(-18 44 54)" fill="#FCA5A5" opacity="0.65" />
            <path d="M60 36 C60 25, 65 20, 70 18" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M62 28 C72 18, 86 22, 82 34 C74 37, 65 34, 62 28 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="51" cy="60" r="2.8" fill="#450A0A" />
            <circle cx="69" cy="60" r="2.8" fill="#450A0A" />
            <path d="M54 68 Q60 74 66 68" stroke="#450A0A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="45" cy="65" r="3.5" fill="#FDA4AF" opacity="0.7" />
            <circle cx="75" cy="65" r="3.5" fill="#FDA4AF" opacity="0.7" />
          </g>
        );

      case 'bola':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <circle cx="60" cy="60" r="36" fill="#FACC15" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M60 24 A36 36 0 0 0 24 60 A36 36 0 0 0 60 96 C46 78, 46 42, 60 24 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
            <path d="M60 24 A36 36 0 0 1 96 60 A36 36 0 0 1 60 96 C74 78, 74 42, 60 24 Z" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
            <path d="M26 48 Q60 36 94 48" stroke="#0F172A" strokeWidth="2" fill="none" />
            <path d="M26 72 Q60 84 94 72" stroke="#0F172A" strokeWidth="2" fill="none" />
            <circle cx="60" cy="60" r="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="48" cy="38" r="3" fill="#FFFFFF" opacity="0.7" />
          </g>
        );

      case 'ceri':
        return (
          <g>
            <circle cx="60" cy="62" r="45" fill="#FFE4E6" />
            <path d="M44 64 Q54 32 66 24" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M78 68 Q72 38 66 24" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M66 24 C76 16, 92 22, 86 32 C76 34, 68 29, 66 24 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="42" cy="74" r="17" fill="#E11D48" stroke="#881337" strokeWidth="2.5" />
            <circle cx="77" cy="78" r="17" fill="#F43F5E" stroke="#881337" strokeWidth="2.5" />
            <ellipse cx="36" cy="68" rx="3.5" ry="5.5" transform="rotate(-25 36 68)" fill="#FFE4E6" opacity="0.75" />
            <ellipse cx="71" cy="72" rx="3.5" ry="5.5" transform="rotate(-25 71 72)" fill="#FFE4E6" opacity="0.75" />
          </g>
        );

      case 'domba':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#DCFCE7" />
            <rect x="44" y="80" width="6" height="16" rx="3" fill="#334155" />
            <rect x="70" y="80" width="6" height="16" rx="3" fill="#334155" />
            <circle cx="44" cy="58" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="60" cy="48" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="76" cy="58" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="52" cy="70" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="68" cy="70" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="60" cy="60" r="16" fill="#FFFFFF" />
            <ellipse cx="42" cy="54" rx="7" ry="4" transform="rotate(-25 42 54)" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="78" cy="54" rx="7" ry="4" transform="rotate(25 78 54)" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="60" cy="58" rx="13" ry="11" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
            <circle cx="56" cy="46" r="6" fill="#FFFFFF" />
            <circle cx="64" cy="46" r="6" fill="#FFFFFF" />
            <circle cx="55" cy="57" r="2.2" fill="#1E293B" />
            <circle cx="65" cy="57" r="2.2" fill="#1E293B" />
            <path d="M57 63 Q60 66 63 63" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'elang':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <path d="M20 50 Q38 36 52 52 L42 68 Q26 62 20 50 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
            <path d="M100 50 Q82 36 68 52 L78 68 Q94 62 100 50 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
            <ellipse cx="60" cy="64" rx="18" ry="24" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <circle cx="60" cy="42" r="14" fill="#FFFBEB" stroke="#451A03" strokeWidth="2" />
            <path d="M56 44 L66 46 L59 53 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="54" cy="39" r="2.4" fill="#0F172A" />
            <circle cx="66" cy="39" r="2.4" fill="#0F172A" />
            <path d="M52 88 L48 96 M52 88 L54 96 M68 88 L66 96 M68 88 L72 96" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'foto':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <rect x="44" y="30" width="24" height="10" rx="4" fill="#6366F1" stroke="#312E81" strokeWidth="2" />
            <rect x="24" y="38" width="72" height="50" rx="12" fill="#4F46E5" stroke="#312E81" strokeWidth="2.5" />
            <rect x="24" y="54" width="72" height="14" fill="#FBBF24" />
            <circle cx="60" cy="63" r="18" fill="#E0F2FE" stroke="#312E81" strokeWidth="3" />
            <circle cx="60" cy="63" r="11" fill="#38BDF8" stroke="#0369A1" strokeWidth="2" />
            <circle cx="56" cy="59" r="3" fill="#FFFFFF" />
            <circle cx="82" cy="46" r="4" fill="#FB7185" />
          </g>
        );

      case 'gajah':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <ellipse cx="32" cy="56" rx="14" ry="20" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
            <ellipse cx="32" cy="56" rx="8" ry="13" fill="#FDA4AF" />
            <ellipse cx="88" cy="56" rx="14" ry="20" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
            <ellipse cx="88" cy="56" rx="8" ry="13" fill="#FDA4AF" />
            <circle cx="60" cy="60" r="26" fill="#CBD5E1" stroke="#334155" strokeWidth="2.5" />
            <path d="M56 64 Q56 84 68 84 Q74 84 74 78" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M56 64 Q56 84 68 84 Q74 84 74 78" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="49" cy="52" r="3" fill="#0F172A" />
            <circle cx="71" cy="52" r="3" fill="#0F172A" />
            <circle cx="44" cy="60" r="4" fill="#FDA4AF" opacity="0.7" />
            <circle cx="76" cy="60" r="4" fill="#FDA4AF" opacity="0.7" />
            <circle cx="80" cy="70" r="3" fill="#38BDF8" />
            <circle cx="86" cy="64" r="2.5" fill="#38BDF8" />
          </g>
        );

      case 'hujan':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <circle cx="42" cy="46" r="14" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="60" cy="40" r="17" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="78" cy="46" r="14" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="2" />
            <rect x="38" y="42" width="44" height="18" fill="#FFFFFF" />
            <path d="M36 60 H84" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="54" cy="46" r="2.2" fill="#1E293B" />
            <circle cx="66" cy="46" r="2.2" fill="#1E293B" />
            <path d="M56 52 Q60 55 64 52" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M40 70 L36 80 M54 72 L50 82 M68 70 L64 80 M80 72 L76 82" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <path d="M44 86 L41 94 M60 88 L57 96 M74 86 L71 94" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );

      case 'ikan':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#CFFAFE" />
            <path d="M84 60 L102 44 L98 60 L102 76 Z" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            <path d="M54 36 Q66 24 72 40 Z" fill="#FACC15" stroke="#C2410C" strokeWidth="2" />
            <ellipse cx="56" cy="60" rx="28" ry="20" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" />
            <path d="M54 41 Q60 60 54 79" stroke="#FEF08A" strokeWidth="5" fill="none" />
            <path d="M66 43 Q71 60 66 77" stroke="#FEF08A" strokeWidth="4" fill="none" />
            <circle cx="40" cy="55" r="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="39" cy="55" r="2" fill="#0F172A" />
            <path d="M32 65 Q38 69 43 65" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="46" r="4" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="1.5" />
            <circle cx="17" cy="36" r="2.8" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="1.5" />
          </g>
        );

      case 'jeruk':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFEDD5" />
            <circle cx="60" cy="64" r="30" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <path d="M60 34 L62 24" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M62 28 C74 18, 86 24, 80 34 C72 36, 65 32, 62 28 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="48" cy="52" r="2" fill="#FDBA74" />
            <circle cx="44" cy="62" r="1.5" fill="#FDBA74" />
            <circle cx="52" cy="60" r="2.6" fill="#431407" />
            <circle cx="68" cy="60" r="2.6" fill="#431407" />
            <path d="M55 68 Q60 73 65 68" stroke="#431407" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'kucing':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <path d="M34 48 L30 24 L50 38 Z" fill="#FB923C" stroke="#9A3412" strokeWidth="2.5" />
            <path d="M86 48 L90 24 L70 38 Z" fill="#FB923C" stroke="#9A3412" strokeWidth="2.5" />
            <path d="M36 44 L34 30 L46 39 Z" fill="#FDA4AF" />
            <path d="M84 44 L86 30 L74 39 Z" fill="#FDA4AF" />
            <ellipse cx="60" cy="62" rx="30" ry="26" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.5" />
            <path d="M54 38 L54 46 M60 37 L60 47 M66 38 L66 46" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="58" r="3.5" fill="#0F172A" />
            <circle cx="72" cy="58" r="3.5" fill="#0F172A" />
            <polygon points="56,64 64,64 60,69" fill="#FB7185" />
            <path d="M53 72 Q57 76 60 71 Q63 76 67 72" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M24 62 L38 64 M24 69 L38 69 M96 62 L82 64 M96 69 L82 69" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'lampu':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF9C3" />
            <circle cx="60" cy="50" r="24" fill="#FDE047" opacity="0.5" />
            <path d="M44 50 A16 16 0 1 1 76 50 C76 60, 69 64, 68 72 H52 C51 64, 44 60, 44 50 Z" fill="#FACC15" stroke="#A16207" strokeWidth="2.5" />
            <rect x="51" y="72" width="18" height="7" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <rect x="53" y="79" width="14" height="6" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
            <path d="M60 85 L60 91" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d="M54 54 Q60 44 66 54" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M60 18 V24 M30 30 L35 35 M90 30 L85 35 M22 52 H28 M98 52 H92" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'mobil':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFE4E6" />
            <path d="M32 58 L42 38 H74 L86 58 Z" fill="#60A5FA" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="18" y="56" width="84" height="24" rx="10" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <path d="M46 42 H58 V56 H38 Z" fill="#E0F2FE" />
            <path d="M62 42 H72 L79 56 H62 Z" fill="#E0F2FE" />
            <circle cx="38" cy="80" r="10" fill="#1E293B" />
            <circle cx="38" cy="80" r="4.5" fill="#E2E8F0" />
            <circle cx="82" cy="80" r="10" fill="#1E293B" />
            <circle cx="82" cy="80" r="4.5" fill="#E2E8F0" />
            <circle cx="96" cy="65" r="4" fill="#FDE047" />
          </g>
        );

      case 'nanas':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <path d="M48 42 L40 20 L54 34 L60 16 L66 34 L80 20 L72 42 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <ellipse cx="60" cy="68" rx="22" ry="26" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
            <path d="M44 54 L76 82 M42 68 L66 90 M54 46 L78 68 M76 54 L44 82 M78 68 L54 90 M66 46 L42 68" stroke="#D97706" strokeWidth="2" opacity="0.65" />
            <circle cx="53" cy="64" r="2.5" fill="#451A03" />
            <circle cx="67" cy="64" r="2.5" fill="#451A03" />
            <path d="M55 72 Q60 76 65 72" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'ombak':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M58 26 L58 58 L78 52 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            <path d="M42 56 L78 56 L72 68 L48 68 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
            <path d="M18 72 Q32 58 46 72 T74 72 T102 72 V90 H18 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
            <path d="M22 82 Q36 70 50 82 T78 82 T98 82" stroke="#BAE6FD" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'pisang':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF9C3" />
            <path d="M36 32 C32 62, 52 88, 86 84 C68 78, 52 58, 50 32 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M48 26 C44 56, 64 80, 94 74 C76 70, 62 50, 60 26 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <rect x="40" y="24" width="14" height="8" rx="3" fill="#78350F" />
          </g>
        );

      case 'quoka':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#DCFCE7" />
            <circle cx="40" cy="40" r="9" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <circle cx="80" cy="40" r="9" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="60" cy="74" rx="22" ry="20" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="60" cy="52" r="20" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
            <ellipse cx="60" cy="57" rx="12" ry="9" fill="#FDE68A" />
            <circle cx="52" cy="48" r="2.8" fill="#1E293B" />
            <circle cx="68" cy="48" r="2.8" fill="#1E293B" />
            <ellipse cx="60" cy="54" rx="3.5" ry="2.5" fill="#451A03" />
            <path d="M53 59 Q60 65 67 59" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'rumah':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <rect x="74" y="28" width="10" height="18" fill="#FB7185" stroke="#9F1239" strokeWidth="2" />
            <rect x="30" y="54" width="60" height="40" rx="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="2.5" />
            <polygon points="22,56 60,24 98,56" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <rect x="51" y="68" width="18" height="26" rx="3" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
            <circle cx="64" cy="82" r="2" fill="#FDE047" />
            <rect x="35" y="64" width="11" height="11" rx="2" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2" />
            <rect x="74" y="64" width="11" height="11" rx="2" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2" />
          </g>
        );

      case 'sapi':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#DCFCE7" />
            <path d="M40 34 Q36 24 44 26" stroke="#D97706" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M80 34 Q84 24 76 26" stroke="#D97706" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="32" cy="44" rx="10" ry="5" transform="rotate(-20 32 44)" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
            <ellipse cx="88" cy="44" rx="10" ry="5" transform="rotate(20 88 44)" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
            <rect x="36" y="34" width="48" height="54" rx="22" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
            <circle cx="48" cy="46" r="8" fill="#1E293B" />
            <circle cx="72" cy="54" r="6" fill="#1E293B" />
            <ellipse cx="60" cy="74" rx="20" ry="13" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2" />
            <circle cx="53" cy="72" r="2.5" fill="#881337" />
            <circle cx="67" cy="72" r="2.5" fill="#881337" />
            <circle cx="48" cy="54" r="3" fill="#0F172A" />
            <circle cx="72" cy="54" r="3" fill="#0F172A" />
          </g>
        );

      case 'topi':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <path d="M36 66 L42 36 Q60 28 78 36 L84 66 Z" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
            <rect x="38" y="56" width="44" height="9" fill="#EF4444" />
            <ellipse cx="60" cy="68" rx="44" ry="11" fill="#FDE047" stroke="#B45309" strokeWidth="2.5" />
          </g>
        );

      case 'ulat':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#DCFCE7" />
            <circle cx="86" cy="72" r="11" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
            <circle cx="70" cy="68" r="12" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <circle cx="53" cy="68" r="13" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="36" cy="62" r="15" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <path d="M30 48 L24 36 M40 48 L44 36" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="36" r="3" fill="#EF4444" />
            <circle cx="44" cy="36" r="3" fill="#EF4444" />
            <circle cx="31" cy="60" r="2.4" fill="#0F172A" />
            <circle cx="41" cy="60" r="2.4" fill="#0F172A" />
            <path d="M32 66 Q36 70 40 66" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'vas':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <path d="M60 56 V36 M50 56 L42 40 M70 56 L78 40" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="32" r="8" fill="#F43F5E" />
            <circle cx="40" cy="38" r="7" fill="#FBBF24" />
            <circle cx="80" cy="38" r="7" fill="#A855F7" />
            <path d="M44 54 H76 L72 64 C84 74, 78 94, 60 94 C42 94, 36 74, 48 64 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
            <path d="M46 76 H74" stroke="#FDE047" strokeWidth="4" />
          </g>
        );

      case 'wortel':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#DCFCE7" />
            <path d="M60 36 L50 18 M60 36 L60 14 M60 36 L70 18" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M42 40 Q60 32 78 40 L63 94 Q60 98 57 94 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <path d="M48 52 H58 M62 62 H71 M51 72 H60" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="54" cy="48" r="2.2" fill="#431407" />
            <circle cx="66" cy="48" r="2.2" fill="#431407" />
            <path d="M56 54 Q60 58 64 54" stroke="#431407" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'xilofon':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <rect x="20" y="34" width="12" height="52" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            <rect x="35" y="38" width="12" height="44" rx="4" fill="#F97316" stroke="#9A3412" strokeWidth="2" />
            <rect x="50" y="42" width="12" height="36" rx="4" fill="#FACC15" stroke="#A16207" strokeWidth="2" />
            <rect x="65" y="45" width="12" height="30" rx="4" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <rect x="80" y="48" width="12" height="24" rx="4" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
            <line x1="28" y1="22" x2="54" y2="54" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <circle cx="55" cy="55" r="5" fill="#FB7185" />
          </g>
        );

      case 'yoyo':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFE4E6" />
            <path d="M60 16 V42" stroke="#64748B" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="60" cy="66" r="26" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="60" cy="66" r="16" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
            <circle cx="60" cy="66" r="6" fill="#3B82F6" />
          </g>
        );

      case 'zebra':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M40 36 L36 22 L48 30 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <path d="M80 36 L84 22 L72 30 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <rect x="38" y="32" width="44" height="52" rx="20" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M40 46 H54 M66 46 H80 M39 58 H52 M68 58 H81" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="60" cy="72" rx="18" ry="12" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
            <circle cx="50" cy="52" r="3" fill="#0F172A" />
            <circle cx="70" cy="52" r="3" fill="#0F172A" />
            <circle cx="53" cy="72" r="2.2" fill="#334155" />
            <circle cx="67" cy="72" r="2.2" fill="#334155" />
          </g>
        );

      case 'buku':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <path d="M22 36 Q41 30 60 38 V84 Q41 76 22 82 Z" fill="#FFFFFF" stroke="#312E81" strokeWidth="2.5" />
            <path d="M98 36 Q79 30 60 38 V84 Q79 76 98 82 Z" fill="#FEF9C3" stroke="#312E81" strokeWidth="2.5" />
            <rect x="58" y="38" width="4" height="46" fill="#4F46E5" />
            <circle cx="40" cy="54" r="7" fill="#F43F5E" />
            <rect x="70" y="48" width="18" height="4" rx="2" fill="#3B82F6" />
            <rect x="70" y="57" width="15" height="4" rx="2" fill="#22C55E" />
            <rect x="70" y="66" width="18" height="4" rx="2" fill="#F59E0B" />
          </g>
        );

      case 'kuda':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <path d="M40 34 L34 20 L48 28 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <path d="M80 34 L86 20 L72 28 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <path d="M54 24 Q60 18 66 24 L64 38 H56 Z" fill="#451A03" />
            <rect x="38" y="32" width="44" height="54" rx="20" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
            <ellipse cx="60" cy="72" rx="17" ry="12" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
            <circle cx="49" cy="50" r="3" fill="#0F172A" />
            <circle cx="71" cy="50" r="3" fill="#0F172A" />
            <circle cx="53" cy="70" r="2.2" fill="#78350F" />
            <circle cx="67" cy="70" r="2.2" fill="#78350F" />
          </g>
        );

      case 'roti':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFEDD5" />
            <path d="M28 52 C24 36, 40 28, 60 28 C80 28, 96 36, 92 52 L88 86 H32 Z" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <path d="M34 54 C31 41, 44 35, 60 35 C76 35, 89 41, 86 54 L82 81 H38 Z" fill="#FEF3C7" />
            <circle cx="52" cy="58" r="2.4" fill="#78350F" />
            <circle cx="68" cy="58" r="2.4" fill="#78350F" />
            <path d="M55 66 Q60 70 65 66" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'mata':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M20 60 Q60 28 100 60 Q60 92 20 60 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
            <circle cx="60" cy="60" r="16" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
            <circle cx="60" cy="60" r="8" fill="#0F172A" />
            <circle cx="54" cy="54" r="4" fill="#FFFFFF" />
          </g>
        );

      case 'meja':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF3C7" />
            <rect x="28" y="54" width="8" height="36" rx="2" fill="#92400E" />
            <rect x="84" y="54" width="8" height="36" rx="2" fill="#92400E" />
            <rect x="20" y="44" width="80" height="12" rx="4" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
            <rect x="46" y="34" width="28" height="10" rx="2" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
          </g>
        );

      case 'gigi':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M36 42 C36 28, 52 28, 60 34 C68 28, 84 28, 84 42 C84 58, 78 88, 70 88 C64 88, 64 70, 60 70 C56 70, 56 88, 50 88 C42 88, 36 58, 36 42 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="52" cy="48" r="2.5" fill="#0F172A" />
            <circle cx="68" cy="48" r="2.5" fill="#0F172A" />
            <path d="M54 56 Q60 61 66 56" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'baju':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <path d="M40 28 L20 42 L28 56 L38 50 V88 H82 V50 L92 56 L100 42 L80 28 Q60 38 40 28 Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2.5" />
            <polygon points="60,46 64,54 72,54 66,59 68,67 60,62 52,67 54,59 48,54 56,54" fill="#FACC15" />
          </g>
        );

      case 'dadu':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFE4E6" />
            <rect x="30" y="30" width="60" height="60" rx="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
            <circle cx="45" cy="45" r="5" fill="#EF4444" />
            <circle cx="75" cy="45" r="5" fill="#EF4444" />
            <circle cx="60" cy="60" r="5" fill="#EF4444" />
            <circle cx="45" cy="75" r="5" fill="#EF4444" />
            <circle cx="75" cy="75" r="5" fill="#EF4444" />
          </g>
        );

      case 'susu':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M38 36 H82 L76 90 H44 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            <path d="M41 52 H79 L76 88 H44 Z" fill="#F8FAFC" />
            <rect x="44" y="56" width="32" height="16" rx="4" fill="#38BDF8" opacity="0.25" />
            <circle cx="53" cy="64" r="2.2" fill="#0F172A" />
            <circle cx="67" cy="64" r="2.2" fill="#0F172A" />
            <path d="M56 70 Q60 73 64 70" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'bebek':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF9C3" />
            <ellipse cx="60" cy="70" rx="26" ry="20" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <circle cx="50" cy="44" r="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M36 46 L22 48 L36 53 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <circle cx="45" cy="40" r="2.8" fill="#0F172A" />
            <path d="M58 64 Q72 60 76 72 Q64 78 58 64 Z" fill="#F59E0B" />
          </g>
        );

      case 'kupu':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#F3E8FF" />
            <ellipse cx="38" cy="48" rx="18" ry="15" fill="#EC4899" stroke="#9D174D" strokeWidth="2" />
            <ellipse cx="82" cy="48" rx="18" ry="15" fill="#EC4899" stroke="#9D174D" strokeWidth="2" />
            <ellipse cx="42" cy="72" rx="14" ry="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
            <ellipse cx="78" cy="72" rx="14" ry="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
            <circle cx="36" cy="46" r="5" fill="#FDE047" />
            <circle cx="84" cy="46" r="5" fill="#FDE047" />
            <rect x="56" y="38" width="8" height="44" rx="4" fill="#1E293B" />
            <path d="M58 38 Q50 26 46 28 M62 38 Q70 26 74 28" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'balon':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFE4E6" />
            <path d="M44 74 Q42 88 46 96" stroke="#64748B" strokeWidth="2" fill="none" />
            <path d="M74 72 Q76 86 72 96" stroke="#64748B" strokeWidth="2" fill="none" />
            <ellipse cx="44" cy="48" rx="18" ry="22" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            <ellipse cx="74" cy="52" rx="18" ry="22" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
            <ellipse cx="60" cy="40" rx="16" ry="20" fill="#FACC15" stroke="#A16207" strokeWidth="2" />
            <ellipse cx="54" cy="33" rx="3" ry="6" transform="rotate(-20 54 33)" fill="#FFFFFF" opacity="0.7" />
          </g>
        );

      case 'sepatu':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0E7FF" />
            <path d="M26 76 H94 V84 H26 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M28 76 V44 H52 L64 58 H88 C94 58, 96 68, 92 76 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <path d="M52 54 H60 M56 60 H64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'pelangi':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <path d="M22 72 A38 38 0 0 1 98 72" stroke="#EF4444" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M29 72 A31 31 0 0 1 91 72" stroke="#F97316" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M36 72 A24 24 0 0 1 84 72" stroke="#FACC15" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M43 72 A17 17 0 0 1 77 72" stroke="#22C55E" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M50 72 A10 10 0 0 1 70 72" stroke="#3B82F6" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="26" cy="76" r="10" fill="#FFFFFF" />
            <circle cx="36" cy="76" r="8" fill="#FFFFFF" />
            <circle cx="94" cy="76" r="10" fill="#FFFFFF" />
            <circle cx="84" cy="76" r="8" fill="#FFFFFF" />
          </g>
        );

      case 'bunga':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FFE4E6" />
            <path d="M60 56 V94" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M60 78 Q44 70 42 78 Q48 86 60 80 Z" fill="#22C55E" />
            <circle cx="60" cy="30" r="11" fill="#F43F5E" />
            <circle cx="76" cy="42" r="11" fill="#FB7185" />
            <circle cx="70" cy="60" r="11" fill="#F43F5E" />
            <circle cx="50" cy="60" r="11" fill="#FB7185" />
            <circle cx="44" cy="42" r="11" fill="#F43F5E" />
            <circle cx="60" cy="47" r="11" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="56" cy="45" r="2" fill="#451A03" />
            <circle cx="64" cy="45" r="2" fill="#451A03" />
            <path d="M56 50 Q60 53 64 50" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'matahari':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#FEF9C3" />
            <path d="M60 16 V26 M60 94 V104 M16 60 H26 M94 60 H104 M29 29 L36 36 M84 84 L91 91 M91 29 L84 36 M36 84 L29 91" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <circle cx="60" cy="60" r="26" fill="#FACC15" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="51" cy="56" r="2.8" fill="#451A03" />
            <circle cx="69" cy="56" r="2.8" fill="#451A03" />
            <path d="M53 65 Q60 72 67 65" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="45" cy="62" r="3.5" fill="#FB7185" opacity="0.6" />
            <circle cx="75" cy="62" r="3.5" fill="#FB7185" opacity="0.6" />
          </g>
        );

      case 'bulan':
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#1E1B4B" />
            <path d="M66 28 A28 28 0 1 0 88 76 A22 22 0 1 1 66 28 Z" fill="#FDE047" stroke="#FACC15" strokeWidth="2" />
            <polygon points="82,30 84,36 90,36 85,40 87,46 82,42 77,46 79,40 74,36 80,36" fill="#FEF08A" />
            <circle cx="36" cy="38" r="2.5" fill="#FFFFFF" />
            <circle cx="30" cy="70" r="2" fill="#FFFFFF" />
          </g>
        );

      case 'awan':
      default:
        return (
          <g>
            <circle cx="60" cy="60" r="46" fill="#E0F2FE" />
            <circle cx="44" cy="60" r="16" fill="#FFFFFF" stroke="#7DD3FC" strokeWidth="2" />
            <circle cx="62" cy="52" r="20" fill="#FFFFFF" stroke="#7DD3FC" strokeWidth="2" />
            <circle cx="80" cy="60" r="15" fill="#FFFFFF" stroke="#7DD3FC" strokeWidth="2" />
            <rect x="40" y="54" width="44" height="22" fill="#FFFFFF" />
            <path d="M38 76 H84" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="54" cy="58" r="2.4" fill="#0F172A" />
            <circle cx="68" cy="58" r="2.4" fill="#0F172A" />
            <path d="M57 65 Q61 68 65 65" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Ilustrasi ${illustKey}`}
    >
      {renderScene()}
    </svg>
  );
};
