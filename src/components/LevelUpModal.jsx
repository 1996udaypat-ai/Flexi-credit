import React, { useEffect } from 'react';
import { Sparkles, Shield, ChevronRight, X } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar.jsx';
import { playLevelUpSound } from '../utils/audio.js';

export default function LevelUpModal({ data, soundEnabled, onClose }) {
  useEffect(() => {
    playLevelUpSound(soundEnabled);
  }, [soundEnabled]);

  if (!data) return null;

  const { newLevel, oldLevel } = data;

  return (
    <div className="levelup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Level Up Achieved">
      <div 
        className="levelup-card surface-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '520px',
          padding: '40px 36px',
          textAlign: 'center',
          border: '1px solid var(--accent-primary)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(167, 139, 250, 0.25)',
          animation: 'scaleUpIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          position: 'relative'
        }}
      >
        {/* Dismiss Icon */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          <X size={18} />
        </button>

        {/* Ambient Radial Spotlight */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', letterSpacing: '0.15em', marginBottom: '8px' }}>
            // ASCENSION CONFIRMED
          </div>

          <h2 style={{ fontSize: '28px', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            LEVEL UP ACHIEVED
          </h2>

          {/* Avatar with Ascension Aura */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 24px' }}>
            <CharacterAvatar size="md" level={newLevel} />
          </div>

          {/* Level Transition Pill */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              padding: '8px 20px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}
          >
            <span className="mono-num" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              LVL {oldLevel || newLevel - 1}
            </span>
            <ChevronRight size={18} color="var(--accent-primary)" />
            <span className="mono-num" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)' }}>
              LVL {newLevel}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Your discipline has expanded the boundaries of your neural resonance. Attributes enhanced, skill slots deepened.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              className="btn-primary" 
              onClick={onClose}
              style={{ minWidth: '160px', padding: '11px 24px' }}
            >
              Continue Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
