import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Shield, 
  Sparkles,
  Info
} from 'lucide-react';
import CharacterAvatar from '../components/CharacterAvatar.jsx';
import { playClickSound } from '../utils/audio.js';

export default function Leaderboard({ leaderboardData, period = 'weekly', onChangePeriod, soundEnabled }) {
  const [activePeriod, setActivePeriod] = useState(period);

  useEffect(() => {
    setActivePeriod(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    playClickSound(soundEnabled);
    setActivePeriod(newPeriod);
    onChangePeriod(newPeriod);
  };

  const rankings = leaderboardData?.rankings || [];
  const topThree = rankings.slice(0, 3);
  const remainingRanks = rankings.slice(3);

  const podiumColors = {
    1: { color: 'var(--podium-gold)', border: 'rgba(240, 198, 116, 0.4)', bg: 'rgba(240, 198, 116, 0.08)', label: 'CHAMPION' },
    2: { color: 'var(--podium-silver)', border: 'rgba(226, 232, 240, 0.4)', bg: 'rgba(226, 232, 240, 0.08)', label: 'RUNNER UP' },
    3: { color: 'var(--podium-bronze)', border: 'rgba(205, 127, 50, 0.4)', bg: 'rgba(205, 127, 50, 0.08)', label: 'CONTENDER' }
  };

  return (
    <div className="leaderboard-page" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>
            // GLOBAL SYNCHRONIZATION
          </div>
          <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            THE ARENA LEADERBOARD
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {leaderboardData?.metricDescription || 'Total XP earned through completed missions and skill practice.'}
          </p>
        </div>

        {/* Period Selector Tabs */}
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
          {[
            { id: 'weekly', label: '7-Day Cycle' },
            { id: 'monthly', label: '30-Day Cycle' },
            { id: 'allTime', label: 'All-Time Legacy' }
          ].map((tab) => {
            const isActive = activePeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handlePeriodChange(tab.id)}
                style={{
                  background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  borderRadius: '4px',
                  padding: '7px 16px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Distinctive Styling Cards (Restrained Podium) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        {topThree.map((item, index) => {
          const rankNum = index + 1;
          const conf = podiumColors[rankNum];

          return (
            <div
              key={item.username}
              className="surface-panel"
              style={{
                backgroundColor: item.isCurrentUser ? 'rgba(167, 139, 250, 0.08)' : conf.bg,
                border: `1.5px solid ${item.isCurrentUser ? 'var(--accent-primary)' : conf.border}`,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Top Rank Badge */}
              <div 
                className="mono-num"
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: conf.color
                }}
              >
                #{rankNum} // {conf.label}
              </div>

              {item.isCurrentUser && (
                <div 
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '14px',
                    backgroundColor: 'rgba(167, 139, 250, 0.2)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-primary)'
                  }}
                >
                  YOU
                </div>
              )}

              {/* Character Avatar */}
              <div style={{ margin: '14px 0 12px' }}>
                <CharacterAvatar size="sm" level={item.level} showAura={rankNum === 1} />
              </div>

              {/* Username & Title */}
              <h3 style={{ fontSize: '17px', letterSpacing: '-0.01em', marginBottom: '2px' }}>
                {item.username}
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {item.title}
              </div>

              {/* XP Stat Badge */}
              <div 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span className="label-caps" style={{ fontSize: '10px' }}>LEVEL {item.level}</span>
                <span className="mono-num" style={{ fontSize: '14px', fontWeight: 700, color: conf.color }}>
                  +{item.currentPeriodXp?.toLocaleString() || 0} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Ranked List for Remaining Users */}
      <section className="surface-panel" style={{ padding: '8px 16px' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)'
          }}
          className="label-caps"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <span style={{ width: '40px' }}>RANK</span>
            <span>OPERATOR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <span>LEVEL</span>
            <span>PERIOD RESONANCE</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {remainingRanks.map((item, index) => {
            const actualRank = index + 4;
            const isUser = item.isCurrentUser;

            return (
              <div
                key={item.username}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  backgroundColor: isUser ? 'rgba(167, 139, 250, 0.06)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Rank & Movement & Username */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '48px' }}>
                    <span className="mono-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      #{actualRank}
                    </span>
                    {item.movement === 'up' && <ArrowUp size={12} color="#72D6A0" />}
                    {item.movement === 'down' && <ArrowDown size={12} color="#F87171" />}
                    {item.movement === 'same' && <Minus size={12} color="var(--text-muted)" />}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {item.username.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: isUser ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {item.username} {isUser && '(You)'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level & XP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                  <span className="mono-num" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    LVL {item.level}
                  </span>
                  <span className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', width: '90px', textAlign: 'right' }}>
                    +{item.currentPeriodXp?.toLocaleString() || 0} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        @media (max-width: 780px) {
          .leaderboard-page > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
