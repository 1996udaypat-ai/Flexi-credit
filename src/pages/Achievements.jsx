import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Flame, 
  ShieldCheck, 
  ShieldAlert, 
  Sun, 
  Layers, 
  Brain, 
  Sparkle, 
  Lock, 
  X, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { playClickSound, playQuestCompleteSound } from '../utils/audio.js';

export default function Achievements({ achievements = [], user, onClaimReward, soundEnabled }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [filterRarity, setFilterRarity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'unlocked', 'locked'

  const iconMap = {
    Sun,
    Flame,
    Layers,
    Brain,
    ShieldAlert,
    ShieldCheck,
    Crown,
    Sparkle,
    Award
  };

  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

  const filteredAchievements = achievements.filter((ach) => {
    if (filterRarity !== 'All' && ach.rarity !== filterRarity) return false;
    if (filterStatus === 'unlocked' && !ach.unlocked) return false;
    if (filterStatus === 'locked' && ach.unlocked) return false;
    return true;
  });

  const rarityStyles = {
    Common: {
      color: 'var(--rarity-common)',
      border: 'rgba(148, 163, 184, 0.3)',
      bg: 'rgba(148, 163, 184, 0.06)',
      glow: 'none'
    },
    Uncommon: {
      color: 'var(--rarity-uncommon)',
      border: 'rgba(94, 234, 212, 0.35)',
      bg: 'rgba(94, 234, 212, 0.08)',
      glow: '0 0 16px rgba(94, 234, 212, 0.15)'
    },
    Rare: {
      color: 'var(--rarity-rare)',
      border: 'rgba(96, 165, 250, 0.4)',
      bg: 'rgba(96, 165, 250, 0.1)',
      glow: '0 0 20px rgba(96, 165, 250, 0.2)'
    },
    Epic: {
      color: 'var(--rarity-epic)',
      border: 'rgba(192, 132, 252, 0.45)',
      bg: 'rgba(192, 132, 252, 0.12)',
      glow: '0 0 24px rgba(192, 132, 252, 0.25)'
    },
    Legendary: {
      color: 'var(--rarity-legendary)',
      border: 'rgba(240, 198, 116, 0.6)',
      bg: 'rgba(240, 198, 116, 0.14)',
      glow: '0 0 32px rgba(240, 198, 116, 0.35)'
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-gallery-page" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="label-caps" style={{ color: 'var(--accent-rare)', marginBottom: '4px' }}>
            // RELIQUARY & ARCHIVES
          </div>
          <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            COLLECTIBLE RELICS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Permanent proof of triumph, consistency, and discipline forged across your journey.
          </p>
        </div>

        {/* Gallery Completion Summary */}
        <div 
          className="surface-panel"
          style={{
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div>
            <span className="label-caps" style={{ fontSize: '9px' }}>ARCHIVE COMPLETION</span>
            <div className="mono-num" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-rare)' }}>
              {unlockedCount} / {achievements.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({Math.round((unlockedCount / (achievements.length || 1)) * 100)}%)</span>
            </div>
          </div>
          <Award size={24} color="var(--accent-rare)" />
        </div>
      </div>

      {/* Rarity & Status Filter Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {rarities.map((r) => {
            const isSelected = filterRarity === r;
            const rStyle = rarityStyles[r] || { color: 'var(--text-primary)' };

            return (
              <button
                key={r}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setFilterRarity(r);
                }}
                style={{
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: '1px solid',
                  borderColor: isSelected ? (r === 'All' ? 'var(--accent-primary)' : rStyle.color) : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 14px',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {r.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'unlocked', 'locked'].map((st) => (
            <button
              key={st}
              onClick={() => {
                playClickSound(soundEnabled);
                setFilterStatus(st);
              }}
              style={{
                background: filterStatus === st ? 'var(--bg-surface-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: filterStatus === st ? 'var(--border-accent)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                color: filterStatus === st ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {st === 'All' ? 'All States' : (st === 'unlocked' ? 'Unlocked Only' : 'Locked Only')}
            </button>
          ))}
        </div>
      </div>

      {/* Collectible Objects Gallery Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredAchievements.map((ach) => {
          const Icon = iconMap[ach.icon] || Award;
          const style = rarityStyles[ach.rarity] || rarityStyles.Common;
          const isUnlocked = ach.unlocked;

          return (
            <div
              key={ach.achievementId || ach._id}
              onClick={() => {
                playClickSound(soundEnabled);
                setSelectedAchievement(ach);
              }}
              className="achievement-card"
              style={{
                backgroundColor: isUnlocked ? style.bg : 'var(--bg-surface)',
                border: `1.5px solid ${isUnlocked ? style.border : 'var(--border-subtle)'}`,
                boxShadow: isUnlocked ? style.glow : 'none',
                borderRadius: ach.rarity === 'Legendary' ? 'var(--radius-xl)' : 'var(--radius-md)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                opacity: isUnlocked ? 1 : 0.65
              }}
            >
              {/* Legendary Ambient Halo Ring */}
              {ach.rarity === 'Legendary' && isUnlocked && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(240, 198, 116, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              <div>
                {/* Badge Top Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div 
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: ach.rarity === 'Legendary' ? '50%' : 'var(--radius-sm)',
                      backgroundColor: isUnlocked ? 'rgba(0,0,0,0.4)' : 'var(--bg-secondary)',
                      border: `1px solid ${isUnlocked ? style.color : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isUnlocked ? `0 0 12px ${style.border}` : 'none'
                    }}
                  >
                    {isUnlocked ? (
                      <Icon size={22} color={style.color} />
                    ) : (
                      <Lock size={18} color="var(--text-muted)" />
                    )}
                  </div>

                  <span 
                    className="label-caps"
                    style={{
                      color: isUnlocked ? style.color : 'var(--text-muted)',
                      fontSize: '10px'
                    }}
                  >
                    {ach.rarity.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '6px', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {ach.title}
                </h3>

                {/* Lore / Description */}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {ach.description}
                </p>
              </div>

              {/* Progress & Reward Footer */}
              <div>
                {/* Progress Bar if locked or in progress */}
                {!isUnlocked && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }} className="mono-num">
                      <span>PROGRESS</span>
                      <span>{ach.progress} / {ach.maxProgress}</span>
                    </div>
                    <div 
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        style={{
                          width: `${Math.min(100, (ach.progress / (ach.maxProgress || 1)) * 100)}%`,
                          height: '100%',
                          backgroundColor: style.color
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="mono-num" style={{ fontSize: '11px', color: style.color, fontWeight: 600 }}>
                    +{ach.rewardXp} XP
                  </span>

                  <span className="label-caps" style={{ fontSize: '9px', color: isUnlocked ? '#72D6A0' : 'var(--text-muted)' }}>
                    {isUnlocked ? 'CLAIMED' : 'IN PROGRESS'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Relic Inspection Modal */}
      {selectedAchievement && (
        <div 
          className="levelup-overlay" 
          onClick={() => setSelectedAchievement(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="surface-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '92%',
              maxWidth: '480px',
              padding: '36px',
              textAlign: 'center',
              position: 'relative',
              animation: 'scaleUpIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              borderColor: rarityStyles[selectedAchievement.rarity]?.color || 'var(--accent-primary)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), ${rarityStyles[selectedAchievement.rarity]?.glow || 'none'}`
            }}
          >
            <button
              onClick={() => setSelectedAchievement(null)}
              className="btn-icon"
              style={{ position: 'absolute', top: '16px', right: '16px' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="label-caps" style={{ color: rarityStyles[selectedAchievement.rarity]?.color, marginBottom: '6px' }}>
              // {selectedAchievement.rarity.toUpperCase()} RELIC
            </div>

            <h2 style={{ fontSize: '24px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {selectedAchievement.title}
            </h2>

            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              {selectedAchievement.description}
            </div>

            {/* Lore Inscription */}
            {selectedAchievement.lore && (
              <div 
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontStyle: 'italic',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                  lineHeight: 1.6
                }}
              >
                "{selectedAchievement.lore}"
              </div>
            )}

            {/* Metadata Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '24px' }}>
              <div className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}>
                CATEGORY: {selectedAchievement.category}
              </div>
              <div className="badge" style={{ background: 'rgba(167, 139, 250, 0.12)', color: 'var(--accent-primary)' }}>
                +{selectedAchievement.rewardXp} XP REWARD
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => setSelectedAchievement(null)}
              style={{ minWidth: '160px' }}
            >
              Close Reliquary
            </button>
          </div>
        </div>
      )}

      <style>{`
        .achievement-card:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
