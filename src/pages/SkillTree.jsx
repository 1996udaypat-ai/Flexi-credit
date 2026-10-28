import React, { useState } from 'react';
import { 
  GitFork, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Brain, 
  Code, 
  Activity, 
  Zap, 
  Clock, 
  Shield, 
  BookOpen, 
  Cpu, 
  Compass, 
  Flame, 
  Heart, 
  Feather,
  ChevronRight,
  Info
} from 'lucide-react';
import { playClickSound, playLevelUpSound } from '../utils/audio.js';

export default function SkillTree({ skills = [], user, onUpgradeSkill, soundEnabled }) {
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.skillId || 'focus_ignition');
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'list'
  const [upgrading, setUpgrading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const iconMap = {
    Target,
    Shield,
    Clock,
    Zap,
    BookOpen,
    Cpu,
    Compass,
    Code,
    Flame,
    Sparkles,
    Heart,
    Activity,
    Feather
  };

  const branchColors = {
    Discipline: { primary: '#A78BFA', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.35)' },
    Intellect: { primary: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.35)' },
    Craft: { primary: '#5EEAD4', bg: 'rgba(94, 234, 212, 0.12)', border: 'rgba(94, 234, 212, 0.35)' },
    Vitality: { primary: '#F0C674', bg: 'rgba(240, 198, 116, 0.12)', border: 'rgba(240, 198, 116, 0.35)' }
  };

  const selectedSkill = skills.find(s => s.skillId === selectedSkillId) || skills[0];

  const handleUpgrade = async () => {
    if (!selectedSkill || upgrading) return;
    try {
      setUpgrading(true);
      setErrorMsg('');
      playClickSound(soundEnabled);
      await onUpgradeSkill(selectedSkill.skillId);
      playLevelUpSound(soundEnabled);
    } catch (err) {
      setErrorMsg(err.message || 'Prerequisites or resonance requirements not met.');
    } finally {
      setUpgrading(false);
    }
  };

  // Group skills by branch
  const branches = ['Discipline', 'Intellect', 'Craft', 'Vitality'];

  return (
    <div className="skill-tree-page" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>
            // NEURAL RESONANCE MAP
          </div>
          <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            SKILL MATRIX
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Progressive node hierarchy. Invest earned XP to unlock cognitive and somatic capabilities.
          </p>
        </div>

        {/* View Switcher */}
        <div 
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            gap: '4px'
          }}
        >
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setViewMode('graph');
            }}
            style={{
              background: viewMode === 'graph' ? 'var(--bg-surface-elevated)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              color: viewMode === 'graph' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: viewMode === 'graph' ? 600 : 400
            }}
          >
            Neural Graph
          </button>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setViewMode('list');
            }}
            style={{
              background: viewMode === 'list' ? 'var(--bg-surface-elevated)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 14px',
              color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: viewMode === 'list' ? 600 : 400
            }}
          >
            Branch Columns
          </button>
        </div>
      </div>

      {/* Main Layout: Canvas/Tree (Left) + Detail Panel (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
        {/* LEFT: Skill Canvas */}
        <div 
          className="surface-panel"
          style={{
            backgroundColor: '#0C0D11',
            minHeight: '620px',
            padding: '32px',
            position: 'relative',
            overflow: 'auto',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* Subtle Grid Lines Overlay */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none'
            }}
          />

          {viewMode === 'graph' ? (
            /* Interactive Visual Connected Node Canvas */
            <div style={{ position: 'relative', width: '100%', minWidth: '640px', height: '560px' }}>
              {/* SVG Connecting Curves */}
              <svg 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              >
                <defs>
                  <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {skills.map((skill) => {
                  if (!skill.prerequisites || skill.prerequisites.length === 0) return null;
                  return skill.prerequisites.map((prereqId) => {
                    const parent = skills.find(s => s.skillId === prereqId);
                    if (!parent) return null;

                    const x1 = parent.coordinates?.x || 100;
                    const y1 = parent.coordinates?.y || 80;
                    const x2 = skill.coordinates?.x || 100;
                    const y2 = skill.coordinates?.y || 220;

                    const isConnectedAndUnlocked = parent.unlocked && skill.unlocked;

                    return (
                      <g key={`${prereqId}->${skill.skillId}`}>
                        <path
                          d={`M ${x1 + 30} ${y1 + 40} C ${x1 + 30} ${(y1 + y2) / 2}, ${x2 + 30} ${(y1 + y2) / 2}, ${x2 + 30} ${y2}`}
                          stroke={isConnectedAndUnlocked ? 'url(#activeLineGrad)' : '#262734'}
                          strokeWidth={isConnectedAndUnlocked ? '2.5' : '1.5'}
                          strokeDasharray={isConnectedAndUnlocked ? 'none' : '4 4'}
                          fill="none"
                          style={{
                            filter: isConnectedAndUnlocked ? 'drop-shadow(0 0 4px rgba(167, 139, 250, 0.4))' : 'none'
                          }}
                        />
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Render Nodes */}
              {skills.map((skill) => {
                const Icon = iconMap[skill.icon] || Zap;
                const isSelected = selectedSkill?.skillId === skill.skillId;
                const colors = branchColors[skill.branch] || branchColors.Discipline;
                const isMax = skill.level >= skill.maxLevel;

                const posX = skill.coordinates?.x || 100;
                const posY = skill.coordinates?.y || 80;

                return (
                  <div
                    key={skill.skillId}
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setSelectedSkillId(skill.skillId);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${posX}px`,
                      top: `${posY}px`,
                      width: '60px',
                      height: '60px',
                      borderRadius: isMax ? '50%' : 'var(--radius-md)',
                      backgroundColor: skill.unlocked ? colors.bg : 'var(--bg-surface)',
                      border: '2px solid',
                      borderColor: isSelected
                        ? '#FFFFFF'
                        : (skill.unlocked ? colors.primary : 'var(--border-subtle)'),
                      boxShadow: isSelected
                        ? `0 0 20px ${colors.primary}`
                        : (skill.unlocked ? `0 0 12px ${colors.bg}` : 'none'),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      zIndex: isSelected ? 10 : 2
                    }}
                    title={`${skill.name} (${skill.branch})`}
                  >
                    {skill.unlocked ? (
                      <Icon size={22} color={colors.primary} />
                    ) : (
                      <Lock size={18} color="var(--text-muted)" />
                    )}

                    {/* Level Badge Pip */}
                    <div 
                      className="mono-num"
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        backgroundColor: skill.unlocked ? colors.primary : 'var(--bg-secondary)',
                        color: skill.unlocked ? '#0A0A0D' : 'var(--text-muted)',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {skill.level}/{skill.maxLevel}
                    </div>
                  </div>
                );
              })}

              {/* Branch Headers on Canvas */}
              {branches.map((bName, i) => (
                <div 
                  key={bName}
                  className="label-caps"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: `${i * 200 + 85}px`,
                    color: branchColors[bName]?.primary,
                    fontWeight: 700
                  }}
                >
                  {bName.toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            /* Branch Columns Alternative View (Mobile Friendly) */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {branches.map((branchName) => {
                const branchSkills = skills.filter(s => s.branch === branchName);
                const colors = branchColors[branchName];

                return (
                  <div key={branchName}>
                    <div className="label-caps" style={{ color: colors.primary, marginBottom: '12px' }}>
                      // {branchName}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {branchSkills.map((sk) => {
                        const Icon = iconMap[sk.icon] || Zap;
                        const isSelected = selectedSkill?.skillId === sk.skillId;
                        return (
                          <div
                            key={sk.skillId}
                            onClick={() => {
                              playClickSound(soundEnabled);
                              setSelectedSkillId(sk.skillId);
                            }}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                              border: '1px solid',
                              borderColor: isSelected ? colors.primary : 'var(--border-subtle)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Icon size={16} color={sk.unlocked ? colors.primary : 'var(--text-muted)'} />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: sk.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                  {sk.name}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                  Tier {sk.tier}
                                </div>
                              </div>
                            </div>
                            <span className="mono-num" style={{ fontSize: '11px', color: colors.primary }}>
                              {sk.level}/{sk.maxLevel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Refined Information Panel */}
        <div className="surface-panel" style={{ padding: '28px 24px', position: 'sticky', top: '90px' }}>
          {selectedSkill ? (
            <div>
              {/* Branch & Tier Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span 
                  className="badge"
                  style={{
                    backgroundColor: branchColors[selectedSkill.branch]?.bg,
                    color: branchColors[selectedSkill.branch]?.primary,
                    border: `1px solid ${branchColors[selectedSkill.branch]?.border}`
                  }}
                >
                  {selectedSkill.branch} // TIER {selectedSkill.tier}
                </span>

                <span className="mono-num" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ID: #{selectedSkill.skillId}
                </span>
              </div>

              <h2 style={{ fontSize: '22px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                {selectedSkill.name}
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedSkill.description}
              </p>

              {/* Progress & Level Bar */}
              <div className="surface-elevated" style={{ padding: '14px 16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <span className="label-caps">MASTERY LEVEL</span>
                  <span className="mono-num" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedSkill.level} / {selectedSkill.maxLevel}
                  </span>
                </div>
                <div 
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${(selectedSkill.level / selectedSkill.maxLevel) * 100}%`,
                      height: '100%',
                      backgroundColor: branchColors[selectedSkill.branch]?.primary,
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>

              {/* Passive Traits & Bonuses */}
              <div style={{ marginBottom: '20px' }}>
                <span className="label-caps" style={{ display: 'block', marginBottom: '8px' }}>
                  PASSIVE ENHANCEMENTS
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedSkill.bonuses && selectedSkill.bonuses.map((bonus, i) => (
                    <div 
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <Sparkles size={12} color="var(--accent-rare)" />
                      <span>{bonus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Milestone */}
              {selectedSkill.nextMilestone && (
                <div style={{ marginBottom: '20px' }}>
                  <span className="label-caps" style={{ display: 'block', marginBottom: '4px' }}>
                    NEXT THRESHOLD
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {selectedSkill.nextMilestone}
                  </p>
                </div>
              )}

              {/* Prerequisites Indicator */}
              {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <span className="label-caps" style={{ display: 'block', marginBottom: '4px' }}>
                    PREREQUISITES REQUIRED
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedSkill.prerequisites.map(p => (
                      <span key={p} className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div 
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F87171',
                    fontSize: '12px',
                    marginBottom: '16px'
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Upgrade Button */}
              <button
                className="btn-primary"
                onClick={handleUpgrade}
                disabled={upgrading || selectedSkill.level >= selectedSkill.maxLevel}
                style={{ width: '100%', padding: '12px 18px', gap: '8px' }}
              >
                {selectedSkill.level >= selectedSkill.maxLevel ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Apex Mastery Attained</span>
                  </>
                ) : (
                  <>
                    <Zap size={15} />
                    <span>
                      {upgrading 
                        ? 'Attuning...' 
                        : `Advance Mastery (${selectedSkill.requiredXp || 250} XP)`}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              Select a node to inspect attributes.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .skill-tree-page > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
