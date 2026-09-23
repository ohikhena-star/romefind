# Deploying ROMEfind to Vercel (Production Guide)

This guide walks you through deploying **ROMEfind** (React Frontend + Express API + Prisma + PostgreSQL) to **Vercel** with zero hassle.

---

## Architecture on Vercel

- **Frontend**: React 18 SPA built with Vite (hosted on Vercel Global Edge Network).
- **Backend API**: Express & Opportunity Intelligence Engine running as Vercel Serverless Functions on `/api/*`.
- **Database**: Cloud PostgreSQL (Supabase, Neon, or Vercel Postgres).

---

## Step 1: Create a Free Cloud Database

Since Vercel is serverless, you need a cloud-hosted PostgreSQL database (free tier works great):

### Option A: Neon.tech (Recommended - Takes 1 minute)
1. Go to [https://neon.tech](https://neon.tech) and sign up for free.
2. Click **Create Project**, name it `romefind-db`.
3. Copy the **Connection String** (looks like `postgresql://alex:...@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).

### Option B: Supabase
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In Project Settings $\to$ Database $\to$ Copy the **URI Connection String** (Session Pooler or Direct).

---

## Step 2: Initialize & Seed the Database

In your local terminal inside `C:\Users\UserTwo\.gemini\antigravity\scratch\romefind`:

1. Copy the PostgreSQL schema:
   ```bash
   cp server/prisma/schema.postgresql.prisma server/prisma/schema.prisma
   ```
   *(On Windows PowerShell: `Copy-Item server/prisma/schema.postgresql.prisma server/prisma/schema.prisma`)*

2. Push schema to your cloud database:
   ```bash
   npx prisma db push --schema=server/prisma/schema.prisma
   ```
   *(Make sure your `DATABASE_URL` in `server/.env` is set to your Neon/Supabase connection string)*

3. Seed initial curated opportunities, organizations, and learning resources:
   ```bash
   npm run server:seed
   ```

---

## Step 3: Push to GitHub / GitLab

1. Initialize git if not already done:
   ```bash
   git init
   git add .
   git commit -m "ROMEfind production release"
   ```
2. Create a new GitHub repository and push your code:
   ```bash
   git remote add origin https://github.com/your-username/romefind.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 4: Import into Vercel

1. Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** $\to$ **Project**.
3. Select your `romefind` GitHub repository.
4. In the Project Configuration:
   - **Framework Preset**: `Vite` (Vercel detects this automatically).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run vercel-build` (pre-configured in `vercel.json`).
   - **Output Directory**: `dist` (pre-configured in `vercel.json`).
5. Expand **Environment Variables** and add:
   - `DATABASE_URL` = *(Your Neon / Supabase connection string)*
   - `JWT_SECRET` = `romefind_super_secret_jwt_key_2026_prod` (or any secure random string)
   - `NODE_ENV` = `production`
6. Click **Deploy**! 🚀

---

## Step 5: Test Live Deployment

Once Vercel finishes deploying (usually ~45 seconds):
- Visit `https://your-project.vercel.app/`
- Test registration/login (`alex.chen@example.com` / `password123` or create a new account)
- Explore and filter opportunities
- Add opportunities to compare at `/compare`
- Track applications, add tasks, and report acceptance outcomes!
