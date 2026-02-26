const WebSocket = require('ws');

class FocusWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const userId = this.extractUserId(req);
      
      if (userId) {
        this.clients.set(userId, ws);
        console.log(`User ${userId} connected via WebSocket`);
        
        ws.on('message', (message) => {
          this.handleMessage(userId, JSON.parse(message));
        });
        
        ws.on('close', () => {
          this.clients.delete(userId);
          console.log(`User ${userId} disconnected`);
        });
      }
    });
  }

  handleMessage(userId, data) {
    switch (data.type) {
      case 'FOCUS_UPDATE':
        this.broadcastFocusUpdate(userId, data.payload);
        break;
      case 'DISTRACTION_ALERT':
        this.sendDistractionAlert(userId, data.payload);
        break;
    }
  }

  broadcastFocusUpdate(userId, focusData) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'FOCUS_SYNC',
        data: focusData,
        timestamp: Date.now()
      }));
    }
  }

  sendDistractionAlert(userId, alertData) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'DISTRACTION_SYNC',
        data: alertData,
        timestamp: Date.now()
      }));
    }
  }

  extractUserId(req) {
    // Extract from query params or headers
    return req.url.split('userId=')[1]?.split('&')[0];
  }
}

module.exports = FocusWebSocketServer;