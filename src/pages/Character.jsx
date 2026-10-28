import React, { useState } from 'react';
import { 
  Shield, 
  Flame, 
  Award, 
  Sparkles, 
  Edit3, 
  Check, 
  Target, 
  Activity, 
  Brain, 
  Code,
  Layers,
  Zap,
  TrendingUp,
  History
} from 'lucide-react';
import CharacterAvatar from '../components/CharacterAvatar.jsx';
import { playClickSound } from '../utils/audio.js';

export default function Character({ user, achievements = [], skills = [], onUpdateUser }) {
  const [editingStatus, setEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(user?.statusMessage || '');
  const [saving, setSaving] = useState(false);

  const attributes = user?.attributes || {
    strength: 32,
    intellect: 48,
    focus: 40,
    vitality: 34,
    discipline: 45
  };

  const attributeConfig = [
    { key: 'discipline', label: 'Iron Discipline', icon: Target, val: attributes.discipline, desc: 'Execution consistency & distraction resistance' },
    { key: 'intellect', label: 'Deep Intellect', icon: Brain, val: attributes.intellect, desc: 'Abstract modeling & rapid knowledge synthesis' },
    { key: 'focus', label: 'Hyper Focus', icon: Zap, val: attributes.focus, desc: 'Duration & depth of single-threaded concentration' },
    { key: 'vitality', label: 'Cellular Vitality', icon: Activity, val: attributes.vitality, desc: 'Metabolic endurance & physiological recovery' },
    { key: 'strength', label: 'Kinetic Strength', icon: Shield, val: attributes.strength, desc: 'Resistance threshold & physical power output' }
  ];

  const unlockedSkills = skills.filter(s => s.unlocked);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const xpPercent = user ? Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100)) : 0;

  const handleSaveStatus = async () => {
    try {
      setSaving(true);
      playClickSound(user?.soundEnabled);
      await onUpdateUser({ statusMessage: statusInput });
      setEditingStatus(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="character-hero-page" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>
          // OPERATOR MATRIX
        </div>
        <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em' }}>
          THE HERO SCREEN
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Real-time neuro-somatic attributes, progression history, and rank lineage.
        </p>
      </div>

      {/* Main Two-Column RPG Progression Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '32px', alignItems: 'start', marginBottom: '36px' }}>
        {/* LEFT COLUMN: Large Character Portrait & Persona */}
        <section 
          className="surface-panel"
          style={{
            padding: '40px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(23, 24, 32, 0.95) 0%, rgba(13, 14, 18, 0.98) 100%)',
            position: 'relative'
          }}
        >
          {/* Subtle Atmospheric Spotlight */}
          <div 
            style={{
              position: 'absolute',
              top: '20px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Large RPG Character Portrait */}
          <div style={{ margin: '10px 0 24px', position: 'relative' }}>
            <CharacterAvatar size="hero" level={user?.level} rank={user?.rank} />
          </div>

          {/* Rank Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              backgroundColor: 'rgba(240, 198, 116, 0.1)',
              border: '1px solid rgba(240, 198, 116, 0.3)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '10px'
            }}
          >
            <Shield size={13} color="var(--accent-rare)" />
            <span className="label-caps" style={{ color: 'var(--accent-rare)', fontSize: '11px', margin: 0 }}>
              {user?.rank || 'Rank IV — Obsidian'}
            </span>
          </div>

          {/* Name & Title */}
          <h2 style={{ fontSize: '26px', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {user?.name || 'Vanguard Aria'}
          </h2>
          <div className="mono-num" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            TITLE // {user?.title || 'Shadow Voyager'}
          </div>

          {/* Status Message / Motto */}
          <div 
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="label-caps" style={{ fontSize: '9px' }}>DIRECTIVE PHILOSOPHY</span>
              <button 
                onClick={() => setEditingStatus(!editingStatus)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '2px' }}
                title="Edit status"
              >
                <Edit3 size={13} />
              </button>
            </div>

            {editingStatus ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="text"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button 
                  className="btn-primary" 
                  onClick={handleSaveStatus} 
                  disabled={saving}
                  style={{ alignSelf: 'flex-end', padding: '4px 12px', fontSize: '11px' }}
                >
                  <Check size={12} /> Save
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                "{user?.statusMessage || 'Attuning mind, refining craft, forging steel habits.'}"
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: XP Progression & Character Attribute Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* XP Progress Card */}
          <section className="surface-panel" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span className="label-caps">LEVEL PROGRESSION</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span className="mono-num" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    LEVEL {user?.level || 14}
                  </span>
                  <span className="label-caps" style={{ color: 'var(--accent-primary)' }}>
                    // {user?.rank}
                  </span>
                </div>
              </div>
              <div className="mono-num" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {user?.xp?.toLocaleString()} / {user?.xpToNextLevel?.toLocaleString()} XP ({xpPercent}%)
              </div>
            </div>

            <div 
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '5px',
                overflow: 'hidden',
                margin: '16px 0 24px'
              }}
            >
              <div 
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #F0C674)',
                  boxShadow: '0 0 16px rgba(167, 139, 250, 0.5)',
                  transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="surface-elevated" style={{ padding: '12px 14px' }}>
                <span className="label-caps">TOTAL XP</span>
                <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {user?.stats?.totalXpEarned?.toLocaleString() || '34,850'}
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 14px' }}>
                <span className="label-caps">CURRENT STREAK</span>
                <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-rare)', marginTop: '2px' }}>
                  {user?.streak || 9} DAYS
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 14px' }}>
                <span className="label-caps">MISSIONS CLEARED</span>
                <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-success)', marginTop: '2px' }}>
                  {user?.stats?.questsCompleted || 52}
                </div>
              </div>
              <div className="surface-elevated" style={{ padding: '12px 14px' }}>
                <span className="label-caps">RELICS EARNED</span>
                <div className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--rarity-epic)', marginTop: '2px' }}>
                  {unlockedAchievements.length} OF {achievements.length}
                </div>
              </div>
            </div>
          </section>

          {/* Character Attribute Scores (RPG Stat Bars) */}
          <section className="surface-panel" style={{ padding: '28px 32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span className="label-caps">CORE ATTRIBUTE MATRIX</span>
              <h3 style={{ fontSize: '18px', marginTop: '2px' }}>ATTUNED FACULTIES</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {attributeConfig.map((attr) => {
                const Icon = attr.icon;
                const maxVal = 60;
                const pct = Math.min(100, Math.round((attr.val / maxVal) * 100));

                return (
                  <div key={attr.key}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={15} color="var(--accent-primary)" />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {attr.label}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          — {attr.desc}
                        </span>
                      </div>
                      <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {attr.val} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {maxVal}</span>
                      </div>
                    </div>

                    <div 
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: 'var(--accent-primary)',
                          borderRadius: '3px',
                          transition: 'width 500ms ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* BELOW: Progression Lineage & Skill Mastery Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Unlocked Skill Summaries */}
        <section className="surface-panel" style={{ padding: '26px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span className="label-caps">ACTIVE TALENTS</span>
              <h3 style={{ fontSize: '16px', marginTop: '2px' }}>UNLOCKED SKILLS ({unlockedSkills.length})</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {unlockedSkills.slice(0, 5).map((sk) => (
              <div
                key={sk.skillId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sk.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {sk.branch} // {sk.description.slice(0, 60)}...
                  </div>
                </div>
                <div className="badge badge-master">
                  TIER {sk.level} / {sk.maxLevel}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progression History Timeline */}
        <section className="surface-panel" style={{ padding: '26px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span className="label-caps">OPERATOR CHRONICLES</span>
              <h3 style={{ fontSize: '16px', marginTop: '2px' }}>RECENT MILESTONES</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
            <div 
              style={{
                position: 'absolute',
                left: '11px',
                top: '12px',
                bottom: '12px',
                width: '1px',
                backgroundColor: 'var(--border-subtle)'
              }}
            />

            {[
              { title: 'Attained Level 14: Obsidian Convergence', date: '2 days ago', tag: 'LEVEL UP', color: 'var(--accent-primary)' },
              { title: 'Mastered Focus Ignition Tier 5', date: '4 days ago', tag: 'SKILL', color: '#60A5FA' },
              { title: 'Claimed Relic: Obsidian Awakening', date: '5 days ago', tag: 'RELIC', color: 'var(--rarity-epic)' },
              { title: '7-Day Unbroken Streak Milestone Cleared', date: '1 week ago', tag: 'STREAK', color: 'var(--accent-rare)' }
            ].map((milestone, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative' }}>
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    border: `1.5px solid ${milestone.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: milestone.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {milestone.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span className="label-caps" style={{ color: milestone.color, fontSize: '9px' }}>
                      {milestone.tag}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      • {milestone.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .character-hero-page > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }
          .character-hero-page > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
