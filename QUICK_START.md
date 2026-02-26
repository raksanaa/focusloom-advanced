# 🚀 FOCUSLOOM - Quick Start Guide

## ✨ What's Been Added

### New Landing Page with Extraordinary Animations
- **Animated gradient background** with floating blur shapes
- **Auto-rotating carousel** showcasing 5 key features
- **Floating stat cards** with smooth animations
- **Glassmorphism UI** - Modern, polished design
- **Responsive layout** - Works on all devices
- **Smart routing** - Auto-redirects logged-in users to dashboard

### Features Showcased
1. 🎓 **Live Session** - Real-time focus tracking
2. 🔒 **Secure Test** - Proctored exam mode
3. 🤖 **AI Insights** - Smart recommendations
4. 📊 **Analytics** - Deep focus pattern analysis
5. 🏆 **Achievements** - Gamified progress tracking

---

## 🏃 Quick Start (3 Steps)

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 2: Start Backend
```bash
cd FOCUSLOOM/backend
npm install
npm start
```
✅ Backend running on `http://localhost:5000`

### Step 3: Start Frontend
```bash
cd FOCUSLOOM/frontend
npm install
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🎯 Test the Application

### 1. Visit Landing Page
Open browser: `http://localhost:3000`

You should see:
- Animated gradient background
- Hero section with floating cards
- Auto-rotating feature carousel
- Stats section
- Login/Register buttons

### 2. Register New Account
1. Click "Get Started" or "Register"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Sign up"
4. ✅ Auto-redirected to Dashboard

### 3. Test Dashboard
After login, you should see:
- Focus timer
- Daily stats (Focus Score, Focus Time, Distractions)
- Weekly trends chart
- Recent sessions

### 4. Test Logout & Login
1. Logout from dashboard
2. Visit `http://localhost:3000` - See landing page
3. Click "Login"
4. Enter credentials
5. ✅ Redirected to Dashboard

---

## 📁 Project Structure

```
FOCUSLOOM/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Distraction.js
│   │   └── BiometricData.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js       # Login/Register
│   │   ├── sessions.js   # Session management
│   │   ├── analytics.js  # Analytics data
│   │   ├── streak.js     # Streak tracking
│   │   └── biometric.js  # Biometric data
│   ├── middleware/
│   │   └── auth.js       # JWT authentication
│   ├── utils/
│   │   └── analyticsEngine.js
│   ├── .env              # Environment variables
│   ├── server.js         # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    ✨ NEW
│   │   │   ├── LandingPage.css    ✨ NEW
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FocusTimer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── context/
│   │   │   │   └── AuthContext.js
│   │   │   └── api.js
│   │   ├── App.js        # Updated routing
│   │   └── App.css       # Updated styles
│   ├── .env
│   └── package.json
│
├── API_ROUTES.md         ✨ NEW - API documentation
├── LANDING_PAGE_SETUP.md ✨ NEW - Setup guide
└── LANDING_PAGE_FEATURES.md ✨ NEW - Feature details
```

---

## 🔑 Key Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/analytics` - Analytics page
- `/settings` - Settings page

---

## 🎨 Customization

### Change Landing Page Colors
Edit `frontend/src/pages/LandingPage.css`:

```css
/* Background gradient */
.landing-page {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Feature colors */
/* Edit in LandingPage.jsx features array */
```

### Change Carousel Speed
Edit `frontend/src/pages/LandingPage.jsx`:

```javascript
// Line ~23
setInterval(() => {
  setCurrentFeature((prev) => (prev + 1) % features.length);
}, 3000); // Change 3000 to your desired milliseconds
```

### Add More Features
Edit `frontend/src/pages/LandingPage.jsx`:

```javascript
const features = [
  // ... existing features
  { 
    icon: '🎯', 
    title: 'Your Feature', 
    desc: 'Description here', 
    color: '#hexcolor' 
  }
];
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas connection string in backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/focusloom
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Change port in backend/.env
PORT=5001

# Update frontend/.env
REACT_APP_API_URL=http://localhost:5001
```

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Issue: Landing page not showing
**Solution:**
1. Clear browser cache
2. Check console for errors
3. Verify both servers are running
4. Check `http://localhost:3000` directly

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Sessions
- `POST /api/sessions/start` - Start focus session
- `POST /api/sessions/:id/end` - End session
- `POST /api/sessions/:id/distractions` - Log distraction
- `GET /api/sessions` - Get user sessions

### Analytics
- `GET /api/analytics/daily-summary` - Daily stats
- `GET /api/analytics/weekly-trends` - Weekly data
- `GET /api/analytics/insights` - AI insights

See `API_ROUTES.md` for complete documentation.

---

## 🎯 Next Steps

1. ✅ Landing page is live
2. ✅ Authentication working
3. ✅ Dashboard accessible
4. ✅ All API routes configured

### Recommended Enhancements
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add social login (Google, GitHub)
- [ ] Deploy to production (Vercel + Render)
- [ ] Add analytics tracking (Google Analytics)
- [ ] Implement real-time notifications
- [ ] Add dark mode toggle
- [ ] Create mobile app version

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/focusloom
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy build folder to Vercel
```

### Backend (Render)
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy

---

## 💡 Tips

1. **Development**: Use `npm run dev` in backend for auto-reload
2. **Testing**: Create test user: test@example.com / test123
3. **Debugging**: Check browser console and terminal logs
4. **Performance**: Use React DevTools for optimization
5. **Security**: Change JWT_SECRET in production

---

## 📞 Support

If you encounter issues:
1. Check console logs (browser & terminal)
2. Verify all dependencies installed
3. Ensure MongoDB is running
4. Check environment variables
5. Review API_ROUTES.md for endpoint details

---

**🎉 Your landing page is ready! Start both servers and visit http://localhost:3000**
