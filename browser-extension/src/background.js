// Background service worker for FOCUSLOOM extension
class FocusTracker {
  constructor() {
    this.isSessionActive = false;
    this.currentSession = null;
    this.lastActiveTime = Date.now();
    this.focusCategories = this.initializeCategories();
    this.setupListeners();
  }

  initializeCategories() {
    return {
      productive: [
        'scholar.google.com', 'wikipedia.org', 'stackoverflow.com',
        'github.com', 'docs.google.com', 'drive.google.com', 'coursera.org',
        'edx.org', 'khanacademy.org', 'udemy.com',
        'medium.com', 'dev.to', 'arxiv.org', 'researchgate.net',
        '.edu', 'academic', 'research'
      ],
      neutral: [
        'localhost:3000', 'gmail.com', 'outlook.com', 'calendar.google.com',
        'notion.so', 'trello.com', 'slack.com', 'zoom.us'
      ],
      distracting: [
        'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com',
        'reddit.com', 'netflix.com', 'youtube.com/feed', 'twitch.tv',
        'discord.com', 'whatsapp.com', 'telegram.org', 'snapchat.com'
      ]
    };
  }

  setupListeners() {
    // Listen for tab changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabChange(activeInfo.tabId);
    });

    // Listen for URL changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url && tab.active) {
        this.handleTabChange(tabId);
      }
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sendResponse);
    });
  }

  async handleTabChange(tabId) {
    if (!this.isSessionActive) return;

    try {
      const tab = await chrome.tabs.get(tabId);
      const category = this.categorizeWebsite(tab.url);
      const timeSpent = Date.now() - this.lastActiveTime;

      // Play beep sound for distracting sites
      if (category === 'distracting') {
        this.playDistractionAlert();
        this.showDistractionWarning(tab.title);
      }

      // Log the activity
      await this.logActivity({
        url: tab.url,
        title: tab.title,
        category: category,
        timeSpent: timeSpent,
        timestamp: Date.now()
      });

      // Update focus score
      await this.updateFocusScore(category, timeSpent);
      
      this.lastActiveTime = Date.now();
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  }

  categorizeWebsite(url) {
    if (!url) return 'unknown';

    const fullUrl = url.toLowerCase();
    const domain = new URL(url).hostname.toLowerCase();
    
    // Check for educational content indicators
    const educationalKeywords = [
      'study', 'learn', 'education', 'tutorial', 'course', 'research',
      'academic', 'science', 'math', 'physics', 'chemistry', 'biology',
      'history', 'literature', 'programming', 'coding', 'algorithm',
      'pdf', 'paper', 'journal', 'thesis', 'lecture', 'university',
      'school', 'homework', 'assignment', 'exam', 'test', 'quiz'
    ];

    const distractingKeywords = [
      'entertainment', 'funny', 'meme', 'celebrity', 'gossip', 'news',
      'sports', 'game', 'gaming', 'movie', 'music', 'video', 'viral',
      'trending', 'social', 'chat', 'message', 'feed', 'timeline'
    ];

    // Smart Google detection
    if (domain.includes('google.com')) {
      // Check URL parameters for search queries
      const urlParams = new URLSearchParams(new URL(url).search);
      const searchQuery = (urlParams.get('q') || '').toLowerCase();
      
      // Educational Google services are always productive
      if (fullUrl.includes('scholar.google') || 
          fullUrl.includes('docs.google') ||
          fullUrl.includes('drive.google') ||
          fullUrl.includes('classroom.google')) {
        return 'productive';
      }
      
      // Analyze search query for educational intent
      if (searchQuery) {
        const hasEducationalTerms = educationalKeywords.some(keyword => 
          searchQuery.includes(keyword)
        );
        const hasDistractingTerms = distractingKeywords.some(keyword => 
          searchQuery.includes(keyword)
        );
        
        if (hasEducationalTerms && !hasDistractingTerms) {
          return 'productive';
        }
        if (hasDistractingTerms && !hasEducationalTerms) {
          return 'distracting';
        }
      }
      
      // Default Google to neutral (needs content analysis)
      return 'neutral';
    }
    
    // Check other productive sites
    for (const site of this.focusCategories.productive) {
      if (domain.includes(site) || fullUrl.includes(site)) {
        return 'productive';
      }
    }
    
    // Check distracting sites
    for (const site of this.focusCategories.distracting) {
      if (domain.includes(site) || fullUrl.includes(site)) {
        return 'distracting';
      }
    }
    
    // Check neutral sites
    for (const site of this.focusCategories.neutral) {
      if (domain.includes(site) || fullUrl.includes(site)) {
        return 'neutral';
      }
    }
    
    return 'neutral';
  }

  async logActivity(activity) {
    const activities = await this.getStoredData('activities') || [];
    activities.push(activity);
    
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000);
    }
    
    await chrome.storage.local.set({ activities });
  }

  async updateFocusScore(category, timeSpent) {
    const session = await this.getStoredData('currentSession');
    if (!session) return;

    const scoreMultiplier = {
      productive: 1.0,
      neutral: 0.5,
      distracting: -0.5
    };

    const scoreChange = (timeSpent / 1000) * (scoreMultiplier[category] || 0);
    session.focusScore = Math.max(0, Math.min(100, session.focusScore + scoreChange));
    session.lastActivity = Date.now();

    // Auto-detect distractions
    if (category === 'distracting' && timeSpent > 30000) { // 30 seconds
      session.distractions = session.distractions || [];
      session.distractions.push({
        type: 'auto-detected',
        url: activity.url,
        timestamp: Date.now(),
        duration: timeSpent
      });
    }

    await chrome.storage.local.set({ currentSession: session });
    
    // Sync with main app
    this.syncWithMainApp(session);
  }

  async syncWithMainApp(session) {
    try {
      // Send data to FOCUSLOOM main app
      fetch('http://localhost:3000/api/extension-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          focusScore: session.focusScore,
          distractions: session.distractions,
          activities: await this.getStoredData('activities')
        })
      });
    } catch (error) {
      console.log('Main app not available, storing locally');
    }
  }

  async handleMessage(message, sendResponse) {
    switch (message.action) {
      case 'startSession':
        await this.startSession(message.data);
        sendResponse({ success: true });
        break;
        
      case 'endSession':
        const sessionData = await this.endSession();
        sendResponse({ success: true, data: sessionData });
        break;
        
      case 'getStatus':
        const status = await this.getSessionStatus();
        sendResponse(status);
        break;
        
      case 'getStats':
        const stats = await this.getSessionStats();
        sendResponse(stats);
        break;
    }
  }

  async startSession(sessionData) {
    this.isSessionActive = true;
    this.lastActiveTime = Date.now();
    
    const session = {
      id: Date.now().toString(),
      startTime: Date.now(),
      focusScore: 85,
      distractions: [],
      category: sessionData.category || 'study',
      goal: sessionData.goal || 'Focus Session'
    };

    await chrome.storage.local.set({ 
      currentSession: session,
      activities: []
    });
  }

  async endSession() {
    this.isSessionActive = false;
    const session = await this.getStoredData('currentSession');
    
    if (session) {
      session.endTime = Date.now();
      session.duration = Math.floor((session.endTime - session.startTime) / 60000);
      
      // Store completed session
      const completedSessions = await this.getStoredData('completedSessions') || [];
      completedSessions.push(session);
      
      await chrome.storage.local.set({ 
        completedSessions,
        currentSession: null 
      });
      
      return session;
    }
  }

  async getSessionStatus() {
    const session = await this.getStoredData('currentSession');
    return {
      isActive: this.isSessionActive,
      session: session
    };
  }

  async getSessionStats() {
    const activities = await this.getStoredData('activities') || [];
    const session = await this.getStoredData('currentSession');
    
    const stats = {
      productive: 0,
      neutral: 0,
      distracting: 0
    };

    activities.forEach(activity => {
      stats[activity.category] += activity.timeSpent;
    });

    return {
      timeBreakdown: stats,
      focusScore: session?.focusScore || 0,
      distractions: session?.distractions?.length || 0
    };
  }

  async getStoredData(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  }

  playDistractionAlert() {
    // Create audio context for beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure beep sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz frequency
    oscillator.type = 'sine';
    
    // Volume and duration
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Play beep
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  showDistractionWarning(siteTitle) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: '🎯 FOCUSLOOM - Stay Focused!',
      message: `You visited a distracting site: ${siteTitle}. Get back to your studies! 📚`
    });
  }
}

// Initialize the focus tracker
const focusTracker = new FocusTracker();