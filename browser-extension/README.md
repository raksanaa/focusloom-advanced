# FOCUSLOOM Browser Extension

A Chrome extension that automatically tracks your browsing behavior during focus sessions, categorizing websites as productive, neutral, or distracting.

## 🚀 Features

- **Automatic Website Categorization**: Classifies sites as productive (Google Scholar, Stack Overflow) vs distracting (social media, entertainment)
- **Real-time Focus Scoring**: Adjusts your focus score based on browsing behavior
- **Auto-distraction Detection**: Automatically logs when you spend too much time on distracting sites
- **Seamless Integration**: Syncs data with your main FOCUSLOOM app
- **Visual Focus Indicator**: Shows a focus indicator on web pages during active sessions

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

3. **Load Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder from your FOCUSLOOM project

4. **Pin Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Pin FOCUSLOOM extension for easy access

### Method 2: Package and Install

1. **Package Extension**
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `browser-extension` folder
   - This creates a `.crx` file

2. **Install Package**
   - Drag the `.crx` file to Chrome extensions page
   - Click "Add extension"

## 🎯 How to Use

### Starting a Focus Session

1. **Click Extension Icon** in Chrome toolbar
2. **Click "Start Focus Session"** 
3. **Browse normally** - the extension tracks automatically
4. **View real-time stats** in the popup

### During a Session

- **Focus Score**: Updates based on your browsing behavior
- **Time Breakdown**: Shows productive vs distracting time
- **Auto-detection**: Distractions logged automatically
- **Manual Logging**: Click "Log Distraction" for manual entries

### Ending a Session

1. **Click Extension Icon**
2. **Click "End Session"**
3. **Data syncs** automatically with main FOCUSLOOM app

## 🌐 Website Categories

### 📚 Productive Sites
- Google Search, Google Scholar
- Wikipedia, Stack Overflow
- GitHub, Documentation sites
- Educational platforms (Coursera, Khan Academy)
- YouTube educational videos

### ⚪ Neutral Sites
- Gmail, Calendar
- Work tools (Notion, Trello, Slack)
- FOCUSLOOM app (localhost:3000)

### 🔴 Distracting Sites
- Social media (Facebook, Instagram, Twitter)
- Entertainment (Netflix, YouTube feed)
- Gaming and chat platforms
- News and gossip sites

## 🔧 Configuration

### Adding Custom Site Categories

Edit `src/background.js` and modify the `focusCategories` object:

```javascript
productive: [
  'your-study-site.com',
  'research-platform.edu'
],
distracting: [
  'time-wasting-site.com',
  'social-platform.net'
]
```

### Adjusting Focus Scoring

Modify the `scoreMultiplier` in `background.js`:

```javascript
const scoreMultiplier = {
  productive: 1.0,    // +1 point per second
  neutral: 0.5,       // +0.5 points per second  
  distracting: -0.5   // -0.5 points per second
};
```

## 📊 Data Integration

The extension automatically syncs with your main FOCUSLOOM app:

- **Session data** saved to localStorage
- **Focus scores** calculated in real-time
- **Distractions** logged automatically
- **Time tracking** includes browsing behavior

## 🛠️ Development

### File Structure
```
browser-extension/
├── manifest.json          # Extension configuration
├── src/
│   ├── background.js      # Service worker (main logic)
│   ├── popup.html         # Extension popup UI
│   ├── popup.js          # Popup interactions
│   └── content.js        # Page content tracking
└── icons/                # Extension icons
```

### Key Components

- **Background Script**: Tracks tabs, categorizes sites, calculates scores
- **Popup Interface**: Shows session status and controls
- **Content Script**: Tracks user activity on web pages
- **Storage**: Uses Chrome storage API for session data

## 🔒 Privacy

- **Local Storage**: All data stored locally in browser
- **No External Servers**: Extension works offline
- **Minimal Permissions**: Only accesses active tab information
- **User Control**: Start/stop tracking manually

## 🐛 Troubleshooting

### Extension Not Working
1. Check if developer mode is enabled
2. Reload extension in `chrome://extensions/`
3. Check browser console for errors

### Data Not Syncing
1. Ensure FOCUSLOOM app is running on localhost:3000
2. Check if localStorage is accessible
3. Verify extension permissions

### Focus Score Issues
1. Check website categorization in background.js
2. Verify scoring multipliers are correct
3. Clear extension storage and restart

## 🚀 Future Enhancements

- **Smart Categorization**: AI-powered site classification
- **Custom Rules**: User-defined productive/distracting sites
- **Time Limits**: Automatic blocking of distracting sites
- **Detailed Analytics**: More granular browsing insights
- **Cross-browser Support**: Firefox and Safari versions

---

**Now you can study with Google, research papers, or any online material while FOCUSLOOM automatically tracks your focus and distractions! 🎯**