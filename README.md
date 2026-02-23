# Vouch

A lightweight feedback board where users submit feature requests and vote on what matters most.

Built with Next.js, PostgreSQL, and Tailwind CSS.

## Quick Start

```bash
npm install
cp .env.example .env   # then set DATABASE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BOARD_TITLE` | No | Page heading (default: "Vouch") |
| `BOARD_DESCRIPTION` | No | Subtitle text (default: "Share feedback, vote on features.") |

The database table is created automatically on first request — no migrations needed.

## Stack

- [Next.js](https://nextjs.org) 15 (App Router)
- [PostgreSQL](https://www.postgresql.org) via `pg`
- [Tailwind CSS](https://tailwindcss.com) v4
- TypeScript
