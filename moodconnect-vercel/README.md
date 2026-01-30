# MoodConnect - Mood Check-in & Connection App

A simple, beautiful app to track your daily moods and stay connected with the people who matter.

## Features

✅ Daily mood tracking with 5 mood levels
✅ Contact management with relationship types
✅ Mood-based contact suggestions
✅ Reconnection reminders for people you haven't contacted
✅ Mood history and insights
✅ All data saved in browser (no login required)

## Deploy to Vercel - Step-by-Step Instructions

### Option 1: Deploy via Vercel Website (Easiest - No GitHub needed)

1. **Create a Vercel Account**
   - Go to https://vercel.com
   - Click "Sign Up"
   - Use your email or GitHub account

2. **Prepare Your Files**
   - Download this entire folder to your computer
   - Make sure all files are in one folder named "moodconnect-vercel"

3. **Deploy**
   - Go to https://vercel.com/new
   - Drag and drop the entire "moodconnect-vercel" folder onto the page
   - Vercel will automatically detect it as a Vite project
   - Click "Deploy"
   - Wait 2-3 minutes

4. **Done!**
   - You'll get a URL like: `moodconnect-abc123.vercel.app`
   - Share this URL with anyone!

### Option 2: Deploy via GitHub (Recommended for updates)

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Click "Sign Up"

2. **Create a New Repository**
   - Click the "+" icon → "New repository"
   - Name it "moodconnect"
   - Click "Create repository"

3. **Upload Your Files**
   - Click "uploading an existing file"
   - Drag all files from the moodconnect-vercel folder
   - Click "Commit changes"

4. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Click "Import Git Repository"
   - Select your "moodconnect" repository
   - Click "Deploy"

5. **Done!**
   - Your app is live!
   - Any updates you make to GitHub will automatically redeploy

## Customizing Your App

After deployment, you can customize:
- Colors and theme (edit `src/App.jsx`)
- Mood options and emojis (in the `moodOptions` array)
- Relationship types (in the `relationshipTypes` array)
- Reconnection day thresholds

## Local Development (Optional)

If you want to test locally before deploying:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How It Works

- All data is stored in your browser's localStorage
- No backend server needed
- No login or registration required
- Data stays private on your device
- Works offline after first load

## Support

If you need help deploying, check:
- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/

## License

Free to use and modify for personal projects!
