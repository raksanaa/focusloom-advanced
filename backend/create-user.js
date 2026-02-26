const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = new User({
      name: 'Test User',
      email: 'Raksanaasekar2006@gmail.com',
      password: 'password123'
    });
    
    await user.save();
    console.log('User created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUser();