# Setup Guide

## Google OAuth Configuration

To enable Google authentication, you need to set up a Google OAuth client:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://yourusername.github.io`
7. Copy the Client ID

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

**Important**: 
- Never commit this file to version control
- The app will work in demo mode without a real client ID, but Google login won't function
- For GitHub Pages deployment, you'll need to use build-time environment variables

### 3. GitHub Pages Deployment with OAuth

When deploying to GitHub Pages, you need to:

1. Add your GitHub Pages domain to Google OAuth authorized origins
2. Set the environment variable in your deployment script or CI/CD pipeline
3. Update the `homepage` field in `package.json` to match your GitHub Pages URL

### 4. Demo Mode

If no `REACT_APP_GOOGLE_CLIENT_ID` is provided, the app runs in demo mode where:
- Google login button is shown but won't work
- You can test the interface and features
- Local storage still works for reservations
- Perfect for development and testing

## Development vs Production

- **Development**: Use `http://localhost:3000` as authorized origin
- **Production**: Use your actual domain as authorized origin
- **Testing**: Demo mode works without any OAuth setup 