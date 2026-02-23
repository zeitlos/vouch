# Vouch Demo Script

A complete recording script for showcasing Lucity using the Vouch feedback board app.

**Total runtime**: ~8–10 minutes
**Prerequisites**: Lucity cluster running, GitHub App installed on `zeitlos` org, `zeitlos/vouch` repo on GitHub (main branch = base app, `feature/status-filter` branch ready).

---

## Pre-Recording Checklist

- [ ] Lucity dashboard open at `http://localhost:5173` (or your domain)
- [ ] Logged in via GitHub OAuth
- [ ] No existing "vouch" project (clean slate)
- [ ] Terminal open with `vouch` repo checked out on `main`
- [ ] `feature/status-filter` branch exists on remote but **not** merged
- [ ] Browser zoomed to ~110% for readability on video
- [ ] Dashboard in light mode

---

## Act 1: First Deploy (~2 min)

### Scene 1 — The Empty Dashboard

> *Open the dashboard. The Projects page is visible — clean, maybe one or two other projects.*

**Narration:**
"Let's deploy an app to Lucity. I've got a Next.js feedback board on GitHub — let's see how fast we can get it running."

### Scene 2 — Create the Project

1. **Click** the **"New"** button (top-right, plus icon)
2. The **Command Palette** opens in the center of the screen
3. **Click** **"GitHub Repository"**
4. The palette drills into the repo list — repos load from GitHub
5. **Type** `vouch` in the search box to filter
6. **Click** the **`zeitlos/vouch`** repo

> *The palette closes. Lucity auto-detects the Next.js service, creates the project, and triggers the first build. You're redirected to the project canvas.*

**Narration:**
"Lucity sees the GitHub repo, auto-detects it's a Next.js app, picks the right port, and kicks off the first build."

### Scene 3 — Watch the Build

> *The project canvas shows a service node. Click it to open the service panel on the right. The Deployments tab is active, showing the build pipeline.*

1. **Click** the **service node** on the canvas (the Vouch service)
2. The **ServicePanel** slides in from the right
3. The **Deployments tab** shows the active deploy with pipeline stages:
   - **Initializing** ✓ → **Building** ⟳ → **Deploying** ○

**Narration:**
"Here's the build pipeline. Lucity clones the repo, builds the Docker image using Railpack — that's automatic framework detection, no Dockerfile needed — pushes it to the registry, and deploys it."

> *Wait for the build to progress. This takes ~60–90 seconds. You can narrate over the stages as they complete.*

4. Once **Deploying** completes, the status shows **SUCCEEDED** with a green checkmark

**Narration:**
"And we're live. First deploy — zero config. No Dockerfile, no build pipeline to set up, no YAML to write."

### Scene 4 — Visit the App (No Database Yet)

> *The service instance now shows a host. Open the app in a new tab.*

**Narration:**
"Let's open the app."

> *The Vouch app loads showing the amber "Database not connected" banner:*
> *"Set the `DATABASE_URL` environment variable to connect a PostgreSQL database."*

**Narration:**
"The app is running, but it needs a database. It's telling us exactly what it needs — a `DATABASE_URL`. Let's give it one."

---

## Act 2: Database & Environment Variables (~2 min)

### Scene 5 — Create a PostgreSQL Database

1. Switch back to the **Lucity dashboard** tab
2. **Click** the **"Create"** button (top-right on the canvas, or use the "New" palette)
3. The **Command Palette** opens
4. **Click** **"PostgreSQL Database"**
5. Leave the name as **"main"** (or type it)
6. Note the description: *"PostgreSQL 16 · 1 instance · 10Gi storage"*
7. **Click** **"Create Database"**

> *A database node appears on the canvas with a blue icon.*

**Narration:**
"One click — we've got a managed PostgreSQL database. CloudNativePG under the hood, fully managed, backups included."

### Scene 6 — Set Environment Variables

1. **Click** the **service node** to re-open the service panel
2. **Click** the **"Variables"** tab

**Narration:**
"Now let's wire the database to our app."

3. **Click** **"Add Variable"**
4. Type `DATABASE_URL` as the key
5. For the value, type the PostgreSQL connection string (or paste it from the database panel)
   - *Tip: you can get the internal DNS from the database panel's connection info*
6. **Click** **"Add Variable"** again
7. Type `BOARD_TITLE` as the key, `Acme Roadmap (Development)` as the value
8. **Click** **"Add Variable"** again
9. Type `BOARD_DESCRIPTION` as the key, `Tell us what to build next.` as the value
10. **Click** **"Save"**

> *A small badge shows the save was successful. The service redeploys with the new variables.*

**Narration:**
"Three environment variables: the database connection, a custom board title, and a description. These are scoped to the development environment — production will have different values."

### Scene 7 — The App, Now with a Database

> *Switch to the app tab. Refresh the page.*

> *The amber banner is gone. The page now shows:*
> - **Heading**: "Acme Roadmap (Development)"
> - **Subtitle**: "Tell us what to build next."
> - **Empty state**: "No feedback yet — Be the first to submit a feature request!"

