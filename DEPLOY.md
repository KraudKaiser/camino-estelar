# Camino Estelar — Deploy Guide (Free Tier)

Deploy the frontend on **Vercel** and the backend + database on **Render**. Total cost: **$0/month**.

---

## Prerequisites

- A GitHub account
- A Vercel account (free): https://vercel.com
- A Render account (free): https://render.com
- A MercadoPago account (for real payments)

---

## Step 1: Push to GitHub

Create a GitHub repository and push the project:

```bash
cd turnos-medicos
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USER/camino-estelar.git
git push -u origin main
```

---

## Step 2: Deploy the Backend (Render)

### 2.1 Create a new Web Service

1. Go to https://render.com → Sign up / Log in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `camino-estelar-api`
   - **Region:** Oregon (US West) or closest to your users
   - **Branch:** `main`
   - **Runtime:** Docker
   - **Dockerfile path:** `./backend/Dockerfile`
   - **Docker context:** `./backend`
   - **Plan:** Free

### 2.2 Create a PostgreSQL Database

1. In Render dashboard → **New +** → **PostgreSQL**
2. Configure:
   - **Name:** `camino-estelar-db`
   - **Database:** `camino_estelar`
   - **User:** `camino_estelar`
   - **Plan:** Free
3. After creation, copy the **Internal Database URL** (looks like `postgres://user:pass@dpg-xxx.oregon-postgres.render.com/camino_estelar`)

### 2.3 Set Environment Variables

In your Web Service → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the Internal Database URL from step 2.2 |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Generate a random string (e.g., run `openssl rand -hex 32` in terminal) |
| `FRONTEND_URL` | Your Vercel URL (you'll get this in Step 3 — for now use `https://camino-estelar.vercel.app`) |
| `MERCADOPAGO_ACCESS_TOKEN` | Your MercadoPago access token |
| `MERCADOPAGO_PUBLIC_KEY` | Your MercadoPago public key |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your email address |
| `SMTP_PASS` | Your app password (see Step 6) |
| `ADMIN_EMAIL` | Your admin email |
| `WHATSAPP_NUMBER` | `5491112345678` (your WhatsApp number) |
| `PORT` | `4000` |

### 2.4 Deploy

Click **Create Web Service**. Render will build and deploy automatically. Wait for the first deploy to finish (2-5 minutes).

### 2.5 Run Database Migrations + Seed

Once deployed, go to your Web Service → **Shell** tab (or use Render's SSH):

```bash
npx prisma migrate deploy
npx tsx src/prisma/seed.ts
```

Or connect to your database externally with a tool like [TablePlus](https://tableplus.com) and run the migration SQL manually.

**Alternative:** You can add a render startup command or use the Render Shell to run these commands after the first deploy.

### 2.6 Verify

Visit `https://camino-estelar-api.onrender.com/api/health`

You should see:
```json
{"status":"ok","timestamp":"..."}
```

---

## Step 3: Deploy the Frontend (Vercel)

### 3.1 Create a new Project

1. Go to https://vercel.com → Sign up / Log in
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### 3.2 Set Environment Variables

Add these environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://camino-estelar-api.onrender.com` |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Your MercadoPago public key |

### 3.3 Deploy

Click **Deploy**. Vercel will build and deploy in ~30 seconds.

### 3.4 Get Your URL

After deployment, Vercel gives you a URL like `https://camino-estelar-xxxxx.vercel.app`. **Copy this URL.**

### 3.5 Update Backend CORS

Go back to Render → your backend service → **Environment** tab:

Update `FRONTEND_URL` to your actual Vercel URL:
```
https://camino-estelar-xxxxx.vercel.app
```

Then trigger a **manual redeploy** in Render (or wait for next auto-deploy).

### 3.6 Verify

Visit your Vercel URL. You should see the Camino Estelar homepage with services.

---

## Step 4: Test the Full Flow

1. **Homepage:** Loads services from the backend ✓
2. **Service detail:** Click a service → shows details ✓
3. **Checkout:** Fill form, select payment method ✓
4. **Confirmation:** Shows order summary ✓
5. **Admin panel:** Go to `/admin` → login with `admin@example.com` / `admin123` ✓
6. **Email:** Check if confirmation emails arrive (if SMTP is configured) ✓

---

## Step 5: MercadoPago Production (When Ready)

For now, MercadoPago is in test mode. To accept real payments:

1. Log in to https://www.mercadopago.com.ar
2. Go to **Tu Cuenta** → **Credenciales**
3. Copy your **Access Token** and **Public Key** (production, not test)
4. Update the Render environment variables:
   - `MERCADOPAGO_ACCESS_TOKEN` → production token
   - `MERCADOPAGO_PUBLIC_KEY` → production key
5. Update the Vercel environment variable:
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` → production key
6. Redeploy both services

---

## Step 6: Email Setup (Gmail)

If using Gmail for transactional emails:

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use that 16-character password as `SMTP_PASS`

---

## Step 7: Custom Domain (Optional)

When you're ready for a real domain:

### On Vercel:
1. Buy a domain (e.g., `caminoestelar.com.ar` from Nic.ar ~$10/year)
2. In Vercel → your project → **Settings** → **Domains**
3. Add your domain and follow the DNS instructions

### On Render:
1. In Render → your backend → **Settings** → **Custom Domains**
2. Add `api.caminoestelar.com.ar`
3. Update your DNS to point `api` subdomain to Render
4. Update `FRONTEND_URL` in Render env vars to your custom domain

---

## Troubleshooting

**Backend cold start (30 sec delay):**
- This is normal on Render free tier
- First request after idle takes ~30 seconds
- Subsequent requests are fast
- Consider upgrading to Render Starter ($7/month) if this becomes a problem

**CORS errors:**
- Make sure `FRONTEND_URL` in Render matches your exact Vercel URL (including `https://`)
- After changing it, redeploy the backend

**Database connection errors:**
- Make sure `DATABASE_URL` uses the **Internal** URL (not External) for Render-to-Render communication
- Check that `prisma migrate deploy` was run

**Build errors:**
- Check Render build logs for errors
- Make sure all environment variables are set

---

## Updating the App

After making code changes:

```bash
git add .
git commit -m "Your changes"
git push
```

- **Frontend (Vercel):** Auto-deploys from GitHub in ~30 seconds
- **Backend (Render):** Auto-deploys from GitHub in ~2-5 minutes
- **Database migrations:** Run manually via Render Shell after deploy:
  ```bash
  npx prisma migrate deploy
  ```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  Vercel (CDN)   │────▶│  Render (Backend)   │────▶│  Neon/Render │
│  Next.js        │     │  Express + Prisma   │     │  PostgreSQL  │
│  Free           │     │  Free (cold starts) │     │  Free        │
└─────────────────┘     └─────────────────────┘     └──────────────┘
```
