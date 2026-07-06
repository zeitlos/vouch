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
| `S3_BUCKET` | No | Bucket for image uploads. Enables the feature when set (with credentials). |
| `S3_ACCESS_KEY_ID` | No | S3 access key |
| `S3_SECRET_ACCESS_KEY` | No | S3 secret key |
| `S3_ENDPOINT` | No | S3-compatible endpoint URL (omit for AWS S3) |
| `S3_REGION` | No | S3 region (default: `us-east-1`) |
| `S3_FORCE_PATH_STYLE` | No | Use path-style addressing (default: `true`) |

The database table is created automatically on first request — no migrations needed.

## Image uploads

Image uploads are **optional**. When `S3_BUCKET` and credentials are configured, an
"Attach image" control appears on the feedback form and images render on each post.
Without them, the feature is hidden and everything else works unchanged. Uploads are
proxied through the app (`/api/upload` to store, `/api/images/...` to serve), so the
bucket does not need to be publicly readable and credentials never reach the browser.

## Stack

- [Next.js](https://nextjs.org) 15 (App Router)
- [PostgreSQL](https://www.postgresql.org) via `pg`
- [Tailwind CSS](https://tailwindcss.com) v4
- TypeScript
