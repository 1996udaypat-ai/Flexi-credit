import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    required: true,
    enum: ['Vitality & Health', 'Mind & Knowledge', 'Craft & Career', 'Discipline & Focus']
  },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['Novice', 'Adept', 'Master', 'Legendary'],
    default: 'Adept'
  },
  xpReward: { type: Number, required: true, default: 150 },
  attributeReward: { 
    type: String, 
    enum: ['strength', 'intellect', 'focus', 'vitality', 'discipline'],
    default: 'discipline'
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  isPriority: { type: Boolean, default: false },
  recurring: { 
    type: String, 
    enum: ['None', 'Daily', 'Weekly'],
    default: 'None'
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.models.Quest || mongoose.model('Quest', QuestSchema);
