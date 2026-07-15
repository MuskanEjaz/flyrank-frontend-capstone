# TaskFlow

TaskFlow is a frontend capstone project for FE-04 focused on a polished task management experience. The app uses the Next.js App Router with server-rendered placeholder screens for a landing page, dashboard, tasks workspace, settings, and deployment health monitoring.

## Project purpose

This project demonstrates a responsive, accessible, and deployment-aware frontend shell for a task management application without authentication or a database.

## Route specification

- `/` — professional landing page
- `/dashboard` — dashboard with placeholder statistics and recent tasks
- `/tasks` — task list placeholder
- `/tasks/new` — create-task form placeholder
- `/settings` — settings placeholder
- `/health` — deployment health-check page
- `/api/health` — JSON API returning status, application name, environment, and timestamp

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Environment variables

- `NEXT_PUBLIC_APP_URL` — base URL used by the health page and local development helpers. Default is `http://localhost:3000`.

## Health check details

The `/health` route fetches `/api/health` and renders the deployment status. The app constructs the base URL from `VERCEL_URL` or `NEXT_PUBLIC_APP_URL`, with `http://localhost:3000` as the fallback.

## Vercel deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the environment variable `NEXT_PUBLIC_APP_URL` to the deployed production URL.
4. Deploy the app and open the generated URL.
