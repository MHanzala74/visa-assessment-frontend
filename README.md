# Points Check — Visa Assessment Frontend

React frontend for the Visa Assessment backend (FastAPI + PostgreSQL on Render).

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Backend URL

The API base URL is set in `src/lib/api.js`:
```js
export const BASE_URL = "https://visa-assessment-1.onrender.com";
```
Change this if your backend URL changes.

## Pages / Routes

- `/` — Landing page
- `/auth` — Sign up / Sign in (Basic Auth, stored in localStorage)
- `/profile` — Submit applicant profile (maps to POST /profile)
- `/assessment` — Look up assessment by phone (GET /visa/{phone}) + score graph (GET /visa/{phone}/graph)
- `/resume` — Upload PDF resume for AI analysis (POST /analyze-resume)

## Build for production

```bash
npm run build
```
Output goes to `dist/` — deploy that folder to Vercel, Netlify, or any static host.

## Important: Backend CORS

Make sure the FastAPI backend has CORSMiddleware enabled (already added to main.py in this project) and redeployed on Render, otherwise the browser will block requests from this frontend's origin.
