# BlueMinds AI Agent — Frontend

React + Vite + TypeScript frontend deployed on Vercel.

## Environment Variables (set in Vercel dashboard)

- `VITE_API_BASE_URL` — Backend API URL (from Render)
- `VITE_SOCKET_URL` — Backend socket URL (same as API URL)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/publishable key

## Features

- Google OAuth sign-in (via Supabase)
- Real-time AI chat with streaming responses
- Multiple AI models (Kimi 2.6, Claude Opus 4.7, Claude Sonnet 4.6, GPT-4o, Gemini 2.0 Flash)
- Interactive terminal with xterm.js
- Code execution with Monaco editor integration
- GitHub & Render integrations
- Task planning UI
- Dark theme with framer-motion animations
