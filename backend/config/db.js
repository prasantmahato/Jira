// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
  
    } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }

  // Handle lost connection
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`🚨 MongoDB error: ${err}`);
  });
};

export default connectDB;
