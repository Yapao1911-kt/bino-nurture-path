# Vercel Configuration for Bino Nurture Path

This project uses TanStack Start with a Vercel SSR preset.

## Environment Variables Required on Vercel

Set these in your Vercel project settings → Environment Variables:

```
DATABASE_URL=mysql://user:password@host:3306/bino_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_URL=https://your-app.vercel.app
```

## Build Settings on Vercel

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Notes

- `prisma generate` runs automatically before `vite build` (via the build script)
- Also runs automatically after `npm install` (via `postinstall` script)
- Make sure `DATABASE_URL` is set in Vercel environment variables before deploying
