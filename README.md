# 🧺 Washing Machine Schedule

A React app for flatmates to schedule washing machine and dryer usage times.

## Features

- **Machine Selection**: Choose between 2 washing machines or 1 dryer
- **Time Slot Grid**: Visual weekly schedule with 30-minute time slots (6 AM - 11 PM)
- **Smart Duration**: Washing machines (1.5 hours), Dryer (2 hours)
- **Simple Reservations**: Click slots, enter your name, and save
- **Material-UI Design**: Clean, modern interface with Google Material theme
- **Mobile Responsive**: Works on all devices

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Build for production**:
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

1. **Select a Machine**: Choose from Washing Machine 1, Washing Machine 2, or Dryer
2. **Pick Time Slots**: Click on available time slots in the weekly grid
3. **Enter Your Name**: When ready, click "Make Reservation" and enter your name
4. **Save**: Your reservation will appear on the schedule

## Technical Details

- **Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Icons**: Material Icons
- **State Management**: React useState (local storage coming soon)
- **Responsive**: Mobile-first design
- **Time Slots**: 30-minute intervals from 6:00 AM to 11:00 PM

## Future Enhancements

- Local storage persistence
- Automatic reservation cleanup
- Email notifications
- Admin panel for managing reservations
- Conflict resolution for overlapping bookings 