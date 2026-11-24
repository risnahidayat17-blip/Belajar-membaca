import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

const ttsCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 250;

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/tts', async (req, res) => {
    try {
      const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const speed = req.body?.speed === 'slow' ? 'slow' : 'normal';

      if (!rawText || rawText.length > 400) {
        res.status(400).json({ error: 'Teks tidak valid untuk dibacakan.' });
        return;
      }

      const cacheKey = `${speed}::${rawText.toLowerCase()}`;
      const cachedAudio = ttsCache.get(cacheKey);
      if (cachedAudio) {
        res.json({ audioBase64: cachedAudio, mimeType: 'audio/wav', cached: true });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({ error: 'Layanan suara anak belum dikonfigurasi.' });
        return;
      }

      const pacingNote =
        speed === 'slow'
          ? 'Indonesian language (Bahasa Indonesia) only. Cute, cheerful 5-year-old Indonesian kindergarten child voice (suara anak kecil TK Indonesia yang sangat imut, ceria, dan polos), bright youthful childlike tone, speaking extra slowly, calmly, and crystal clearly syllable by syllable with pure Indonesian vowels.'
          : 'Indonesian language (Bahasa Indonesia) only. Cute, cheerful 5-year-old Indonesian kindergarten child voice (suara anak kecil TK Indonesia yang ceria, imut, dan bersemangat), bright youthful childlike tone, speaking slowly and gently with authentic Indonesian pronunciation.';

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
        res.status(502).json({ error: 'Gagal menghasilkan audio suara anak.' });
        return;
      }

      if (ttsCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = ttsCache.keys().next().value;
        if (oldestKey) ttsCache.delete(oldestKey);
      }
      ttsCache.set(cacheKey, base64Audio);

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      const message = errorObj?.message || 'Terjadi gangguan saat membuat suara anak.';
      console.error('TTS generation error:', status, message);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bacalah Ceria server running on port ${PORT}`);
  });
}

startServer();
