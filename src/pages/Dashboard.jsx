import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  Award,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import CharacterAvatar from '../components/CharacterAvatar.jsx';
import QuestRow from '../components/QuestRow.jsx';
import ActivityChart from '../components/ActivityChart.jsx';
import { playClickSound } from '../utils/audio.js';

export default function Dashboard({ 
  user, 
  quests = [], 
  stats, 
  achievements = [], 
  onCompleteQuest, 
  onDeleteQuest, 
  onNavigate,
  onOpenNewQuest
}) {
  const activeQuests = quests.filter(q => !q.completed).slice(0, 5);
  const recentAchievements = achievements.slice(0, 4);

  const xpPercent = user ? Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100)) : 0;

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* A. Welcome Header */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="label-caps" style={{ color: 'var(--accent-primary)', letterSpacing: '0.12em' }}>
            // YOUR JOURNEY CONTINUES
          </span>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <span className="mono-num" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            STATUS: ACTIVE RESONANCE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '6px' }}>
              Become who you set out to be, <span style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Aria'}</span>.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '580px' }}>
              Every completed mission refines your character attributes and deepens your legacy.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary"
              onClick={() => {
                playClickSound(user?.soundEnabled);
                onNavigate('character');
              }}
            >
              Inspect Hero Matrix
              <ArrowUpRight size={14} />
            </button>
            <button 
              className="btn-primary"
              onClick={() => {
                playClickSound(user?.soundEnabled);
                onOpenNewQuest();
              }}
            >
              + Add Mission
            </button>
          </div>
        </div>
      </section>

      {/* B. Main Character Panel (Hero Showcase) */}
      <section 
        className="surface-panel"
        style={{
          marginBottom: '32px',
          padding: '36px 40px',
          background: 'linear-gradient(135deg, rgba(23, 24, 32, 0.95) 0%, rgba(16, 17, 22, 0.98) 100%)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative'
        }}
      >
        {/* Ambient Radial Illumination */}
        <div 
          style={{
            position: 'absolute',
            top: '-50px',
            right: '10%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '36px', alignItems: 'center' }}>
          {/* Left: Character Portrait & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderRight: '1px solid var(--border-subtle)', paddingRight: '36px' }}>
            <CharacterAvatar size="md" level={user?.level} rank={user?.rank} />
            <div>
              <div className="label-caps" style={{ color: 'var(--accent-rare)', marginBottom: '4px' }}>
                {user?.rank || 'Rank IV — Obsidian'}
              </div>
              <h2 style={{ fontSize: '24px', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {user?.name || 'Vanguard Aria'}
              </h2>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  marginBottom: '10px'
                }}
              >
                <Shield size={12} color="var(--accent-primary)" />
                <span className="mono-num" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  LEVEL {user?.level || 14}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '240px' }}>
                "{user?.statusMessage || 'Attuning mind, refining craft, forging steel habits.'}"
              </div>
            </div>
          </div>

          {/* Right: XP Progression & Character Vitals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span className="label-caps">XP RESONANCE</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span className="mono-num" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {user?.xp?.toLocaleString() || 0}
                  </span>
                  <span className="mono-num" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    / {user?.xpToNextLevel?.toLocaleString() || 6000} XP
                  </span>
                </div>
              </div>
              <div className="mono-num" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {xpPercent}% TO LEVEL {(user?.level || 14) + 1}
              </div>
            </div>

            {/* Layered Progress Bar */}
            <div 
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '24px'
              }}
            >
              <div 
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #C084FC)',
                  borderRadius: '4px',
                  boxShadow: '0 0 12px rgba(167, 139, 250, 0.4)',
                  transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="surface-elevated" style={{ padding: '12px 16px' }}>
                <span className="label-caps">MISSIONS</span>
                <div className="mono-num" style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', color: '#72D6A0' }}>
                  {user?.stats?.questsCompleted || 52}
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 16px' }}>
                <span className="label-caps">STREAK</span>
                <div className="mono-num" style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', color: '#F0C674' }}>
                  {user?.streak || 9} DAYS
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 16px' }}>
                <span className="label-caps">SKILL NODES</span>
                <div className="mono-num" style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', color: '#60A5FA' }}>
                  {user?.stats?.skillsUnlocked || 14}
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 16px' }}>
                <span className="label-caps">RELICS UNLOCKED</span>
                <div className="mono-num" style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', color: '#C084FC' }}>
                  {user?.stats?.achievementsUnlocked || 11}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric 2-Column Grid: Active Quests (Left 7/12) + Telemetry & Relics (Right 5/12) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* C. Active Quests Column */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>ACTIVE DIRECTIVES</h2>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                {activeQuests.length} READY
              </span>
            </div>
            <button 
              onClick={() => onNavigate('quests')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              VIEW ALL MISSIONS <ChevronRight size={13} />
            </button>
          </div>

          {activeQuests.length === 0 ? (
            <div 
              className="surface-panel"
              style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              <CheckCircle2 size={32} color="#72D6A0" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                All Directives Accomplished
              </div>
              <p style={{ fontSize: '13px', maxWidth: '320px', margin: '0 auto 16px' }}>
                You have fulfilled all immediate active quests. Dispatch a new mission to maintain character momentum.
              </p>
              <button className="btn-primary" onClick={onOpenNewQuest}>
                + Dispatch Mission
              </button>
            </div>
          ) : (
            <div className="quest-list">
              {activeQuests.map((quest) => (
                <QuestRow
                  key={quest._id}
                  quest={quest}
                  onComplete={onCompleteQuest}
                  onDelete={onDeleteQuest}
                  soundEnabled={user?.soundEnabled}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right Column: D. Progress Overview + E. Recent Collectibles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* D. Telemetry Activity Chart */}
          <section className="surface-panel" style={{ padding: '24px 28px' }}>
            <ActivityChart
              data={stats?.past7Days || []}
              streak={user?.streak || 9}
              weeklyXp={user?.stats?.weeklyXp || 3450}
            />
          </section>

          {/* E. Recent Collectible Relics */}
          <section className="surface-panel" style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <span className="label-caps">COLLECTIBLE RELICS</span>
                <h3 style={{ fontSize: '16px', marginTop: '2px' }}>ACQUIRED TROPHIES</h3>
              </div>
              <button 
                onClick={() => onNavigate('achievements')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-rare)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                GALLERY <ChevronRight size={12} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {recentAchievements.map((ach) => {
                const rarityColor = {
                  Common: 'var(--rarity-common)',
                  Uncommon: 'var(--rarity-uncommon)',
                  Rare: 'var(--rarity-rare)',
                  Epic: 'var(--rarity-epic)',
                  Legendary: 'var(--rarity-legendary)'
                }[ach.rarity] || 'var(--accent-primary)';

                return (
                  <div
                    key={ach.achievementId || ach._id}
                    onClick={() => onNavigate('achievements')}
                    style={{
                      padding: '14px 12px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'border-color var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Award size={15} color={rarityColor} />
                      <span className="label-caps" style={{ color: rarityColor, fontSize: '9px' }}>
                        {ach.rarity}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ach.title}
                    </div>
                    <div className="mono-num" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {ach.unlocked ? 'Unlocked' : `${ach.progress} / ${ach.maxProgress}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .dashboard-container section:nth-of-type(2) > div {
            grid-template-columns: 1fr !important;
          }
          .dashboard-container section:nth-of-type(2) > div > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 24px;
            padding-right: 0 !important;
          }
          .dashboard-container > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
