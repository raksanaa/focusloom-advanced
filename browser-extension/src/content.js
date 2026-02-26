// Enhanced content script with audio alerts for distracting sites
class ContentTracker {
  constructor() {
    this.isTracking = false;
    this.lastActivity = Date.now();
    this.audioContext = null;
    this.init();
  }

  init() {
    this.setupActivityTracking();
    this.checkSessionStatus();
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Audio context not available');
    }
  }

  setupActivityTracking() {
    // Track user interactions
    const events = ['click', 'scroll', 'keypress', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.recordActivity();
      }, { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordInactivity();
      } else {
        this.recordActivity();
        this.checkIfDistractingSite();
      }
    });

    // Track focus/blur events
    window.addEventListener('focus', () => {
      this.recordActivity();
      this.checkIfDistractingSite();
    });
    window.addEventListener('blur', () => this.recordInactivity());
  }

  checkIfDistractingSite() {
    if (!this.isTracking) return;

    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    
    // Enhanced smart detection for Google
    if (url.includes('google.com') && !url.includes('youtube')) {
      const isEducational = this.analyzeGoogleContent(url, title);
      if (!isEducational) {
        this.playDistractionBeep();
        this.showDistractionOverlay();
      }
      return;
    }
    
    // Smart YouTube detection
    if (url.includes('youtube.com')) {
      const isEducational = this.analyzeYouTubeContent(url, title);
      if (!isEducational) {
        this.playDistractionBeep();
        this.showDistractionOverlay();
      }
      return;
    }
    
    const distractingSites = [
      'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com',
      'reddit.com', 'netflix.com', 'twitch.tv',
      'discord.com', 'whatsapp.com', 'telegram.org', 'snapchat.com'
    ];

    const isDistracting = distractingSites.some(site => 
      url.includes(site)
    );

    if (isDistracting) {
      this.playDistractionBeep();
      this.showDistractionOverlay();
    }
  }

  analyzeGoogleContent(url, title) {
    // Always allow educational Google services
    if (url.includes('scholar.google') || 
        url.includes('docs.google') ||
        url.includes('drive.google') ||
        url.includes('classroom.google')) {
      return true;
    }

    // Analyze search query from URL
    try {
      const urlObj = new URL(url);
      const searchQuery = (urlObj.searchParams.get('q') || '').toLowerCase();
      
      const educationalKeywords = [
        'how to', 'tutorial', 'learn', 'study', 'education', 'course',
        'math', 'science', 'physics', 'chemistry', 'biology', 'history',
        'programming', 'coding', 'algorithm', 'research', 'academic',
        'university', 'homework', 'assignment', 'exam', 'definition',
        'explain', 'what is', 'why does', 'how does', 'formula'
      ];

      const distractingKeywords = [
        'funny', 'meme', 'celebrity', 'gossip', 'entertainment',
        'movie', 'music', 'game', 'viral', 'trending', 'news',
        'sports score', 'weather', 'restaurant', 'shopping'
      ];

      // Check page title for educational content
      const titleEducational = educationalKeywords.some(keyword => 
        title.includes(keyword)
      );
      
      const titleDistracting = distractingKeywords.some(keyword => 
        title.includes(keyword)
      );

      // Check search query
      const queryEducational = educationalKeywords.some(keyword => 
        searchQuery.includes(keyword)
      );
      
      const queryDistracting = distractingKeywords.some(keyword => 
        searchQuery.includes(keyword)
      );

      // Decision logic
      if ((titleEducational || queryEducational) && !titleDistracting && !queryDistracting) {
        return true; // Educational content
      }
      
      if (titleDistracting || queryDistracting) {
        return false; // Distracting content
      }
      
      // Neutral - allow without beep but don't count as highly productive
      return true;
      
    } catch (error) {
  analyzeYouTubeContent(url, title) {
    // Always block YouTube homepage, trending, subscriptions
    if (url.includes('youtube.com/feed') || 
        url.includes('youtube.com/trending') ||
        url.includes('youtube.com/subscriptions') ||
        url === 'https://www.youtube.com/' ||
        url === 'https://youtube.com/') {
      return false; // Distracting
    }

    // Allow if it's a specific video (youtube.com/watch)
    if (!url.includes('youtube.com/watch')) {
      return true; // Neutral for other YouTube pages
    }

    // Get video title from multiple sources
    const videoTitle = this.getYouTubeVideoTitle() || title || document.title || '';
    const videoTitleLower = videoTitle.toLowerCase();
    
    // Also check URL for search parameters
    const urlParams = new URLSearchParams(new URL(url).search);
    const searchContext = (urlParams.get('search_query') || '').toLowerCase();
    
    console.log('YouTube Analysis:', {
      url: url,
      title: videoTitle,
      searchContext: searchContext
    });

    // Educational keywords (more comprehensive)
    const educationalKeywords = [
      'tutorial', 'how to', 'learn', 'education', 'lecture', 'course',
      'math', 'calculus', 'algebra', 'physics', 'chemistry', 'biology',
      'science', 'programming', 'coding', 'algorithm', 'explained',
      'lesson', 'study', 'academic', 'university', 'professor',
      'definition', 'theory', 'formula', 'solve', 'problem',
      'history', 'geography', 'literature', 'language', 'grammar',
      'documentary', 'research', 'analysis', 'guide', 'instruction',
      'class', 'school', 'homework', 'exam', 'test', 'review',
      'concept', 'basics', 'fundamentals', 'introduction', 'advanced'
    ];

    // Entertainment keywords (specific ones)
    const entertainmentKeywords = [
      'funny', 'comedy', 'meme', 'viral', 'prank', 'reaction',
      'gaming', 'gameplay', 'let\'s play', 'vlog', 'challenge',
      'music video', 'song', 'dance', 'party', 'celebrity',
      'gossip', 'drama', 'roast', 'fail', 'compilation',
      'unboxing', 'haul', 'lifestyle', 'fashion', 'makeup',
      'tiktok', 'shorts', 'memes'
    ];

    // Check video title and search context
    const hasEducationalContent = educationalKeywords.some(keyword => 
      videoTitleLower.includes(keyword) || searchContext.includes(keyword)
    );

    const hasEntertainmentContent = entertainmentKeywords.some(keyword => 
      videoTitleLower.includes(keyword)
    );

    // If clearly educational, allow
    if (hasEducationalContent) {
      console.log('Educational content detected - allowing');
      return true;
    }

    // If clearly entertainment, block
    if (hasEntertainmentContent) {
      console.log('Entertainment content detected - blocking');
      return false;
    }

    // Check if coming from educational search
    if (document.referrer && document.referrer.includes('google.com/search')) {
      const referrerUrl = new URL(document.referrer);
      const searchQuery = (referrerUrl.searchParams.get('q') || '').toLowerCase();
      
      const isEducationalSearch = educationalKeywords.some(keyword => 
        searchQuery.includes(keyword)
      );
      
      if (isEducationalSearch) {
        console.log('Coming from educational Google search - allowing');
        return true;
      }
    }

    // For ambiguous content, be more lenient - allow it
    console.log('Ambiguous content - allowing (benefit of doubt)');
    return true;
  }

  getYouTubeVideoTitle() {
    // Wait a bit for page to load
    setTimeout(() => {
      this.checkIfDistractingSite();
    }, 2000);
    
    // Try multiple selectors for video title
    const titleSelectors = [
      'h1.title.style-scope.ytd-video-primary-info-renderer',
      'h1.ytd-video-primary-info-renderer', 
      '.title.ytd-video-primary-info-renderer',
      'h1[class*="title"]',
      '.ytd-video-primary-info-renderer h1',
      '#container h1',
      'h1.style-scope.ytd-video-primary-info-renderer'
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        const title = element.textContent.trim();
        console.log('Found YouTube title:', title);
        return title;
      }
    }

    // Fallback to document title
    if (document.title && document.title !== 'YouTube') {
      const title = document.title.replace(' - YouTube', '').trim();
      console.log('Using document title:', title);
      return title;
    }

    console.log('No YouTube title found');
    return null;
  }

  getYouTubeChannelName() {
    // Try multiple selectors for channel name
    const channelSelectors = [
      '.ytd-channel-name a',
      '.ytd-video-owner-renderer a',
      '#channel-name a',
      '[class*="channel-name"] a'
    ];

    for (const selector of channelSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        return element.textContent.trim();
      }
    }

    return null;
  }

  playDistractionBeep() {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Create attention-grabbing beep sequence
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.4);
      
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.6);
    } catch (error) {
      console.log('Could not play beep sound');
    }
  }

  showDistractionOverlay() {
    // Remove existing overlay
    const existing = document.getElementById('focusloom-distraction-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'focusloom-distraction-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(239, 68, 68, 0.9);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: Arial, sans-serif;
        animation: focusloom-fade-in 0.3s ease-out;
      ">
        <div style="
          text-align: center;
          padding: 40px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 20px;
          max-width: 400px;
        ">
          <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
          <h2 style="margin: 0 0 15px 0; font-size: 24px;">Stay Focused!</h2>
          <p style="margin: 0 0 20px 0; font-size: 16px;">
            You're on a distracting website during your focus session.
          </p>
          <p style="margin: 0 0 25px 0; font-size: 14px; opacity: 0.8;">
            Get back to your studies! 📚
          </p>
          <button id="focusloom-continue-anyway" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin-right: 10px;
            font-size: 14px;
          ">Continue Anyway</button>
          <button id="focusloom-go-back" style="
            background: #22c55e;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
          ">Go Back to Studies</button>
        </div>
      </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes focusloom-fade-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(overlay);

    // Add event listeners
    document.getElementById('focusloom-continue-anyway').addEventListener('click', () => {
      overlay.remove();
      this.logDistraction('continued-anyway');
    });

    document.getElementById('focusloom-go-back').addEventListener('click', () => {
      overlay.remove();
      window.history.back();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 10000);
  }

  logDistraction(type) {
    chrome.runtime.sendMessage({
      action: 'logDistraction',
      data: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        type: type || 'auto-detected'
      }
    }).catch(() => {
      // Background script not available
    });
  }

  async checkSessionStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      this.isTracking = response.isActive;
      
      if (this.isTracking) {
        this.checkIfDistractingSite();
      }
    } catch (error) {
      console.log('Extension background not available');
    }
  }

  recordActivity() {
    if (!this.isTracking) return;
    
    this.lastActivity = Date.now();
    
    chrome.runtime.sendMessage({
      action: 'recordActivity',
      data: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        type: 'active'
      }
    }).catch(() => {
      // Background script not available
    });
  }

  recordInactivity() {
    if (!this.isTracking) return;
    
    chrome.runtime.sendMessage({
      action: 'recordActivity',
      data: {
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
        type: 'inactive',
        duration: Date.now() - this.lastActivity
      }
    }).catch(() => {
      // Background script not available
    });
  }

  showFocusIndicator() {
    if (document.getElementById('focusloom-indicator')) return;

    const indicator = document.createElement('div');
    indicator.id = 'focusloom-indicator';
    indicator.innerHTML = '🎯';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: transform 0.2s;
    `;

    indicator.addEventListener('mouseenter', () => {
      indicator.style.transform = 'scale(1.1)';
    });

    indicator.addEventListener('mouseleave', () => {
      indicator.style.transform = 'scale(1)';
    });

    document.body.appendChild(indicator);
  }

  hideFocusIndicator() {
    const indicator = document.getElementById('focusloom-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Initialize content tracker
const contentTracker = new ContentTracker();

// Listen for session status changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sessionStarted') {
    contentTracker.isTracking = true;
    contentTracker.showFocusIndicator();
    contentTracker.checkIfDistractingSite();
  } else if (message.action === 'sessionEnded') {
    contentTracker.isTracking = false;
    contentTracker.hideFocusIndicator();
  }
});