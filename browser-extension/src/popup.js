// Popup script for FOCUSLOOM extension
class PopupController {
  constructor() {
    this.sessionTimer = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.updateUI();
    this.startUIUpdateTimer();
  }

  setupEventListeners() {
    document.getElementById('startSession').addEventListener('click', () => {
      this.startSession();
    });

    document.getElementById('endSession').addEventListener('click', () => {
      this.endSession();
    });

    document.getElementById('logDistraction').addEventListener('click', () => {
      this.logDistraction();
    });

    document.getElementById('openApp').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000' });
    });
  }

  async startSession() {
    try {
      await chrome.runtime.sendMessage({
        action: 'startSession',
        data: {
          category: 'study',
          goal: 'Browser Focus Session'
        }
      });
      
      await this.updateUI();
      this.showNotification('Focus session started! 🎯');
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }

  async endSession() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'endSession'
      });
      
      if (response.success) {
        const session = response.data;
        await this.syncWithMainApp(session);
        this.showNotification(`Session completed! Focus Score: ${Math.round(session.focusScore)}`);
      }
      
      await this.updateUI();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  async logDistraction() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send distraction to background script
      await chrome.runtime.sendMessage({
        action: 'logDistraction',
        data: {
          url: tab.url,
          title: tab.title,
          timestamp: Date.now()
        }
      });
      
      this.showNotification('Distraction logged ⚠️');
      await this.updateUI();
    } catch (error) {
      console.error('Error logging distraction:', error);
    }
  }

  async syncWithMainApp(sessionData) {
    try {
      // Store in localStorage format that main app expects
      const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      
      const formattedSession = {
        id: sessionData.id,
        startTime: new Date(sessionData.startTime).toISOString(),
        endTime: new Date(sessionData.endTime).toISOString(),
        duration: sessionData.duration,
        focusScore: Math.round(sessionData.focusScore),
        distractions: sessionData.distractions || [],
        category: sessionData.category || 'study',
        completed: true,
        source: 'browser-extension'
      };
      
      sessions.push(formattedSession);
      localStorage.setItem('focusSessions', JSON.stringify(sessions));
      
    } catch (error) {
      console.error('Error syncing with main app:', error);
    }
  }

  async updateUI() {
    try {
      const status = await chrome.runtime.sendMessage({ action: 'getStatus' });
      const stats = await chrome.runtime.sendMessage({ action: 'getStats' });
      
      this.updateSessionStatus(status);
      this.updateStats(stats);
      this.updateActivityBreakdown(stats);
      
    } catch (error) {
      console.error('Error updating UI:', error);
    }
  }

  updateSessionStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const sessionTime = document.getElementById('sessionTime');
    const startControls = document.getElementById('startControls');
    const activeControls = document.getElementById('activeControls');

    if (status.isActive && status.session) {
      statusIndicator.className = 'status-indicator status-active';
      statusText.textContent = 'Focus Session Active';
      
      const elapsed = Date.now() - status.session.startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      sessionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      startControls.classList.add('hidden');
      activeControls.classList.remove('hidden');
    } else {
      statusIndicator.className = 'status-indicator status-inactive';
      statusText.textContent = 'No Active Session';
      sessionTime.textContent = '00:00';
      
      startControls.classList.remove('hidden');
      activeControls.classList.add('hidden');
    }
  }

  updateStats(stats) {
    const focusScore = document.getElementById('focusScore');
    const distractionCount = document.getElementById('distractionCount');
    const productiveTime = document.getElementById('productiveTime');

    focusScore.textContent = stats.focusScore ? `${Math.round(stats.focusScore)}%` : '--';
    distractionCount.textContent = stats.distractions || 0;
    
    const productiveMinutes = Math.floor((stats.timeBreakdown?.productive || 0) / 60000);
    productiveTime.textContent = `${productiveMinutes}m`;
  }

  updateActivityBreakdown(stats) {
    const breakdown = document.getElementById('activityBreakdown');
    
    if (!stats.timeBreakdown) {
      breakdown.classList.add('hidden');
      return;
    }

    const total = Object.values(stats.timeBreakdown).reduce((sum, time) => sum + time, 0);
    
    if (total === 0) {
      breakdown.classList.add('hidden');
      return;
    }

    breakdown.classList.remove('hidden');

    const productive = (stats.timeBreakdown.productive / total) * 100;
    const neutral = (stats.timeBreakdown.neutral / total) * 100;
    const distracting = (stats.timeBreakdown.distracting / total) * 100;

    document.getElementById('productivePercent').textContent = `${Math.round(productive)}%`;
    document.getElementById('neutralPercent').textContent = `${Math.round(neutral)}%`;
    document.getElementById('distractingPercent').textContent = `${Math.round(distracting)}%`;

    document.getElementById('productiveBar').style.width = `${productive}%`;
    document.getElementById('neutralBar').style.width = `${neutral}%`;
    document.getElementById('distractingBar').style.width = `${distracting}%`;
  }

  startUIUpdateTimer() {
    this.sessionTimer = setInterval(() => {
      this.updateUI();
    }, 1000);
  }

  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});