# Knowledge Hub - Server (ready)

This server is prepared to run in Codespaces or locally. It uses Mongoose and integrates with Gemini for summaries, tags, embeddings and Q&A.

## Setup

1. Copy `.env.example` to `.env` and fill values. You can also set environment variables in Codespaces.
2. Install:
   ```
   cd server
   npm install
   ```
3. Run:
   ```
   npm run dev
   ```
The backend exposes endpoints under `/api/*`:
- `/api/auth` (register/login)
- `/api/docs` (CRUD, auto-summary on create/update)
- `/api/search/text?q=...`
- `/api/search/semantic?q=...`
- `/api/qa` (POST { question })

Note: The current Gemini HTTP endpoints in `services/gemini.js` may need adjustment depending on your access method (Vertex AI vs direct API key). If you use Vertex service account, use the official `@google-cloud/aiplatform` SDK instead.
