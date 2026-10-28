import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('Connected to MongoDB via URI');
      return;
    } catch (err) {
      console.warn('Could not connect to specified MONGODB_URI, falling back to local/embedded MongoDB:', err.message);
    }
  }

  // Try localhost mongod first
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/lifexp', { serverSelectionTimeoutMS: 1500 });
    console.log('Connected to local MongoDB instance on port 27017');
    return;
  } catch (err) {
    console.log('Local MongoDB not running. Initializing in-memory MongoDB engine...');
  }

  // Fallback to MongoMemoryServer
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'lifexp'
      }
    });
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log('Connected to In-Memory MongoDB at', memoryUri);
  } catch (memErr) {
    console.error('MongoMemoryServer initialization failed:', memErr.message);
    throw memErr;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}
