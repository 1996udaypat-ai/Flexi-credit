import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { seedDatabase } from './seed.js';
import User from './models/User.js';

import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', system: 'LifeXP OS Core', timestamp: new Date() });
});

// Start Server & Connect MongoDB
async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is brand new
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No user detected. Seeding initial LifeXP game world state...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`[LifeXP Engine] Server operational on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start LifeXP server:', err);
    process.exit(1);
  }
}

startServer();
