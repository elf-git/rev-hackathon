# Canteen Rush AI

## 🚀 Deployment Guide

This project is configured for **Netlify** (Frontend) and **Supabase** (Database).

### Prerequisites
1.  **GitHub Account**: You need to push this code to a new repository.
2.  **Supabase Account**: Create a project at [supabase.com](https://supabase.com).
3.  **Netlify Account**: Create an account at [netlify.com](https://netlify.com).

### Step 1: Push to GitHub
Run these commands in your terminal:
```bash
git add .
git commit -m "Ready for deploy"
# create a new repo on github.com then:
git remote add origin <your-new-repo-url>
git push -u origin main
```

### Step 2: Supabase Setup
1.  Create a new project on Supabase.
2.  Go to **Project Settings** -> **Database**.
3.  Copy the **Connection String** (Transaction Mode) -> This is your `DATABASE_URL`.
4.  Copy the **Connection String** (Session Mode) -> This is your `DIRECT_URL`.

### Step 3: Netlify Setup
1.  Log in to Netlify and click **"Add new site"** -> **"Import from an existing project"**.
2.  Select **GitHub** and choose your `canteen-rush` repository.
3.  **Build Settings**:
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `.next`
4.  **Environment Variables** (Click "Add environment variables"):
    -   Key: `DATABASE_URL`, Value: (Paste from Supabase Transaction Mode)
    -   Key: `DIRECT_URL`, Value: (Paste from Supabase Session Mode)
5.  Click **"Deploy Site"**.

### Step 4: Finalize Database
Once the site is deploying, run this locally to set up the remote database schema:
1.  Create a `.env` file in this folder with the same variables:
    ```
    DATABASE_URL="your-supabase-transaction-url"
    DIRECT_URL="your-supabase-session-url"
    ```
2.  Run migration and seed:
    ```bash
    npx prisma migrate deploy
    npx tsx prisma/seed.ts
    ```
