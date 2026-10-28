import { connectDB, disconnectDB } from './db.js';
import User from './models/User.js';
import Quest from './models/Quest.js';
import Skill from './models/Skill.js';
import Achievement from './models/Achievement.js';
import ActivityLog from './models/ActivityLog.js';
import LeaderboardUser from './models/LeaderboardUser.js';

export async function seedDatabase() {
  console.log('--- Initializing LifeXP Database Seed ---');
  
  // 1. User
  await User.deleteMany({});
  const user = await User.create({
    name: 'Vanguard Aria',
    title: 'Shadow Voyager',
    rank: 'Rank IV — Obsidian',
    level: 14,
    xp: 4850,
    xpToNextLevel: 6000,
    streak: 9,
    statusMessage: 'Attuning mind, refining craft, forging steel habits.',
    soundEnabled: true,
    avatarSeed: 'aria_obsidian',
    attributes: {
      strength: 32,
      intellect: 48,
      focus: 40,
      vitality: 34,
      discipline: 45
    },
    stats: {
      questsCompleted: 58,
      skillsUnlocked: 14,
      achievementsUnlocked: 11,
      totalXpEarned: 34850,
      weeklyXp: 3450
    }
  });

  // 2. Quests
  await Quest.deleteMany({});
  const quests = [
    {
      title: 'Deep Architecture Refactor',
      description: 'Isolate critical services into modular, resilient state boundaries without performance degradation.',
      category: 'Craft & Career',
      difficulty: 'Master',
      xpReward: 350,
      attributeReward: 'focus',
      completed: false,
      isPriority: true,
      dueDate: new Date(Date.now() + 86400000 * 1),
      recurring: 'None',
      status: 'active'
    },
    {
      title: 'Dawn Endurance Circuit',
      description: '45-minute high intensity resistance session and mobility stretch sequence.',
      category: 'Vitality & Health',
      difficulty: 'Adept',
      xpReward: 200,
      attributeReward: 'strength',
      completed: false,
      isPriority: false,
      dueDate: new Date(),
      recurring: 'Daily',
      status: 'active'
    },
    {
      title: 'Algorithmic Synthesis Study',
      description: 'Synthesize research paper on distributed consensus protocols and summarize 3 core takeaways.',
      category: 'Mind & Knowledge',
      difficulty: 'Adept',
      xpReward: 220,
      attributeReward: 'intellect',
      completed: false,
      isPriority: false,
      dueDate: new Date(),
      recurring: 'None',
      status: 'active'
    },
    {
      title: 'Digital Fast & Unbroken Focus',
      description: 'Complete 3 full 90-minute Pomodoro blocks with zero social media or notification interruption.',
      category: 'Discipline & Focus',
      difficulty: 'Master',
      xpReward: 300,
      attributeReward: 'discipline',
      completed: false,
      isPriority: false,
      dueDate: new Date(),
      recurring: 'Daily',
      status: 'active'
    },
    {
      title: 'Master Class Portfolio Delivery',
      description: 'Deploy public production release with complete responsive audit and zero console warnings.',
      category: 'Craft & Career',
      difficulty: 'Legendary',
      xpReward: 650,
      attributeReward: 'intellect',
      completed: false,
      isPriority: false,
      dueDate: new Date(Date.now() + 86400000 * 3),
      recurring: 'None',
      status: 'active'
    },
    {
      title: 'Hydration & Micro-Nutrient Protocol',
      description: 'Drink 3.5 liters of clean water and ingest required electrolytes & micronutrients.',
      category: 'Vitality & Health',
      difficulty: 'Novice',
      xpReward: 100,
      attributeReward: 'vitality',
      completed: true,
      completedAt: new Date(Date.now() - 3600000 * 4),
      dueDate: new Date(),
      recurring: 'Daily',
      status: 'completed'
    },
    {
      title: 'Evening Mental Defragmentation',
      description: 'Review day retrospectives, log gratitude, and complete 15 minutes of zero-light breathwork.',
      category: 'Discipline & Focus',
      difficulty: 'Novice',
      xpReward: 120,
      attributeReward: 'discipline',
      completed: true,
      completedAt: new Date(Date.now() - 3600000 * 20),
      dueDate: new Date(Date.now() - 86400000),
      recurring: 'Daily',
      status: 'completed'
    },
    {
      title: 'Technical Manuscript Draft',
      description: 'Write chapter 4 on asynchronous state synchronization patterns.',
      category: 'Mind & Knowledge',
      difficulty: 'Adept',
      xpReward: 250,
      attributeReward: 'intellect',
      completed: true,
      completedAt: new Date(Date.now() - 86400000 * 2),
      dueDate: new Date(Date.now() - 86400000 * 2),
      recurring: 'None',
      status: 'completed'
    }
  ];
  await Quest.insertMany(quests);

  // 3. Skill Tree
  await Skill.deleteMany({});
  const skills = [
    // Branch 1: Discipline & Focus
    {
      skillId: 'focus_ignition',
      name: 'Focus Ignition',
      branch: 'Discipline',
      tier: 1,
      level: 5,
      maxLevel: 5,
      currentXp: 500,
      requiredXp: 500,
      description: 'Ability to transition into focused execution state within 120 seconds.',
      icon: 'Target',
      unlocked: true,
      prerequisites: [],
      bonuses: ['+10% XP on morning missions', 'Instant flow state entry'],
      relatedQuests: ['Digital Fast & Unbroken Focus'],
      nextMilestone: 'Maximum mastery achieved.',
      coordinates: { x: 100, y: 80 }
    },
    {
      skillId: 'deep_work_flow',
      name: 'Deep Work Flow',
      branch: 'Discipline',
      tier: 2,
      level: 3,
      maxLevel: 5,
      currentXp: 450,
      requiredXp: 700,
      description: 'Sustain uninterrupted cognitive depth across extended 90-minute cycles.',
      icon: 'Shield',
      unlocked: true,
      prerequisites: ['focus_ignition'],
      bonuses: ['Resistance to cognitive fatigue +25%', '+15% Discipline points'],
      relatedQuests: ['Digital Fast & Unbroken Focus'],
      nextMilestone: 'Tier 4: Unlock 120-minute continuous hyperfocus threshold.',
      coordinates: { x: 100, y: 220 }
    },
    {
      skillId: 'chronos_mastery',
      name: 'Chronos Mastery',
      branch: 'Discipline',
      tier: 3,
      level: 1,
      maxLevel: 5,
      currentXp: 200,
      requiredXp: 900,
      description: 'Precision time-blocking and proactive boundary defense.',
      icon: 'Clock',
      unlocked: true,
      prerequisites: ['deep_work_flow'],
      bonuses: ['Streak multiplier +0.2x', 'Eliminates scheduling friction'],
      relatedQuests: ['Evening Mental Defragmentation'],
      nextMilestone: 'Tier 2: Automatic daily buffer calibration.',
      coordinates: { x: 100, y: 360 }
    },
    {
      skillId: 'indomitable_will',
      name: 'Indomitable Will',
      branch: 'Discipline',
      tier: 4,
      level: 0,
      maxLevel: 5,
      currentXp: 0,
      requiredXp: 1500,
      description: 'Apex mental resilience. Zero breakdown under high cognitive strain.',
      icon: 'Zap',
      unlocked: false,
      prerequisites: ['chronos_mastery'],
      bonuses: ['Double XP on Legendary quests', 'Never lose streaks on emergency days'],
      relatedQuests: [],
      nextMilestone: 'Requires Level 16 and Chronos Mastery Tier 3.',
      coordinates: { x: 100, y: 500 }
    },

    // Branch 2: Mind & Knowledge
    {
      skillId: 'knowledge_synthesis',
      name: 'Knowledge Synthesis',
      branch: 'Intellect',
      tier: 1,
      level: 4,
      maxLevel: 5,
      currentXp: 620,
      requiredXp: 750,
      description: 'Extract core principles from technical manuals and research papers with high retention.',
      icon: 'BookOpen',
      unlocked: true,
      prerequisites: [],
      bonuses: ['+15% Intellect reward bonus', 'Structured mental schemas'],
      relatedQuests: ['Algorithmic Synthesis Study'],
      nextMilestone: 'Tier 5: Instant flashcard generation from notes.',
      coordinates: { x: 300, y: 80 }
    },
    {
      skillId: 'systems_thinking',
      name: 'Systems Architecture',
      branch: 'Intellect',
      tier: 2,
      level: 3,
      maxLevel: 5,
      currentXp: 480,
      requiredXp: 800,
      description: 'Deconstruct complex multi-tiered networks into fundamental causal loops.',
      icon: 'Cpu',
      unlocked: true,
      prerequisites: ['knowledge_synthesis'],
      bonuses: ['Decomposition speed +30%', '+20% Craft quest efficiency'],
      relatedQuests: ['Deep Architecture Refactor'],
      nextMilestone: 'Tier 4: Predictive bottleneck detection.',
      coordinates: { x: 300, y: 220 }
    },
    {
      skillId: 'polymathic_nexus',
      name: 'Polymathic Nexus',
      branch: 'Intellect',
      tier: 3,
      level: 0,
      maxLevel: 5,
      currentXp: 0,
      requiredXp: 1100,
      description: 'Cross-pollinate ideas across disparate fields: biology, computing, and economics.',
      icon: 'Compass',
      unlocked: false,
      prerequisites: ['systems_thinking'],
      bonuses: ['Unlock emergent insight quests', '+250 bonus XP on multi-discipline tasks'],
      relatedQuests: [],
      nextMilestone: 'Unlock by leveling Systems Architecture to Tier 4.',
      coordinates: { x: 300, y: 360 }
    },

    // Branch 3: Craft & Career
    {
      skillId: 'clean_execution',
      name: 'Clean Execution',
      branch: 'Craft',
      tier: 1,
      level: 5,
      maxLevel: 5,
      currentXp: 500,
      requiredXp: 500,
      description: 'Deliver clean, maintainable, tested implementations on the first iteration.',
      icon: 'Code',
      unlocked: true,
      prerequisites: [],
      bonuses: ['Error rate -40%', '+50 XP on completion with zero bugs'],
      relatedQuests: ['Deep Architecture Refactor'],
      nextMilestone: 'Maxed out Master Rank.',
      coordinates: { x: 500, y: 80 }
    },
    {
      skillId: 'speed_prototyping',
      name: 'Hypervelocity Craft',
      branch: 'Craft',
      tier: 2,
      level: 2,
      maxLevel: 5,
      currentXp: 280,
      requiredXp: 650,
      description: 'Rapidly spin up robust, production-grade applications from scratch.',
      icon: 'Flame',
      unlocked: true,
      prerequisites: ['clean_execution'],
      bonuses: ['Initial build velocity +50%', 'Instant boilerplates'],
      relatedQuests: ['Master Class Portfolio Delivery'],
      nextMilestone: 'Tier 3: Automated testing harnesses.',
      coordinates: { x: 500, y: 220 }
    },
    {
      skillId: 'master_artisan',
      name: 'Master Artisan',
      branch: 'Craft',
      tier: 3,
      level: 0,
      maxLevel: 5,
      currentXp: 0,
      requiredXp: 1300,
      description: 'Flawless aesthetic taste meets rock-solid engineering.',
      icon: 'Sparkles',
      unlocked: false,
      prerequisites: ['speed_prototyping'],
      bonuses: ['Craft quests award Rare achievement progress', '+20% All stats'],
      relatedQuests: [],
      nextMilestone: 'Requires Level 15 and Hypervelocity Tier 3.',
      coordinates: { x: 500, y: 360 }
    },

    // Branch 4: Vitality & Health
    {
      skillId: 'cellular_energy',
      name: 'Cellular Vitality',
      branch: 'Vitality',
      tier: 1,
      level: 4,
      maxLevel: 5,
      currentXp: 400,
      requiredXp: 600,
      description: 'Optimized metabolic efficiency and steady energy curve across 16 waking hours.',
      icon: 'Heart',
      unlocked: true,
      prerequisites: [],
      bonuses: ['Zero afternoon energy crashes', 'Recovery speed +20%'],
      relatedQuests: ['Hydration & Micro-Nutrient Protocol'],
      nextMilestone: 'Tier 5: Supercharged morning alertness.',
      coordinates: { x: 700, y: 80 }
    },
    {
      skillId: 'kinetic_power',
      name: 'Kinetic Conditioning',
      branch: 'Vitality',
      tier: 2,
      level: 2,
      maxLevel: 5,
      currentXp: 300,
      requiredXp: 700,
      description: 'High functional strength, joint resilience, and peak cardiovascular capacity.',
      icon: 'Activity',
      unlocked: true,
      prerequisites: ['cellular_energy'],
      bonuses: ['Physical stamina +35%', 'Endorphin flow amplification'],
      relatedQuests: ['Dawn Endurance Circuit'],
      nextMilestone: 'Tier 3: Unlock 10km endurance threshold.',
      coordinates: { x: 700, y: 220 }
    },
    {
      skillId: 'somatosensory_zen',
      name: 'Somatosensory Zen',
      branch: 'Vitality',
      tier: 3,
      level: 0,
      maxLevel: 5,
      currentXp: 0,
      requiredXp: 1200,
      description: 'Mastery over autonomic nervous system down-regulation and deep REM sleep.',
      icon: 'Feather',
      unlocked: false,
      prerequisites: ['kinetic_power'],
      bonuses: ['Sleep restoration score +40%', 'Instant parasympathetic shift'],
      relatedQuests: [],
      nextMilestone: 'Requires Kinetic Conditioning Tier 3.',
      coordinates: { x: 700, y: 360 }
    }
  ];
  await Skill.insertMany(skills);

  // 4. Achievements (Collectible Gallery with 5 rarity tiers)
  await Achievement.deleteMany({});
  const achievements = [
    {
      achievementId: 'first_light',
      title: 'First Light',
      description: 'Complete your first registered quest in the LifeXP realm.',
      lore: 'The longest odyssey begins with a single deliberate step into the unknown.',
      category: 'Progression',
      rarity: 'Common',
      icon: 'Sun',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 30),
      rewardXp: 100
    },
    {
      achievementId: 'iron_streak_7',
      title: 'Sevenfold Vanguard',
      description: 'Maintain an unbroken 7-day daily quest streak.',
      lore: 'Consistency is the crucible where fleeting motivation transforms into steel character.',
      category: 'Discipline',
      rarity: 'Uncommon',
      icon: 'Flame',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 2),
      rewardXp: 350
    },
    {
      achievementId: 'deep_architect',
      title: 'Master Architect',
      description: 'Complete 15 Master or Legendary tier Craft missions.',
      lore: 'You shape complex digital cathedrals with deliberate restraint and surgical precision.',
      category: 'Craft',
      rarity: 'Rare',
      icon: 'Layers',
      progress: 12,
      maxProgress: 15,
      unlocked: false,
      unlockedAt: null,
      rewardXp: 750
    },
    {
      achievementId: 'mind_ascendant',
      title: 'Neural Synthesizer',
      description: 'Accumulate 10,000 XP exclusively in the Mind & Knowledge domain.',
      lore: 'Concepts begin to speak to one another across the folds of your consciousness.',
      category: 'Intellect',
      rarity: 'Rare',
      icon: 'Brain',
      progress: 8940,
      maxProgress: 10000,
      unlocked: false,
      unlockedAt: null,
      rewardXp: 800
    },
    {
      achievementId: 'obsidian_rank',
      title: 'Obsidian Awakening',
      description: 'Reach Character Level 12 and claim the Obsidian Rank insignia.',
      lore: 'The darkness bends to those who walk through it with quiet conviction.',
      category: 'Progression',
      rarity: 'Epic',
      icon: 'ShieldAlert',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000 * 5),
      rewardXp: 1200
    },
    {
      achievementId: 'titan_fortitude',
      title: 'Fortitude of Titans',
      description: 'Complete 30 consecutive days without failing a single assigned daily objective.',
      lore: 'Neither storm nor fatigue shall waver the resolve of the true practitioner.',
      category: 'Discipline',
      rarity: 'Epic',
      icon: 'ShieldCheck',
      progress: 19,
      maxProgress: 30,
      unlocked: false,
      unlockedAt: null,
      rewardXp: 1500
    },
    {
      achievementId: 'sovereign_prime',
      title: 'Sovereign of the Stars',
      description: 'Ascend to Level 25, master 4 Tier-4 apex skills, and unlock 20 achievements.',
      lore: 'Legend speaks of one whose every heartbeat was an instrument of sheer creation and will.',
      category: 'Ascension',
      rarity: 'Legendary',
      icon: 'Crown',
      progress: 14,
      maxProgress: 25,
      unlocked: false,
      unlockedAt: null,
      rewardXp: 5000
    },
    {
      achievementId: 'eternal_flame',
      title: 'The Eternal Flame',
      description: 'Achieve a 100-day unbroken streak in LifeXP.',
      lore: 'A fire kindled so brightly that darkness itself retreats before your presence.',
      category: 'Discipline',
      rarity: 'Legendary',
      icon: 'Sparkle',
      progress: 9,
      maxProgress: 100,
      unlocked: false,
      unlockedAt: null,
      rewardXp: 4000
    }
  ];
  await Achievement.insertMany(achievements);

  // 5. Activity Logs (Real history for charts)
  await ActivityLog.deleteMany({});
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activityLogs = [];
  
  const xpAmounts = [450, 680, 520, 890, 710, 950, 640];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    activityLogs.push({
      type: 'quest_completed',
      title: `Daily Protocol Log - ${days[d.getDay()]}`,
      xp: xpAmounts[6 - i],
      category: i % 2 === 0 ? 'Craft & Career' : 'Mind & Knowledge',
      date: d,
      day: days[d.getDay()]
    });
  }
  await ActivityLog.insertMany(activityLogs);

  // 6. Leaderboard Users
  await LeaderboardUser.deleteMany({});
  const leaderboard = [
    {
      username: 'Kaelen Swift',
      title: 'Apex Luminary',
      level: 19,
      avatar: 'kaelen',
      rank: 1,
      movement: 'same',
      weeklyXp: 4950,
      monthlyXp: 18200,
      allTimeXp: 58900,
      isCurrentUser: false
    },
    {
      username: 'Valeria Void',
      title: 'Astral Warden',
      level: 17,
      avatar: 'valeria',
      rank: 2,
      movement: 'up',
      weeklyXp: 4320,
      monthlyXp: 16900,
      allTimeXp: 51200,
      isCurrentUser: false
    },
    {
      username: 'Vanguard Aria', // Current user
      title: 'Shadow Voyager',
      level: 14,
      avatar: 'aria',
      rank: 3,
      movement: 'up',
      weeklyXp: 3450,
      monthlyXp: 14100,
      allTimeXp: 34850,
      isCurrentUser: true
    },
    {
      username: 'Darian Iron',
      title: 'Titan Striker',
      level: 13,
      avatar: 'darian',
      rank: 4,
      movement: 'down',
      weeklyXp: 3100,
      monthlyXp: 13800,
      allTimeXp: 32600,
      isCurrentUser: false
    },
    {
      username: 'Seraphina Ciel',
      title: 'Chrono Weaver',
      level: 12,
      avatar: 'seraphina',
      rank: 5,
      movement: 'same',
      weeklyXp: 2850,
      monthlyXp: 12400,
      allTimeXp: 29800,
      isCurrentUser: false
    },
    {
      username: 'Ren of Shadows',
      title: 'Phantom Adept',
      level: 11,
      avatar: 'ren',
      rank: 6,
      movement: 'up',
      weeklyXp: 2600,
      monthlyXp: 11200,
      allTimeXp: 27500,
      isCurrentUser: false
    },
    {
      username: 'Mira Solis',
      title: 'Solar Sentinel',
      level: 10,
      avatar: 'mira',
      rank: 7,
      movement: 'down',
      weeklyXp: 2400,
      monthlyXp: 10500,
      allTimeXp: 24900,
      isCurrentUser: false
    }
  ];
  await LeaderboardUser.insertMany(leaderboard);

  console.log('--- LifeXP Database Seeding Complete ---');
}

// Allow direct CLI execution if run directly
if (process.argv[1]?.endsWith('seed.js')) {
  connectDB()
    .then(seedDatabase)
    .then(() => {
      console.log('Seed finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
