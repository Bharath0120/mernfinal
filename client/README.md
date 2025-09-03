# Knowledge Hub - Client (Vite + React + Tailwind)

## Setup

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start dev server (default port 5173):
   ```bash
   npm run dev
   ```

3. The client expects the backend API at http://localhost:5000/api
   If your backend runs elsewhere set VITE_API_URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
