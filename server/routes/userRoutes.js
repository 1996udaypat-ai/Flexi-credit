import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET current user
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({});
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// UPDATE user profile / status
router.put('/profile', async (req, res) => {
  try {
    const { name, title, statusMessage, soundEnabled, avatarSeed } = req.body;
    let user = await User.findOne();
    if (!user) user = await User.create({});

    if (name !== undefined) user.name = name;
    if (title !== undefined) user.title = title;
    if (statusMessage !== undefined) user.statusMessage = statusMessage;
    if (soundEnabled !== undefined) user.soundEnabled = soundEnabled;
    if (avatarSeed !== undefined) user.avatarSeed = avatarSeed;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// TOGGLE sound
router.post('/toggle-sound', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) user = await User.create({});
    user.soundEnabled = !user.soundEnabled;
    await user.save();
    res.json({ soundEnabled: user.soundEnabled });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle sound' });
  }
});

export default router;
