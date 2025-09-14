# 🧺 Washing Machine Schedule

A React app for flatmates to schedule washing machine and dryer usage times.

## Features

- **Google Authentication**: Secure login with Google OAuth
- **User Profiles**: Set custom display names for reservations
- **Machine Selection**: Choose between 2 washing machines or 1 dryer
- **Continuous Timeline**: Visual weekly schedule with continuous time axis (6 AM - 11 PM)
- **Flexible Reservations**: Select any day, enter custom start/end times
- **Cross-Device Sync**: Real-time synchronization across all devices using Firebase Firestore
- **Offline Support**: Falls back to localStorage when offline, syncs when reconnected
- **Conflict Detection**: Prevents overlapping reservations
- **Material-UI Design**: Clean, modern interface with Google Material theme
- **Mobile Responsive**: Works on all devices

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase** (optional - enables authentication and cross-device sync):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Get your configuration values

3. **Set environment variables** (optional):
   Create a `.env.local` file in the project root:
   ```bash
   # Firebase configuration (enables authentication and cross-device sync)
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

1. **Update package.json**: Change the `homepage` field to your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/washing-machine-schedule"
   ```

2. **Create a new repository** on GitHub named `washing-machine-schedule`

3. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/washing-machine-schedule.git
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages** in repository settings (if not auto-enabled)

Your app will be available at: `https://yourusername.github.io/washing-machine-schedule`

## How to Use

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Set Display Name**: Edit your profile to set a custom name for reservations
3. **Select a Machine**: Choose from Washing Machine 1, Washing Machine 2, or Dryer
4. **Pick a Day**: Click on any day header or timeline to start a reservation
5. **Set Times**: Enter your preferred start and end times
6. **Save**: Your reservation will appear as a block on the continuous timeline

## Timeline Interface

- **Continuous Time Axis**: 6:00 AM to 11:00 PM displayed as a continuous timeline
- **Reservation Blocks**: Existing reservations shown as colored blocks with user names
- **Flexible Times**: Enter any start/end time within operating hours
- **Conflict Prevention**: System prevents overlapping reservations
- **Visual Feedback**: Hover effects and clear visual indicators

## Technical Details

- **Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Authentication**: Google OAuth 2.0 with Google Identity Services
- **Icons**: Material Icons
- **State Management**: React Context + useState
- **Storage**: Firebase Firestore for cross-device sync + localStorage fallback
- **Timeline**: Continuous time axis with percentage-based positioning
- **Responsive**: Mobile-first design
- **Time Range**: 6:00 AM to 11:00 PM with flexible start/end times

## Future Enhancements

- Email/SMS notifications for upcoming reservations
- Admin panel for managing users and reservations
- Calendar integration (Google Calendar, Outlook)
- Mobile app version
- Real-time sync across multiple devices
- Usage analytics and reporting
- Integration with smart home systems 