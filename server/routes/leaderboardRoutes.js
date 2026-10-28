import express from 'express';
import LeaderboardUser from '../models/LeaderboardUser.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const period = req.query.period || 'weekly'; // weekly, monthly, allTime
    const sortField = period === 'monthly' ? 'monthlyXp' : (period === 'allTime' ? 'allTimeXp' : 'weeklyXp');

    // Keep current user in sync with User collection
    const currentUser = await User.findOne();
    if (currentUser) {
      await LeaderboardUser.updateOne(
        { isCurrentUser: true },
        {
          $set: {
            username: currentUser.name,
            title: currentUser.title,
            level: currentUser.level,
            weeklyXp: currentUser.stats.weeklyXp,
            allTimeXp: currentUser.stats.totalXpEarned
          }
        }
      );
    }

    const leaderboard = await LeaderboardUser.find().sort({ [sortField]: -1 });

    // Calculate dynamic ranks based on sorted order
    const rankedList = leaderboard.map((item, index) => {
      const obj = item.toObject();
      obj.rank = index + 1;
      obj.currentPeriodXp = item[sortField];
      return obj;
    });

    res.json({
      period,
      rankings: rankedList,
      metricDescription: period === 'weekly'
        ? 'Total XP earned through completed missions and skill practice over the current 7-day cycle.'
        : (period === 'monthly'
          ? 'Cumulative XP earned across all 30 calendar days of active discipline.'
          : 'Total lifetime XP amassed since initiating the LifeXP operating system.')
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
