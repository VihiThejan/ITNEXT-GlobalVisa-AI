# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: ITNEXT GlobalVisa AI
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: ITNEXT GlobalVisa AI
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     https://itnext-globalvisa-ai.pages.dev
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5173
     https://itnext-globalvisa-ai.pages.dev
     ```
7. Copy the **Client ID** (you'll need this)

## 2. Configure Backend

1. Open `backend/.env`
2. Add your Google Client ID:
   ```env
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Deploy to Vercel with environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `GOOGLE_CLIENT_ID` with your Client ID value
   - Redeploy

## 3. Configure Frontend

1. Open `core/.env`
2. Add your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Configure in Cloudflare Pages:
   - Go to Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
   - Add: `VITE_GOOGLE_CLIENT_ID` with your Client ID value
   - Redeploy

## 4. Test Google Sign-In

1. Start your local development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (in another terminal)
   cd core
   npm run dev
   ```

2. Navigate to http://localhost:5173
3. Click "Sign in with Google"
4. Complete the Google authentication flow
5. You should be logged in!

## 5. Deploy to Production

After setting environment variables in both Vercel and Cloudflare Pages:

```bash
git add .
git commit -m "Add Google OAuth authentication"
git push origin main
```

Both platforms will automatically redeploy with the new changes.

## Features Implemented

✅ Google Sign-In button on AuthPage
✅ Backend Google OAuth verification
✅ Automatic user creation for new Google users
✅ Automatic profile sync (name, email, avatar)
✅ JWT token generation
✅ Support for existing email users to sign in with Google

## Security Notes

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Client IDs are safe to expose (they're public)
- Always verify tokens on the backend
