import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  skillId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { 
    type: String, 
    required: true,
    enum: ['Vitality', 'Intellect', 'Craft', 'Discipline']
  },
  tier: { type: Number, default: 1 },
  level: { type: Number, default: 0 },
  maxLevel: { type: Number, default: 5 },
  currentXp: { type: Number, default: 0 },
  requiredXp: { type: Number, default: 250 },
  description: { type: String, required: true },
  icon: { type: String, default: 'Zap' },
  unlocked: { type: Boolean, default: false },
  prerequisites: [{ type: String }],
  bonuses: [{ type: String }],
  relatedQuests: [{ type: String }],
  nextMilestone: { type: String, default: '' },
  coordinates: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
