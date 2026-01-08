# Deployment Guide

This guide explains how to deploy the game to Azure Static Web Apps for free hosting.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Azure Account** - Sign up for free at [azure.com](https://azure.com) (free tier available)
3. **Azure Static Web Apps** - Free tier includes:
   - 100 GB bandwidth per month
   - Custom domains
   - SSL certificates
   - GitHub integration

## Option 1: Azure Static Web Apps (Recommended - Free)

### Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App"
4. Click "Create"
5. Fill in the form:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Your app name (e.g., `ocd-game`)
   - **Plan type**: Free
   - **Region**: Choose closest to you
   - **Source**: GitHub
   - **GitHub account**: Sign in and authorize
   - **Organization**: Your GitHub username
   - **Repository**: Your repository name
   - **Branch**: `main`
   - **Build Presets**: Custom
   - **App location**: `/` (root)
   - **Api location**: (leave empty)
   - **Output location**: (leave empty - no build step needed)

6. Click "Review + create" then "Create"

### Step 2: Configure GitHub Secret

Azure will automatically:
- Create a GitHub Actions workflow file (`.github/workflows/azure-static-web-apps.yml`)
- Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your repository

The workflow file is already included in this repository.

### Step 3: Deploy

1. Push your code to the `main` branch
2. GitHub Actions will automatically deploy to Azure
3. Check the Actions tab in GitHub to see deployment progress
4. Once deployed, Azure will provide a URL like: `https://your-app-name.azurestaticapps.net`

### Step 4: Access Your Game

- Production URL: `https://your-app-name.azurestaticapps.net`
- You can also add a custom domain in Azure Portal

## Option 2: GitHub Pages (Simpler, but not Azure)

If you prefer GitHub Pages (also free):

1. Go to your repository Settings → Pages
2. Select source branch: `main`
3. Select folder: `/` (root)
4. Save
5. Your game will be available at: `https://your-username.github.io/repository-name/`

## Testing Touch Events on Desktop

### Method 1: Chrome DevTools (Easiest)

1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. Enable "Touch" in the device toolbar
5. Now you can test touch events with your mouse

### Method 2: Desktop Touch Simulator

A `DesktopTouchSimulator.js` utility has been created that maps keyboard/mouse to touch events:

**To enable:**
```javascript
// Add to game.html or main.js
DesktopTouchSimulator.enable();
```

**Controls:**
- **Arrow Keys**: Swipe (Up/Down/Left/Right)
- **Spacebar**: Tap
- **Shift+Spacebar**: Tap-Hold
- **Mouse Click/Drag**: Tap/Swipe

**To use:**
1. Add `<script src="dev/js_MVC/utils/DesktopTouchSimulator.js"></script>` to `game.html`
2. Call `DesktopTouchSimulator.enable()` after page load
3. Test touch events using keyboard/mouse

### Method 3: Browser Touch Simulation

Some browsers support touch events on touch-enabled screens:
- Windows: Surface devices, touch-enabled laptops
- Mac: Trackpad gestures (limited support)
- Linux: Touch-enabled devices

## Troubleshooting

### Azure Deployment Issues

1. **Build fails**: Check that `app_location` is set to `/` in Azure Portal
2. **404 errors**: Ensure `game.html` is in the root directory
3. **Assets not loading**: Check that all paths are relative (not absolute)

### Touch Event Issues

1. **Events not firing**: Check browser console for errors
2. **Desktop simulator not working**: Ensure `DesktopTouchSimulator.js` is loaded before `TouchUtils.js`
3. **Chrome DevTools**: Make sure device emulation is enabled

## Cost

- **Azure Static Web Apps Free Tier**: $0/month
  - 100 GB bandwidth
  - Custom domains
  - SSL certificates
  - GitHub integration
  
- **GitHub Pages**: $0/month
  - Unlimited bandwidth
  - Custom domains
  - SSL certificates

Both options are completely free for this use case!
