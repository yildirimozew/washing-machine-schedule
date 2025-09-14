# Setup Guide

## Firebase Configuration

This app uses Firebase for authentication and database. No Google Cloud Console setup required!

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing one
3. Follow the setup wizard (Analytics is optional)

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started" if prompted
3. Go to the "Sign-in method" tab
4. Click "Google" and toggle "Enable"
5. Set your project's public-facing name
6. Add your domain to authorized domains:
   - For development: `localhost`
   - For production: `yourusername.github.io`
7. Click "Save"

### 3. Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Start in test mode (you can tighten security later)
4. Choose a location close to your users

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon) → General tab
2. Scroll down to "Your apps" section
3. Click the web app icon (`</>`) to add a web app
4. Register your app with a name
5. Copy the configuration values

### 5. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Firebase configuration (required for authentication and sync)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Important**: 
- Never commit this file to version control
- The app will work in offline mode without Firebase, using localStorage only
- Cross-device sync won't work without Firebase configuration
- For GitHub Pages deployment, you'll need to use build-time environment variables

### 6. GitHub Pages Deployment

When deploying to GitHub Pages, you need to:

1. Add your GitHub Pages domain to Firebase authorized domains
2. Set the environment variables in your deployment script or CI/CD pipeline
3. Update the `homepage` field in `package.json` to match your GitHub Pages URL

### 4. Firebase Setup (for cross-device sync)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database:
   - Go to "Firestore Database" → "Create database"
   - Start in test mode (for development)
   - Choose a location close to your users
4. Go to Project Settings → General → Your apps
5. Click "Web app" icon and register your app
6. Copy the configuration values to your `.env.local` file

### 5. Firestore Security Rules

For production, set up proper security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Operation Modes

The app has multiple operation modes:
- **Full Mode**: Firebase Authentication + Firestore (cross-device sync)
- **Demo Mode**: No authentication required, localStorage only
- **Offline Mode**: Falls back to localStorage when Firebase is unavailable

## Development vs Production

- **Development**: Add `localhost` to Firebase authorized domains
- **Production**: Add your actual domain to Firebase authorized domains
- **Testing**: Demo mode works without any Firebase setup 