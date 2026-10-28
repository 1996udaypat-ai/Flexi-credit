import mongoose from 'mongoose';

const LeaderboardUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, default: 'Explorer' },
  level: { type: Number, default: 1 },
  avatar: { type: String, default: '' },
  rank: { type: Number, default: 1 },
  movement: { type: String, enum: ['up', 'down', 'same'], default: 'same' },
  weeklyXp: { type: Number, default: 0 },
  monthlyXp: { type: Number, default: 0 },
  allTimeXp: { type: Number, default: 0 },
  isCurrentUser: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.LeaderboardUser || mongoose.model('LeaderboardUser', LeaderboardUserSchema);
