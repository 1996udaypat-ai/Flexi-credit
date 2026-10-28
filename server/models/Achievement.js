import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  achievementId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lore: { type: String, default: '' },
  category: { type: String, default: 'General' },
  rarity: { 
    type: String, 
    required: true, 
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  icon: { type: String, default: 'Award' },
  progress: { type: Number, default: 0 },
  maxProgress: { type: Number, default: 1 },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: null },
  rewardXp: { type: Number, default: 200 }
}, { timestamps: true });

export default mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
