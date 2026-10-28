import React from 'react';
import { Flame, Plus, Volume2, VolumeX, Terminal, Shield } from 'lucide-react';
import { playClickSound } from '../utils/audio.js';

export default function TopBar({ user, onOpenNewQuest, onToggleSound }) {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  const xpPercent = user ? Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100)) : 0;

  return (
    <header className="system-topbar">
      {/* Left: Terminal Date & System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} color="var(--accent-primary)" />
          <span className="mono-num" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            CYCLE // {dateFormatted}
          </span>
        </div>
        <div 
          style={{
            height: '14px',
            width: '1px',
            backgroundColor: 'var(--border-subtle)'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={13} color="var(--accent-rare)" />
          <span className="label-caps" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
            {user?.rank || 'Rank IV — Obsidian'}
          </span>
        </div>
      </div>

      {/* Right: Streak, XP Progress, Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Streak Indicator */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Current unbroken daily discipline streak"
        >
          <Flame size={15} color="#F0C674" />
          <span className="mono-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.streak || 0}
          </span>
          <span className="label-caps" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
            DAYS
          </span>
        </div>

        {/* Compact XP Progress Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 14px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span className="label-caps" style={{ fontSize: '9px' }}>LVL {user?.level || 1}</span>
              <span className="mono-num" style={{ fontSize: '10px', color: 'var(--accent-primary)' }}>
                {user?.xp || 0} / {user?.xpToNextLevel || 1000} XP
              </span>
            </div>
            <div 
              style={{
                width: '120px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '2px',
                  transition: 'width 400ms ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="btn-icon"
          title={user?.soundEnabled ? 'Mute Audio SFX' : 'Enable Audio SFX'}
          aria-label="Toggle Sound Effects"
        >
          {user?.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Add Mission CTA */}
        <button 
          className="btn-primary"
          onClick={() => {
            playClickSound(user?.soundEnabled);
            onOpenNewQuest();
          }}
        >
          <Plus size={15} />
          <span>New Mission</span>
        </button>
      </div>
    </header>
  );
}
