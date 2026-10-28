import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['quest_completed', 'level_up', 'skill_unlocked', 'achievement_unlocked']
  },
  title: { type: String, required: true },
  xp: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  date: { type: Date, default: Date.now },
  day: { type: String } // e.g. 'Mon', 'Tue'
}, { timestamps: true });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
