// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Task from './models/Task.js';
import dummyData from './dummyData.ts';

// Load env variables
dotenv.config();

async function seedTasks() {
  try {
    await connectDB(); // Connect to MongoDB using config

    console.log('🔥 Seeding tasks...');
    await Task.deleteMany(); // Optional: clean up old data
    await Task.insertMany(dummyData);
    console.log('✅ Dummy tasks inserted successfully.');

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
    process.exit(); // Exit the process
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedTasks();
