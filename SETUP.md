# Apothika Setup & Deployment Guide

## Overview

Apothika is a Vite/React application using Supabase for authentication and backend services.

This guide explains how to install, configure, run, build, and deploy the application.

## Requirements

- Node.js 24.x recommended
- Node.js 20+ supported
- npm
- Git
- Supabase account
- Vercel account

## 1. Install Dependencies

After cloning the repository:

```bash
npm install
```

## 2. Configure Environment Variables

Create a local `.env` file:

```bash
cp .env.example .env
```

Add the buyer's own Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

Do not commit `.env` to Git.

## 3. Run Locally

Start the development server:

```bash
npm run dev
```

The application normally becomes available at:

```text
http://localhost:5173
```

## 4. Build for Production

Run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 5. Deploy to Vercel

The project is configured as a Vite application.

Deploy using:

```bash
npx vercel
```

For a production deployment:

```bash
npx vercel --prod
```

Alternatively, connect the buyer's GitHub repository to Vercel.

### Recommended Vercel Settings

- Framework: Vite
- Build command: `npm run build`
- Node.js: 24.x

## 6. Vercel Environment Variables

Configure these variables in the buyer's Vercel project:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Use the buyer's own Supabase project credentials.

After changing environment variables, create a new deployment.

## 7. Supabase

The application uses Supabase for authentication and backend services.

The buyer should create or use their own Supabase project and configure the required database and authentication settings.

The repository includes `supabase/schema.sql`, which contains the exported public database schema, database functions, and Row Level Security policies used by the application. Apply this schema to the buyer’s Supabase project before using the application.

The buyer should also configure their production application URL in Supabase authentication settings.

### Supabase Storage

The application uses a Storage bucket named `product-images`. Create this bucket in the buyer’s Supabase project and configure it as a **public bucket**, because the application uses Supabase public URLs for product images.

Existing storage files are not included in the seller package.

### Row Level Security

The supplied schema includes the application’s existing Row Level Security policies. The buyer should review these policies before production use. Some existing policies are permissive and may need to be tightened depending on the buyer’s users, workspaces, and required data-isolation model.

## 8. Security

Never commit:

- `.env`
- `.env.production`
- Supabase service-role keys
- API secrets
- Vercel tokens
- Database passwords
- Private credentials

Only public frontend configuration should be exposed through Vite environment variables.

## 9. Ownership Transfer

The buyer should operate the application under their own accounts:

- GitHub
- Vercel
- Supabase
- Domain
- Other third-party services

Production credentials should not be shared through the repository.

## 10. Troubleshooting

### Invalid Supabase URL

Make sure the URL looks like:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
```

It must begin with `https://`.

### Authentication Problems

Check:

1. The Supabase URL is correct.
2. The publishable/anon key is correct.
3. Supabase authentication is enabled.
4. The production application URL is configured in Supabase.
5. Vercel has the required environment variables.
6. A new deployment was created after changing Vercel environment variables.

### Build Problems

Run:

```bash
npm install
npm run build
```

Then resolve any reported errors.

## Production Demo

https://apothika.vercel.app