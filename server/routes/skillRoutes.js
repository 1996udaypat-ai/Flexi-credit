import express from 'express';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ branch: 1, tier: 1 });
    res.json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skill tree' });
  }
});

// UPGRADE / UNLOCK skill
router.post('/:skillId/upgrade', async (req, res) => {
  try {
    const { skillId } = req.params;
    const skill = await Skill.findOne({ skillId });
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.level >= skill.maxLevel) {
      return res.status(400).json({ error: 'Skill has reached maximum mastery' });
    }

    // Check prerequisites
    if (skill.prerequisites && skill.prerequisites.length > 0) {
      const prereqs = await Skill.find({ skillId: { $in: skill.prerequisites } });
      const unmet = prereqs.filter(p => !p.unlocked || p.level === 0);
      if (unmet.length > 0) {
        return res.status(400).json({ 
          error: `Prerequisites not satisfied. Must unlock: ${unmet.map(p => p.name).join(', ')}` 
        });
      }
    }

    // Check user XP
    let user = await User.findOne();
    if (!user) user = await User.create({});

    const cost = skill.requiredXp || 250;
    if (user.xp < cost && user.level < skill.tier * 3) {
      return res.status(400).json({ 
        error: `Insufficient resonance. Requires ${cost} XP or Character Level ${skill.tier * 3}.` 
      });
    }

    // Deduct cost and level up skill
    user.xp = Math.max(0, user.xp - cost);
    skill.level += 1;
    skill.unlocked = true;
    skill.currentXp = skill.requiredXp;
    skill.requiredXp = Math.round(skill.requiredXp * 1.35);

    // Attribute boost based on branch
    const branchToAttr = {
      Discipline: 'discipline',
      Intellect: 'intellect',
      Craft: 'focus',
      Vitality: 'vitality'
    };
    const attrKey = branchToAttr[skill.branch];
    if (attrKey && user.attributes[attrKey]) {
      user.attributes[attrKey] += 2;
    }

    user.stats.skillsUnlocked = await Skill.countDocuments({ unlocked: true });
    await skill.save();
    await user.save();

    // Log Activity
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    await ActivityLog.create({
      type: 'skill_unlocked',
      title: `Skill Advanced: ${skill.name} (Tier ${skill.level})`,
      xp: cost,
      category: skill.branch,
      date: now,
      day: days[now.getDay()]
    });

    res.json({
      success: true,
      skill,
      user,
      message: `Mastery advanced for ${skill.name} to Tier ${skill.level}!`
    });
  } catch (err) {
    console.error('Error upgrading skill:', err);
    res.status(500).json({ error: 'Failed to advance skill mastery' });
  }
});

export default router;
