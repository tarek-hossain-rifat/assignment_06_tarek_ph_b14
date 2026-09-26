# FitLog — Workout Library

A dark, responsive workout library and daily planning app built with Next.js App Router and Tailwind CSS.

## Technologies
- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Lucide React icons
- FitLog REST API
- localStorage for plan/saved persistence

## Key Features
1. Responsive workout library with loading animation.
2. Workout detail pages with equipment, difficulty, sets, reps and instructions.
3. Today's Plan with a five-workout cap, live minutes/calories metrics and Mark as Done.
4. Saved workouts with a dedicated tab.
5. Toast notifications for plan/save/remove/done actions.
6. Duration, calories and rating sorting.
7. Persistent navbar counters and fixed footer.
8. 404 page and deployment-safe App Router routes.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_FITLOG_API_URL=https://api.abcz.workers.dev/api/fitlog
```

The provided API is public, so this variable is configuration rather than a secret. Never put private API keys in a `NEXT_PUBLIC_*` variable.

## Build

```bash
npm run build
npm start
```
