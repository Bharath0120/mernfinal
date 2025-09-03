const axios = require('axios');
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();
if (!GEMINI_API_KEY) console.warn('GEMINI_API_KEY not set — Gemini calls will fail');

// Correct Gemini base endpoint
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Generate summary + tags
async function generateSummaryAndTags(text) {
  const prompt = `Summarize the following document in 2-3 short paragraphs. 
Then list 6-10 concise tags (comma separated) for indexing.

DOCUMENT:
${text}

Return JSON with keys: summary, tags (an array).`;

  try {
    const resp = await axios.post(
      `${GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const raw = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    try {
      const jsonStart = raw.indexOf('{');
      const jsonText = raw.slice(jsonStart);
      const parsed = JSON.parse(jsonText);
      return { summary: parsed.summary || raw, tags: parsed.tags || [] };
    } catch (e) {
      const summary = raw.split('\n\n')[0];
      const tagLine = raw.split('\n').find(l => l.toLowerCase().includes('tags'));
      const tags = tagLine
        ? tagLine.split(':').pop().split(',').map(t => t.trim()).filter(Boolean)
        : [];
      return { summary, tags };
    }
  } catch (e) {
    console.warn('Gemini generate error', e.response?.data || e.message);
    return { summary: '', tags: [] };
  }
}

// Generate embeddings
async function getEmbedding(text) {
  try {
    const resp = await axios.post(
      `${GEMINI_BASE}/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`,
      {
        content: { parts: [{ text }] },
      }
    );
    return resp.data?.embedding?.values || [];
  } catch (e) {
    console.warn('Gemini embed error', e.response?.data || e.message);
    return null;
  }
}

// Q&A from docs
async function generateAnswerFromContext(question, contexts = []) {
  const contextText = contexts
    .map((c, i) => `DOC ${i + 1} - ${c.title}\n${c.summary || c.content}`)
    .join('\n\n----\n\n');

  const prompt = `You are an assistant answering using ONLY the provided documents. 
If asked outside these docs say you don't know. 
Provide a concise helpful answer and list which documents you used.

CONTEXT:
${contextText}

QUESTION: ${question}

Answer:`;

  try {
    const resp = await axios.post(
      `${GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );
    return resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (e) {
    console.warn('Gemini answer error', e.response?.data || e.message);
    return 'Error generating answer';
  }
}

module.exports = { generateSummaryAndTags, getEmbedding, generateAnswerFromContext };
