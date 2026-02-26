const mongoose = require('mongoose');
const User = require('./models/User');
const Session = require('./models/Session');
const Distraction = require('./models/Distraction');
require('dotenv').config();

const categories = ['work', 'study', 'creative', 'coding', 'reading'];
const distractionTypes = ['notification', 'phone', 'internal', 'environment', 'social'];
const distractionSources = ['Email', 'Phone Call', 'Slack', 'WhatsApp', 'Mind Wandering', 'Noise', 'Hunger', 'Social Media'];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Session.deleteMany({});
    await Distraction.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const user = new User({
      email: 'demo@focusloom.com',
      password: 'demo123',
      name: 'Demo User',
      preferences: {
        workHours: { start: '09:00', end: '17:00' },
        focusGoals: { daily: 240, weekly: 1200 },
        notificationSettings: { email: false, push: true }
      }
    });
    await user.save();
    console.log('Created demo user');

    // Create 30 days of sample data
    const sessions = [];
    const distractions = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Create 1-3 sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionsPerDay; j++) {
        const startHour = 9 + Math.floor(Math.random() * 8);
        const duration = 25 + Math.floor(Math.random() * 60); // 25-85 minutes
        
        const startTime = new Date(date);
        startTime.setHours(startHour, Math.floor(Math.random() * 60), 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);
        
        const session = new Session({
          userId: user._id,
          startTime,
          endTime,
          intendedDuration: duration,
          category: categories[Math.floor(Math.random() * categories.length)],
          status: 'completed',
          focusScore: 60 + Math.floor(Math.random() * 35),
        });
        
        const savedSession = await session.save();
        sessions.push(savedSession);
        
        // Create 2-8 distractions per session
        const distractionsPerSession = Math.floor(Math.random() * 7) + 2;
        
        for (let k = 0; k < distractionsPerSession; k++) {
          const distractionTime = new Date(startTime);
          distractionTime.setMinutes(distractionTime.getMinutes() + Math.floor(Math.random() * duration));
          
          const distractionDuration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
          const resolvedAt = new Date(distractionTime);
          resolvedAt.setSeconds(resolvedAt.getSeconds() + distractionDuration);
          
          const distraction = new Distraction({
            sessionId: savedSession._id,
            userId: user._id,
            timestamp: distractionTime,
            category: distractionTypes[Math.floor(Math.random() * distractionTypes.length)],
            source: distractionSources[Math.floor(Math.random() * distractionSources.length)],
            duration: distractionDuration,
            severity: Math.floor(Math.random() * 5) + 1,
            notes: 'Sample distraction',
            resolvedAt
          });
          
          await distraction.save();
          distractions.push(distraction);
        }
      }
    }
    
    console.log(`Created ${sessions.length} sessions and ${distractions.length} distractions`);
    console.log('Seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();