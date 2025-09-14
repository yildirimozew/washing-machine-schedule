# Fix Firestore Permission Denied Error

## The Problem
You're seeing: `Missing or insufficient permissions` with error code `permission-denied`

This means your Firestore security rules are blocking access to the database.

## Quick Fix

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Firestore Database" in the left sidebar
4. Click the "Rules" tab

### Step 2: Update Security Rules
Replace your current rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write reservations
    match /reservations/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules
1. Click the "Publish" button
2. Wait for the rules to deploy (usually takes a few seconds)

## Alternative Rules (for testing only)

If you want to test without authentication (NOT recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules allow anyone to read/write your database
    // Only use for testing!
    match /reservations/{document} {
      allow read, write: if true;
    }
  }
}
```

## How to Verify It's Fixed

1. Save the new rules in Firebase Console
2. Refresh your washing machine app
3. **Sign in with Google** using the Firebase authentication
4. Check the connection status - should show "Online (Synced)" instead of "Offline"
5. Try making a reservation
6. Check the browser console - the permission errors should be gone
7. Open the debug panel to verify Firebase Auth shows as authenticated

## What These Rules Do

- `request.auth != null` - Only allows access if the user is authenticated with Google
- `match /reservations/{document}` - Applies rules only to the reservations collection
- `allow read, write` - Permits both reading existing data and writing new data

## Production Security (Optional)

For better security in production, you can make rules more specific:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{document} {
      // Allow read access to all authenticated users
      allow read: if request.auth != null;
      
      // Allow write access only if the user ID matches
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

This ensures users can only modify their own reservations.

## Still Having Issues?

If you're still getting permission errors after updating the rules:

1. Wait 2-3 minutes for rules to fully propagate
2. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
3. Check that you're signed in with Google in the app
4. Verify the rules were saved correctly in Firebase Console 