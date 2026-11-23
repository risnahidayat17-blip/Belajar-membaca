export type SdGrade = 1 | 2 | 3;

export interface ReadingPassage {
  id: string;
  grade: SdGrade;
  title: string;
  illustKey: string;
  sentences: string[];
  question: string;
  options: string[];
  answerIdx: number;
}

export interface MathQuestion {
  id: string;
  grade: SdGrade;
  operator: '+' | '-' | '×' | '÷';
  a: number;
  b: number;
  answer: number;
  options: number[];
  storyPrompt?: string;
  spokenPrompt: string;
  visualItem: 'apel' | 'bola' | 'ikan' | 'jeruk' | 'bunga';
}

export const WRITING_WORDS = ['Bola', 'Buku', 'Apel', 'Sapi', 'Ibu', 'Budi', 'Roti', 'Topi'];
export const WRITING_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const WRITING_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const WRITING_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'kelas1-budi',
    grade: 1,
    title: 'Bola Baru Budi',
    illustKey: 'bola',
    sentences: [
      'Ini bola milik Budi.',
      'Bola Budi berwarna merah, kuning, dan biru.',
      'Budi main bola di halaman rumah.',
      'Budi senang bermain bersama teman.',
    ],
    question: 'Di mana Budi bermain bola?',
    options: ['Di halaman rumah', 'Di dalam kamar', 'Di pasar'],
    answerIdx: 0,
  },
  {
    id: 'kelas1-apel',
    grade: 1,
    title: 'Apel Manis Ibu',
    illustKey: 'apel',
    sentences: [
      'Ibu pergi ke pasar pagi hari.',
      'Ibu membeli lima buah apel merah.',
      'Apel dicuci bersih sebelum dimakan.',
      'Rasanya sangat manis dan segar.',
    ],
    question: 'Berapa buah apel yang dibeli Ibu?',
    options: ['Tiga buah', 'Lima buah', 'Sepuluh buah'],
    answerIdx: 1,
  },
  {
    id: 'kelas2-sapi',
    grade: 2,
    title: 'Sapi di Padang Rumput',
    illustKey: 'sapi',
    sentences: [
      'Pak Tani memelihara dua ekor sapi sehat.',
      'Setiap pagi sapi makan rumput hijau yang segar.',
      'Sapi menghasilkan susu putih yang kaya gizi.',
      'Adik rajin minum segelas susu sebelum sekolah.',
    ],
    question: 'Apa yang dimakan sapi setiap pagi?',
    options: ['Roti manis', 'Rumput hijau', 'Buah jeruk'],
    answerIdx: 1,
  },
  {
    id: 'kelas2-kucing',
    grade: 2,
    title: 'Miko Si Kucing Lucu',
    illustKey: 'kucing',
    sentences: [
      'Rina punya kucing bernama Miko.',
      'Bulu Miko berwarna oranye dan sangat halus.',
      'Miko suka sekali makan ikan goreng.',
      'Setelah kenyang, Miko tidur di atas sofa.',
    ],
    question: 'Apa makanan kesukaan Miko?',
    options: ['Ikan goreng', 'Wortel rebus', 'Pisang kuning'],
    answerIdx: 0,
  },
  {
    id: 'kelas3-pelangi',
    grade: 3,
    title: 'Pelangi Setelah Hujan',
    illustKey: 'pelangi',
    sentences: [
      'Sore itu hujan turun membasahi taman sekolah.',
      'Tidak lama kemudian, matahari kembali bersinar hangat.',
      'Di langit timur muncul pelangi melengkung warna-warni.',
      'Anak-anak menghitung tujuh warna indah pada pelangi itu.',
    ],
    question: 'Kapan pelangi muncul di langit timur?',
    options: [
      'Saat tengah malam',
      'Setelah hujan berhenti dan matahari bersinar',
      'Sebelum matahari terbit',
    ],
    answerIdx: 1,
  },
  {
    id: 'kelas3-kebun',
    grade: 3,
    title: 'Menanam Bunga Bersama',
    illustKey: 'bunga',
    sentences: [
      'Siswa kelas tiga bekerja bakti merawat taman sekolah.',
      'Mereka menanam bibit bunga mawar dan melati di pot.',
      'Setiap hari tanaman disiram air agar tumbuh subur.',
      'Taman sekolah pun menjadi sejuk, rapi, dan indah dipandang.',
    ],
    question: 'Mengapa tanaman disiram air setiap hari?',
    options: [
      'Agar tumbuh subur dan indah',
      'Agar daunnya cepat rontok',
      'Agar menjadi layu',
    ],
    answerIdx: 0,
  },
];

function numberToWords(n: number): string {
  const units = [
    'nol',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];
  if (n < 12) return units[n];
  if (n < 20) return `${units[n - 10]} belas`;
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const rem = n % 10;
    return rem === 0 ? `${units[tens]} puluh` : `${units[tens]} puluh ${units[rem]}`;
  }
  if (n === 100) return 'seratus';
  return String(n);
}

