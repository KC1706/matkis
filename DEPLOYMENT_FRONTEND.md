# Frontend Deployment Guide

This guide explains how to deploy the React Native Expo web build to Netlify or Vercel.

## Prerequisites

1. Backend deployed and accessible on Railway (see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md))
2. Railway backend URL (e.g., `https://your-backend.up.railway.app`)
3. Netlify account (https://netlify.com) or Vercel account (https://vercel.com)
4. Git repository pushed to GitHub/GitLab

## Option 1: Deploy to Netlify

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for frontend deployment"
git push origin main
```

### Step 2: Connect Repository to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub/GitLab and select your repository
4. Configure build settings:
   - **Base directory**: (leave empty - root)
   - **Build command**: `cd frontend && npm install && npm run build:web`
   - **Publish directory**: `frontend/.expo/web`

### Step 3: Configure Environment Variables

1. In Netlify dashboard, go to your site → "Site settings" → "Environment variables"
2. Add the following variable:
   - **Key**: `EXPO_PUBLIC_API_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-backend.up.railway.app`)

### Step 4: Deploy

1. Click "Deploy site" or push to your main branch (if auto-deploy is enabled)
2. Wait for build to complete (usually 2-5 minutes)
3. Your site will be available at `https://your-site-name.netlify.app`

### Step 5: Verify Deployment

1. Open your Netlify URL in a browser
2. Test the leaderboard loads correctly
3. Test search functionality
4. Verify it connects to your Railway backend

## Option 2: Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Connect Repository to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub/GitLab repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build:web`
   - **Output Directory**: `.expo/web`

### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to your project → "Settings" → "Environment Variables"
2. Add:
   - **Key**: `EXPO_PUBLIC_API_URL`
   - **Value**: Your Railway backend URL
   - **Environment**: Production, Preview, Development (select all)

### Step 4: Deploy

1. Click "Deploy" or push to your main branch
2. Wait for build to complete
3. Your site will be available at `https://your-project.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Build Configuration Files

### netlify.toml

The `netlify.toml` file is already configured for frontend-only deployment:

```toml
[build]
  command = "cd frontend && npm install && npm run build:web"
  publish = "frontend/.expo/web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### vercel.json

If deploying to Vercel, the `vercel.json` file provides configuration:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build:web",
  "outputDirectory": "frontend/.expo/web",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- **Solution**: Ensure Node.js version is 18+ in build settings
- Check build logs for specific errors
- Verify `package.json` has correct build script

**Issue**: Cannot find module errors
- **Solution**: Ensure `npm install` runs before build
- Check that all dependencies are in `package.json`

### Frontend Doesn't Connect to Backend

**Issue**: API calls fail with CORS errors
- **Solution**: Verify backend CORS is configured to allow your frontend domain
- Check that `EXPO_PUBLIC_API_URL` is set correctly

**Issue**: Network errors
- **Solution**: Verify Railway backend is running and accessible
- Test backend URL directly: `curl https://your-backend.up.railway.app/health`

### Routing Issues

**Issue**: 404 errors on page refresh
- **Solution**: Ensure redirects/rewrites are configured for SPA routing
- Netlify: Check `netlify.toml` redirects
- Vercel: Check `vercel.json` rewrites

### Environment Variables Not Working

**Issue**: Frontend still uses localhost URL
- **Solution**: 
  - Verify `EXPO_PUBLIC_API_URL` is set in deployment platform
  - Rebuild after adding environment variables
  - Check that variable name starts with `EXPO_PUBLIC_` (required for Expo)

## Testing After Deployment

1. **Health Check**:
   ```bash
   curl https://your-frontend.netlify.app
   ```

2. **Test Leaderboard**:
   - Open deployed URL
   - Verify leaderboard loads
   - Check pagination works

3. **Test Search**:
   - Try searching for "rahul"
   - Verify results appear
   - Check global ranks are displayed

4. **Test Responsiveness**:
   - Test on mobile device
   - Test on desktop
   - Verify UI adapts correctly

## Continuous Deployment

Both Netlify and Vercel support automatic deployments:

- **Netlify**: Auto-deploys on push to main branch (if enabled)
- **Vercel**: Auto-deploys on push to main branch (default)

To enable:
- Netlify: Site settings → Build & deploy → Continuous Deployment
- Vercel: Automatic (enabled by default)

## Performance Optimization

1. **Enable CDN**: Both platforms provide CDN automatically
2. **Enable Compression**: Automatic in both platforms
3. **Cache Headers**: Configure in `netlify.toml` or `vercel.json` if needed

## Next Steps

After successful deployment:

1. Update `README.md` with deployment links
2. Test all functionality end-to-end
3. Document any custom configurations
4. Share deployment URL for assignment submission

## Support

- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/workflow/web/