**Narration:**
"The database connected, the table was created automatically, and our custom title is showing. Let's add some data."

### Scene 8 — Add Feedback Posts

1. **Click** **"Submit Feedback"**
2. Type title: `Dark mode support`
3. Type description: `Would love a dark mode option for late-night usage.`
4. **Click** **"Submit"**
5. **Click** **"Submit Feedback"** again
6. Type title: `API rate limiting`
7. Type description: `Need configurable rate limits per API key.`
8. **Click** **"Submit"**
9. **Click** **"Submit Feedback"** one more time
10. Type title: `Export to CSV`
11. Leave description empty
12. **Click** **"Submit"**

> *Three posts are now visible with vote buttons, status badges (all "Open"), and timestamps.*

13. **Click** the **upvote button** on "Dark mode support" a few times
14. **Click** the **upvote button** on "API rate limiting" once

> *Posts reorder by vote count. "Dark mode support" floats to the top.*

**Narration:**
"Real data, persistent in PostgreSQL, sorted by votes. Let's take a look at what's in the database."

---

## Act 3: Database Console (~1 min)

### Scene 9 — Browse the Table

1. Switch back to the **Lucity dashboard**
2. **Click** the **database node** on the canvas (blue icon)
3. The **DatabasePanel** opens with the **Tables** tab active
4. The `posts` table is listed: `~3 rows · 6 columns`
5. **Click** the **`posts` row** to open the data view

> *A table appears with columns: id, title, description, votes, status, created_at. The three posts are visible with their vote counts.*

**Narration:**
"Lucity gives you a database explorer right in the dashboard. No need for pgAdmin or a separate tool. You can see the posts table, browse the data, and even run queries."

### Scene 10 — Run a Query

1. **Click** the **"Query"** tab
2. Type in the query box:
   ```sql
   SELECT title, votes FROM posts ORDER BY votes DESC
   ```
3. **Press** **Cmd+Enter** (or click "Run Query")

> *Results appear: a clean table showing titles and vote counts, sorted.*

**Narration:**
"Full SQL access. Great for debugging, great for quick data checks."

---

## Act 4: Custom Domain (~30 sec)

### Scene 11 — Set a Domain

1. **Click** the **service node** to open the service panel
2. **Click** the **"Settings"** tab
3. Scroll to the **"Networking"** section
4. In the **Domain** field, type `feedback-dev.acme.com`
5. **Press** Enter

> *The domain appears as a badge. A small confirmation shows.*

**Narration:**
"Custom domains are just a hostname. Lucity creates the HTTPRoute using the Gateway API — standard Kubernetes networking, no proprietary load balancer."

> *Briefly show the private networking DNS name below — the internal service URL.*

**Narration:**
"You also get internal DNS for service-to-service communication."

---

## Act 5: CI/CD Flow (~2 min)

### Scene 12 — Push a Code Change

**Narration:**
"Now let's see the CI/CD flow. I want to add a filter bar so users can filter posts by status. I've got that ready in a branch — let me merge it."

1. Switch to the **terminal**
2. Run:
   ```bash
   cd ~/Code/vouch
   git merge feature/status-filter
   git push
   ```

> *Show the terminal output — the merge and push complete in seconds.*

**Narration:**
"One merge, one push. Lucity watches the repo for changes."

### Scene 13 — Watch the Auto-Deploy

1. Switch back to the **Lucity dashboard**
2. **Click** the **service node** → **Deployments** tab

> *A new deploy has been triggered automatically. The pipeline shows:*
> - **Initializing** ✓ → **Building** ⟳ → **Deploying** ○

**Narration:**
"Lucity detected the push, triggered a new build, and is deploying the update. No GitHub Actions to configure, no webhook setup — it just works."

> *Wait for the build to complete (~60–90 sec). The deployment history below now shows two entries — the original deploy and the new one.*

3. Once deployed, **point out** the deployment history:
   - First deploy: "Feedback board with Next.js + PostgreSQL"
   - New deploy: "Add status filter bar" — marked as **Active**

**Narration:**
"Both deploys are in the history. You can roll back to any previous version with one click."

### Scene 14 — See the Change Live

> *Switch to the app tab. Refresh.*

> *The status filter bar is now visible — pill-shaped buttons: All, Open, Planned, In Progress, Done. The "All" button is active (violet).*

