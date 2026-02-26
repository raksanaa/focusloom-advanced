# 🎯 FOCUSLOOM - Intelligent Attention & Distraction Mapping System

A modern, premium web application built with the MERN stack that helps users understand and improve their focus by mapping distraction patterns during work sessions.

## ✨ Key Features

- **🎯 Focus Quality Analysis** - Measures attention quality, not just time spent
- **⚠️ Distraction Mapping** - Identifies why focus breaks, not just when
- **📊 Smart Analytics** - AI-powered insights and personalized recommendations
- **🎨 Premium UI/UX** - Glassmorphism design with smooth animations
- **🌙 Dark Mode** - Beautiful light and dark themes
- **📱 Responsive** - Works perfectly on all devices
- **🔒 Secure** - JWT authentication and secure data handling

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, responsive charts
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Mongoose** - MongoDB object modeling

### Design System
- **Glassmorphism** - Modern glass-like UI elements
- **Inter & Poppins** - Premium typography
- **Custom Color Palette** - Calm and focus-oriented colors
- **Smooth Animations** - Micro-interactions and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FOCUSLOOM
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in both backend and frontend directories:
   
   **Backend (.env)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/focusloom
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   PORT=5000
   ```
   
   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start the Application**
   
   **Backend (Terminal 1)**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎨 Design System

### Color Palette
- **Focus Blue**: Primary brand color for focus-related elements
- **Calm Gray**: Neutral colors for backgrounds and text
- **Success Green**: Positive feedback and improvements
- **Warning Yellow**: Attention and caution states
- **Danger Red**: Distractions and negative states

### Components
- **Cards**: Glassmorphism design with subtle shadows
- **Buttons**: Multiple variants with smooth hover effects
- **Progress**: Circular progress indicators for focus scores
- **Charts**: Beautiful, responsive data visualizations

### Typography
- **Display**: Poppins for headings and brand elements
- **Body**: Inter for readable body text and UI elements

## 📊 Core Features

### 1. Focus Session Management
- Start/end focus sessions with category selection
- Real-time timer with circular progress indicator
- Session duration and intended time tracking

### 2. Distraction Logging
- Quick-tap distraction buttons during sessions
- Categorized distraction types (phone, social media, etc.)
- Timestamp and context tracking

### 3. Analytics Dashboard
- Focus score calculation and trends
- Weekly/monthly focus patterns
- Distraction breakdown and analysis
- Peak performance hours identification

### 4. Insights & Recommendations
- AI-powered personalized suggestions
- Focus improvement tips based on patterns
- Optimal session length recommendations
- Peak hours identification

## 🏗️ Project Structure

```
FOCUSLOOM/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   ├── utils/           # Analytics engine
│   └── server.js        # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   └── ui/      # Design system components
│   │   ├── pages/       # Main application pages
│   │   └── services/    # API calls and context
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔧 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend is production-ready
cd backend
npm start
```

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Consistent component naming (PascalCase)
- Utility-first CSS with Tailwind

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

### Backend (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Deploy with `npm start`

### Database (MongoDB Atlas)
1. Create a cluster
2. Get connection string
3. Update `MONGODB_URI` in environment

## 🎯 Future Enhancements

- **AI Distraction Prediction** - Predict when distractions are likely
- **Automatic Detection** - Tab switching and idle time tracking
- **Calendar Integration** - Sync with Google Calendar/Outlook
- **Mobile App** - React Native mobile application
- **Team Features** - Collaborative focus sessions
- **Gamification** - Focus streaks and achievements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from Notion, Linear, and Calm
- Icons from various emoji sets
- Color palette inspired by modern productivity apps
- Community feedback and suggestions

---

**Built with ❤️ for better focus and productivity**

*FOCUSLOOM - Because attention is your most valuable resource*