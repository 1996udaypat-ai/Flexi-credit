import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, default: 'Vanguard Aria' },
  title: { type: String, default: 'Shadow Voyager' },
  rank: { type: String, default: 'Rank IV — Obsidian' },
  level: { type: Number, default: 14 },
  xp: { type: Number, default: 4850 },
  xpToNextLevel: { type: Number, default: 6000 },
  streak: { type: Number, default: 9 },
  lastActiveDate: { type: Date, default: Date.now },
  statusMessage: { type: String, default: 'Attuning mind, refining craft, forging steel habits.' },
  soundEnabled: { type: Boolean, default: true },
  avatarSeed: { type: String, default: 'aria_obsidian' },
  attributes: {
    strength: { type: Number, default: 28 },
    intellect: { type: Number, default: 44 },
    focus: { type: Number, default: 36 },
    vitality: { type: Number, default: 30 },
    discipline: { type: Number, default: 42 }
  },
  stats: {
    questsCompleted: { type: Number, default: 52 },
    skillsUnlocked: { type: Number, default: 14 },
    achievementsUnlocked: { type: Number, default: 11 },
    totalXpEarned: { type: Number, default: 34850 },
    weeklyXp: { type: Number, default: 3200 }
  }
}, { timestamps: true });

// Method to award XP and handle level up
UserSchema.methods.awardXp = function(amount, attributeKey) {
  this.xp += amount;
  this.stats.totalXpEarned += amount;
  this.stats.weeklyXp += amount;
  
  if (attributeKey && this.attributes[attributeKey] !== undefined) {
    this.attributes[attributeKey] += Math.max(1, Math.floor(amount / 100));
  }

  let leveledUp = false;
  let oldLevel = this.level;
  
  while (this.xp >= this.xpToNextLevel) {
    this.xp -= this.xpToNextLevel;
    this.level += 1;
    this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.2);
    leveledUp = true;
    
    // Update Rank titles dynamically based on milestones
    if (this.level >= 25) this.rank = 'Rank VII — Sovereign of Stars';
    else if (this.level >= 20) this.rank = 'Rank VI — Ascendant';
    else if (this.level >= 16) this.rank = 'Rank V — Master Weaver';
    else if (this.level >= 12) this.rank = 'Rank IV — Obsidian';
    else if (this.level >= 8) this.rank = 'Rank III — Vanguard';
    else if (this.level >= 4) this.rank = 'Rank II — Adept';
    else this.rank = 'Rank I — Initiate';
  }

  return { leveledUp, oldLevel, newLevel: this.level, currentXp: this.xp, xpToNextLevel: this.xpToNextLevel };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
