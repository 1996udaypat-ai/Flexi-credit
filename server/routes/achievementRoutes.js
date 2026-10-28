import express from 'express';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// GET all achievements
router.get('/', async (req, res) => {
  try {
    const { rarity, status } = req.query;
    const filter = {};
    if (rarity && rarity !== 'All') {
      filter.rarity = rarity;
    }
    if (status === 'unlocked') {
      filter.unlocked = true;
    } else if (status === 'locked') {
      filter.unlocked = false;
    }

    const achievements = await Achievement.find(filter).sort({ unlocked: -1, rewardXp: -1 });
    res.json(achievements);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// CLAIM achievement reward
router.post('/:id/claim', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    if (achievement.unlocked && achievement.claimed) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }

    achievement.unlocked = true;
    achievement.claimed = true;
    achievement.unlockedAt = new Date();
    await achievement.save();

    let user = await User.findOne();
    if (!user) user = await User.create({});
    const levelResult = user.awardXp(achievement.rewardXp, 'discipline');
    user.stats.achievementsUnlocked += 1;
    await user.save();

    // Log Activity
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    await ActivityLog.create({
      type: 'achievement_unlocked',
      title: `Relic Unlocked: ${achievement.title}`,
      xp: achievement.rewardXp,
      category: achievement.category,
      date: now,
      day: days[now.getDay()]
    });

    res.json({
      success: true,
      achievement,
      user,
      leveledUp: levelResult.leveledUp,
      oldLevel: levelResult.oldLevel,
      newLevel: levelResult.newLevel
    });
  } catch (err) {
    console.error('Error claiming achievement:', err);
    res.status(500).json({ error: 'Failed to claim achievement' });
  }
});

export default router;
