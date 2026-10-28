import express from 'express';
import Quest from '../models/Quest.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// GET Quests with filtering
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, status, tab } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (tab === 'today') {
      filter.$or = [
        { dueDate: { $gte: startOfToday, $lte: endOfToday } },
        { recurring: 'Daily' },
        { isPriority: true }
      ];
      filter.status = 'active';
    } else if (tab === 'upcoming') {
      filter.dueDate = { $gt: endOfToday };
      filter.status = 'active';
    } else if (tab === 'recurring') {
      filter.recurring = { $in: ['Daily', 'Weekly'] };
    } else if (tab === 'completed') {
      filter.status = 'completed';
    }

    const quests = await Quest.find(filter).sort({ isPriority: -1, createdAt: -1 });
    res.json(quests);
  } catch (err) {
    console.error('Error fetching quests:', err);
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
});

// CREATE Quest
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      xpReward, 
      attributeReward, 
      dueDate, 
      isPriority, 
      recurring 
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and Category are required' });
    }

    // Default XP based on difficulty if not provided
    let calculatedXp = Number(xpReward);
    if (!calculatedXp) {
      const xpMap = { Novice: 100, Adept: 200, Master: 350, Legendary: 600 };
      calculatedXp = xpMap[difficulty] || 150;
    }

    const quest = await Quest.create({
      title,
      description: description || '',
      category,
      difficulty: difficulty || 'Adept',
      xpReward: calculatedXp,
      attributeReward: attributeReward || 'discipline',
      dueDate: dueDate ? new Date(dueDate) : null,
      isPriority: !!isPriority,
      recurring: recurring || 'None',
      status: 'active'
    });

    res.status(201).json(quest);
  } catch (err) {
    console.error('Error creating quest:', err);
    res.status(500).json({ error: 'Failed to create quest' });
  }
});

// COMPLETE Quest
router.post('/:id/complete', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.completed) {
      return res.status(400).json({ error: 'Quest is already completed' });
    }

    // Mark quest completed
    quest.completed = true;
    quest.status = 'completed';
    quest.completedAt = new Date();
    await quest.save();

    // Find and update User progression
    let user = await User.findOne();
    if (!user) user = await User.create({});

    const levelResult = user.awardXp(quest.xpReward, quest.attributeReward);
    user.stats.questsCompleted += 1;
    await user.save();

    // Log Activity for real chart tracking
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    await ActivityLog.create({
      type: 'quest_completed',
      title: quest.title,
      xp: quest.xpReward,
      category: quest.category,
      date: now,
      day: days[now.getDay()]
    });

    res.json({
      success: true,
      quest,
      user,
      leveledUp: levelResult.leveledUp,
      oldLevel: levelResult.oldLevel,
      newLevel: levelResult.newLevel,
      xpGained: quest.xpReward,
      currentXp: user.xp,
      xpToNextLevel: user.xpToNextLevel,
      attributeReward: quest.attributeReward
    });
  } catch (err) {
    console.error('Error completing quest:', err);
    res.status(500).json({ error: 'Failed to complete quest' });
  }
});

// DELETE Quest
router.delete('/:id', async (req, res) => {
  try {
    const quest = await Quest.findByIdAndDelete(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json({ success: true, message: 'Quest deleted successfully' });
  } catch (err) {
    console.error('Error deleting quest:', err);
    res.status(500).json({ error: 'Failed to delete quest' });
  }
});

export default router;
