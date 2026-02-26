# FOCUSLOOM API Routes Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: Set in `.env` as `REACT_APP_API_URL`

## Authentication Routes

### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "preferences": {...}
    }
  }
  ```

### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register

---

## Session Routes (Requires Authentication)

### Start Session
- **POST** `/api/sessions/start`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "intendedDuration": 25,
    "category": "work",
    "tags": ["coding", "project"]
  }
  ```

### End Session
- **POST** `/api/sessions/:id/end`
- **Headers:** `Authorization: Bearer {token}`

### Log Distraction
- **POST** `/api/sessions/:id/distractions`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "category": "notification",
    "source": "Phone",
    "severity": 3,
    "notes": "Text message"
  }
  ```

### Resolve Distraction
- **PATCH** `/api/sessions/distractions/:id/resolve`
- **Headers:** `Authorization: Bearer {token}`

### Get User Sessions
- **GET** `/api/sessions?limit=50&page=1&status=completed`
- **Headers:** `Authorization: Bearer {token}`

---

## Analytics Routes (Requires Authentication)

### Get Daily Summary
- **GET** `/api/analytics/daily-summary?date=2024-01-15`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "date": "2024-01-15",
    "totalSessions": 5,
    "totalFocusTime": 120,
    "totalDistractionTime": 15,
    "distractionCount": 8,
    "avgSessionDuration": 24,
    "focusScore": 85
  }
  ```

### Get Weekly Trends
- **GET** `/api/analytics/weekly-trends`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "dailyData": {
      "2024-01-15": {
        "date": "2024-01-15",
        "focusTime": 120,
        "distractionCount": 8,
        "sessionCount": 5,
        "focusScore": 85
      }
    }
  }
  ```

### Get Insights
- **GET** `/api/analytics/insights?days=30`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "primaryDistraction": {
      "source": "Phone",
      "percentage": 45,
      "count": 23,
      "totalDistractions": 51
    },
    "peakPerformance": {
      "timeRange": "9 AM-11 AM",
      "averageScore": 92,
      "sessionCount": 15
    },
    "recoverySpeed": {
      "averageMinutes": 3.5,
      "sampleSize": 42,
      "fastestRecovery": 1.2,
      "slowestRecovery": 8.5
    }
  }
  ```

---

## Streak Routes (Requires Authentication)

### Record Login
- **POST** `/api/streak/login`
- **Headers:** `Authorization: Bearer {token}`

### Get Streak
- **GET** `/api/streak/streak`
- **Headers:** `Authorization: Bearer {token}`

### Get Activity History
- **GET** `/api/streak/history?days=30`
- **Headers:** `Authorization: Bearer {token}`

---

## Biometric Routes (Requires Authentication)

### Record Biometric Data
- **POST** `/api/biometric/record`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "sessionId": "session_id",
    "heartRate": 75,
    "eyeMovement": {...},
    "posture": "good"
  }
  ```

---

## Chat Routes (Requires Authentication)

### Send Message to AI Chatbot
- **POST** `/api/chat/message`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "message": "How can I improve my focus?",
    "context": {...}
  }
  ```

---

## Frontend API Usage

All API calls are handled through `src/services/api.js`:

```javascript
import { authAPI, sessionAPI, analyticsAPI, streakAPI } from './services/api';

// Login
const response = await authAPI.login(email, password);

// Start session
const session = await sessionAPI.startSession({ intendedDuration: 25, category: 'work' });

// Get analytics
const summary = await analyticsAPI.getDailySummary();
const trends = await analyticsAPI.getWeeklyTrends();
const insights = await analyticsAPI.getInsights(30);
```

---

## Error Handling

All routes return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```
