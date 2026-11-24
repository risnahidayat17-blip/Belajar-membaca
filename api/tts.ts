import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

type VercelRequest = IncomingMessage & {
  body?: Record<string, unknown> | string;
};

type VercelResponse = ServerResponse & {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
};

const ttsCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 250;

function sendJson(res: VercelResponse, statusCode: number, payload: unknown): void {
  if (typeof res.status === 'function') {
    const statusRes = res.status(statusCode);
    if (typeof statusRes.json === 'function') {
      statusRes.json(payload);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : (chunk as Buffer));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const rawText = typeof body.text === 'string' ? body.text.trim() : '';
    const speed = body.speed === 'slow' ? 'slow' : 'normal';

    if (!rawText || rawText.length > 400) {
      sendJson(res, 400, { error: 'Teks tidak valid untuk dibacakan.' });
      return;
    }

    const cacheKey = `${speed}::${rawText.toLowerCase()}`;
    const cachedAudio = ttsCache.get(cacheKey);
    if (cachedAudio) {
      sendJson(res, 200, {
        audioBase64: cachedAudio,
        mimeType: 'audio/wav',
        cached: true,
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      sendJson(res, 503, { error: 'Layanan suara anak belum dikonfigurasi.' });
      return;
    }

    const pacingNote =
      speed === 'slow'
        ? 'Indonesian language (Bahasa Indonesia) only. Cute, cheerful 5-year-old Indonesian kindergarten child voice (suara anak kecil TK Indonesia yang imut, ceria, dan polos), bright youthful childlike tone, speaking clearly at a natural relaxed pace—easy for kids to follow without dragging or sounding overly slow.'
        : 'Indonesian language (Bahasa Indonesia) only. Cute, cheerful 5-year-old Indonesian kindergarten child voice (suara anak kecil TK Indonesia yang ceria, imut, dan bersemangat), bright youthful childlike tone, speaking at a natural, lively, cheerful pace with clear Indonesian pronunciation.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: rawText,
              speechMetadata: {
                style: pacingNote,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data
    )?.inlineData?.data;

    if (!base64Audio) {
      sendJson(res, 502, { error: 'Gagal menghasilkan audio suara anak.' });
      return;
    }

    if (ttsCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = ttsCache.keys().next().value;
      if (oldestKey) ttsCache.delete(oldestKey);
    }
    ttsCache.set(cacheKey, base64Audio);

    sendJson(res, 200, { audioBase64: base64Audio, mimeType: 'audio/wav' });
  } catch (err: unknown) {
    const errorObj = err as { status?: number; message?: string };
    const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
    const message = errorObj?.message || 'Terjadi gangguan saat membuat suara anak.';
    console.error('Vercel TTS generation error:', status, message);
    sendJson(res, status >= 400 && status < 600 ? status : 500, { error: message });
  }
}