function buildOptions(answer: number, minVal = 0): number[] {
  const set = new Set<number>([answer]);
  const deltas = [-3, -2, -1, 1, 2, 3, 4, -4, 5, 10, -10];
  while (set.size < 4) {
    const delta = deltas[Math.floor(Math.random() * deltas.length)];
    const candidate = answer + delta;
    if (candidate >= minVal && candidate !== answer) {
      set.add(candidate);
    }
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

const VISUAL_ITEMS: MathQuestion['visualItem'][] = [
  'apel',
  'bola',
  'ikan',
  'jeruk',
  'bunga',
];

export function generateMathQuestion(grade: SdGrade): MathQuestion {
  const visualItem = VISUAL_ITEMS[Math.floor(Math.random() * VISUAL_ITEMS.length)];
  const id = `${grade}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  if (grade === 1) {
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      const a = Math.floor(Math.random() * 9) + 1; // 1..9
      const b = Math.floor(Math.random() * 9) + 1; // 1..9
      const answer = a + b;
      return {
        id,
        grade,
        operator: '+',
        a,
        b,
        answer,
        options: buildOptions(answer, 1),
        spokenPrompt: `Berapakah hasil dari ${numberToWords(a)} ditambah ${numberToWords(b)}?`,
        visualItem,
      };
    } else {
      const b = Math.floor(Math.random() * 7) + 1; // 1..7
      const answer = Math.floor(Math.random() * 8) + 1; // 1..8
      const a = b + answer;
      return {
        id,
        grade,
        operator: '-',
        a,
        b,
        answer,
        options: buildOptions(answer, 0),
        spokenPrompt: `Berapakah hasil dari ${numberToWords(a)} dikurangi ${numberToWords(b)}?`,
        visualItem,
      };
    }
  }

  if (grade === 2) {
    const mode = Math.random();
    if (mode < 0.4) {
      const a = Math.floor(Math.random() * 25) + 11; // 11..35
      const b = Math.floor(Math.random() * 19) + 5; // 5..23
      const answer = a + b;
      return {
        id,
        grade,
        operator: '+',
        a,
        b,
        answer,
        options: buildOptions(answer, 10),
        spokenPrompt: `Hitunglah ${numberToWords(a)} ditambah ${numberToWords(b)}!`,
        visualItem,
      };
    } else if (mode < 0.7) {
      const b = Math.floor(Math.random() * 14) + 5;
      const answer = Math.floor(Math.random() * 20) + 10;
      const a = b + answer;
      return {
        id,
        grade,
        operator: '-',
        a,
        b,
        answer,
        options: buildOptions(answer, 1),
        spokenPrompt: `Hitunglah ${numberToWords(a)} dikurangi ${numberToWords(b)}!`,
        visualItem,
      };
    } else {
      const a = Math.floor(Math.random() * 4) + 2; // 2..5 kelompok
      const b = Math.floor(Math.random() * 5) + 2; // 2..6 isi
      const answer = a * b;
      return {
        id,
        grade,
        operator: '×',
        a,
        b,
        answer,
        options: buildOptions(answer, 2),
        storyPrompt: `Ada ${a} keranjang, setiap keranjang berisi ${b} buah.`,
        spokenPrompt: `Ada ${numberToWords(a)} keranjang, setiap keranjang berisi ${numberToWords(b)} buah. Berapa jumlah seluruhnya?`,
        visualItem,
      };
    }
  }

  // Grade 3 SD: Perkalian 4..9, Pembagian habis, Soal Cerita
  const isDivide = Math.random() > 0.5;
  if (isDivide) {
    const b = Math.floor(Math.random() * 5) + 2; // 2..6
    const answer = Math.floor(Math.random() * 6) + 2; // 2..7
    const a = b * answer;
    return {
      id,
      grade,
      operator: '÷',
      a,
      b,
      answer,
      options: buildOptions(answer, 1),
      storyPrompt: `Ibu punya ${a} benda dan dibagikan sama rata ke ${b} anak.`,
      spokenPrompt: `${numberToWords(a)} dibagi ${numberToWords(b)} sama dengan berapa?`,
      visualItem,
    };
  } else {
    const a = Math.floor(Math.random() * 6) + 4; // 4..9
    const b = Math.floor(Math.random() * 7) + 3; // 3..9
    const answer = a * b;
    return {
      id,
      grade,
      operator: '×',
      a,
      b,
      answer,
      options: buildOptions(answer, 4),
      storyPrompt: `Di kelas ada ${a} meja, setiap meja diletakkan ${b} buku.`,
      spokenPrompt: `Berapakah hasil dari ${numberToWords(a)} dikali ${numberToWords(b)}?`,
      visualItem,
    };
  }
}