1. **Click** **"Open"** — only the three posts show (they're all open)
2. **Click** **"Done"** — shows "No done posts" empty state
3. **Click** **"All"** — back to full list

**Narration:**
"The filter bar is live. Pushed code, auto-built, auto-deployed. That's the full CI/CD loop."

---

## Act 6: Environment Promotion (~2 min)

### Scene 15 — Create a Production Environment

1. Switch back to the **Lucity dashboard**
2. **Click** the **Environment Switcher** in the breadcrumb (shows "development ▼")
3. The dropdown opens showing the current environment with a sync status badge
4. **Click** **"New Environment"**
5. The **Create Environment** dialog opens
6. Type name: `production`
7. Set **"Clone from"**: `development`
8. **Click** **"Create"**

> *The environment switches to "production". The canvas shows the same service and database, cloned from development.*

**Narration:**
"We just created a production environment, cloned from development. Same service config, same database setup. But production gets its own namespace, its own resources."

### Scene 16 — Set Production Variables

1. **Click** the **service node** → **"Variables"** tab
2. The variables are cloned from development — `DATABASE_URL`, `BOARD_TITLE`, `BOARD_DESCRIPTION`
3. **Change** `BOARD_TITLE` to `Acme Roadmap` (remove the "(Development)" suffix)
4. **Click** **"Save"**

**Narration:**
"Production gets its own environment variables. Same DATABASE_URL structure pointing to the production database, but the title drops the 'Development' label. This is how you differentiate environments — same code, different config."

### Scene 17 — Promote

1. **Click** the **Deployments** tab
2. The production environment hasn't deployed yet (or shows the initial cloned image)

> *Now trigger the promotion.*

3. Switch the **Environment Switcher** back to **"development"**
4. On the service's **Deployments** tab, find the active deployment
5. Note the image tag (commit hash)

**Narration:**
"Development is running the latest build with the status filter. Let's promote that exact image to production."

6. Switch the **Environment Switcher** to **"production"**
7. The deploy triggers (either via a promote action or by deploying the same image tag)

> *If the UI has a promote button or you need to use the deploy mechanism — show whichever flow is available. The key point is: same image, no rebuild.*

**Narration:**
"Promotion copies the image tag — it doesn't rebuild. The exact same artifact that was tested in development is now running in production. No 'works on my machine' surprises."

### Scene 18 — Production App

> *Open the production URL in a new tab (or navigate to the production domain).*

> *The app loads showing:*
> - **Heading**: "Acme Roadmap" (no "(Development)")
> - The status filter bar is there (promoted from dev)
> - A fresh, empty database (production has its own)

**Narration:**
"Same code, different config. Production has its own database, its own domain, its own variables. The title says 'Acme Roadmap' — clean, professional, ready for users."

---

## Act 7: Closing (~30 sec)

### Scene 19 — The Canvas Overview

> *Switch back to the dashboard. Show the project canvas with both the service node and database node. Switch between environments in the breadcrumb to show they're independent.*

**Narration:**
"That's Lucity. We went from a GitHub repo to a fully deployed application with a managed database, environment variables, custom domains, CI/CD, and production promotion — in under ten minutes."

### Scene 20 — The Ejectability Tease

**Narration:**
"And here's the thing that makes Lucity different from Railway or Render: everything you just saw is standard Kubernetes under the hood. Helm charts, ArgoCD, Gateway API, CloudNativePG. If you ever outgrow the platform, run `lucity eject` and you get the raw infrastructure-as-code. No lock-in, no migration headaches. Your infrastructure is always yours."

> *Optional: briefly show the Eject button in project settings (don't click it — just show it exists).*

**Narration:**
"Lucity — deploy fast, own everything."

> *End recording.*

---

## Timing Guide

| Act | Duration | Content |
|-----|----------|---------|
| 1 — First Deploy | ~2:00 | Create project, watch build, see empty app |
| 2 — Database & Vars | ~2:00 | Create DB, set env vars, add data |
| 3 — DB Console | ~1:00 | Browse table, run query |
| 4 — Custom Domain | ~0:30 | Set domain, show networking |
| 5 — CI/CD | ~2:00 | Push code, watch auto-deploy, see change |
| 6 — Promotion | ~2:00 | Create prod env, set vars, promote, verify |
| 7 — Closing | ~0:30 | Canvas overview, ejectability pitch |
| **Total** | **~10:00** | |

---

## Tips for Recording

- **Pace**: Don't rush. Let the UI breathe. Viewers need time to read what's on screen.
- **Build waits**: During the ~60s build times, narrate what's happening. Explain Railpack, the registry push, ArgoCD sync. Don't fast-forward — the speed IS the demo.
- **Mouse movement**: Move the cursor deliberately. Hover over elements before clicking so viewers can follow.
- **Errors**: If anything fails, it's okay. Show the error, explain it, fix it. Real demos build trust.
- **Browser tabs**: Keep it simple. Dashboard tab + App tab + Terminal. Name them clearly.
- **Terminal**: Use a clean terminal with a readable font size. No cluttered prompt.
- **Don't show passwords**: Be careful with DATABASE_URL values. Use generic connection strings or blur if needed.

---

## Fallback Plan

If the build takes too long or something breaks mid-recording:

- **Build too slow**: Pre-record the build wait and splice it, or narrate over it with an architecture diagram
- **Database won't connect**: Double-check the connection string format. The internal DNS is `<project>-lucity-app-<dbname>.<namespace>.svc.cluster.local:5432`
- **Webhook doesn't fire**: Manually trigger a deploy from the dashboard (Deploy button) while explaining the webhook is usually automatic
- **App shows errors**: Great! Show the logs panel — it's a feature, not a bug. Debug live.
