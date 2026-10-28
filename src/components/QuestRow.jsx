import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Star, 
  Clock, 
  Activity, 
  Brain, 
  Code, 
  Target,
  Sparkles
} from 'lucide-react';
import { playQuestCompleteSound, playClickSound } from '../utils/audio.js';

export default function QuestRow({ quest, onComplete, onDelete, soundEnabled }) {
  const [completing, setCompleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const categoryIcons = {
    'Vitality & Health': Activity,
    'Mind & Knowledge': Brain,
    'Craft & Career': Code,
    'Discipline & Focus': Target
  };

  const CategoryIcon = categoryIcons[quest.category] || Target;

  const difficultyClass = {
    Novice: 'badge-novice',
    Adept: 'badge-adept',
    Master: 'badge-master',
    Legendary: 'badge-legendary'
  }[quest.difficulty] || 'badge-adept';

  const handleCheck = async () => {
    if (quest.completed || completing) return;
    try {
      setCompleting(true);
      playClickSound(soundEnabled);
      const res = await onComplete(quest._id);
      playQuestCompleteSound(soundEnabled);
      setJustCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      className={`quest-item-row ${quest.completed ? 'quest-completed' : ''} ${justCompleted ? 'quest-animate-victory' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        backgroundColor: quest.isPriority && !quest.completed 
          ? 'rgba(167, 139, 250, 0.05)' 
          : 'var(--bg-surface)',
        border: '1px solid',
        borderColor: quest.isPriority && !quest.completed 
          ? 'rgba(167, 139, 250, 0.35)' 
          : 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '8px',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        opacity: quest.completed ? 0.6 : 1
      }}
    >
      {/* Priority Indicator Pill */}
      {quest.isPriority && !quest.completed && (
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '24px',
            backgroundColor: 'var(--accent-primary)',
            borderRadius: '0 2px 2px 0'
          }}
        />
      )}

      {/* Left: Checkbox + Icon + Title + Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0, marginRight: '16px' }}>
        {/* Custom RPG Checkbox */}
        <button
          onClick={handleCheck}
          disabled={quest.completed || completing}
          aria-label={quest.completed ? 'Completed' : 'Mark quest completed'}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: `1.5px solid ${quest.completed ? '#72D6A0' : 'var(--border-subtle)'}`,
            backgroundColor: quest.completed ? 'rgba(114, 214, 160, 0.15)' : 'transparent',
            color: '#72D6A0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: quest.completed ? 'default' : 'pointer',
            transition: 'all var(--transition-fast)',
            flexShrink: 0
          }}
        >
          {quest.completed && <Check size={14} strokeWidth={3} />}
          {completing && <span style={{ fontSize: '10px' }}>...</span>}
        </button>

        {/* Category Symbol */}
        <div 
          style={{
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            flexShrink: 0
          }}
          title={quest.category}
        >
          <CategoryIcon size={15} />
        </div>

        {/* Quest Title & Lore */}
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: quest.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: quest.completed ? 'line-through' : 'none',
                letterSpacing: '-0.01em'
              }}
            >
              {quest.title}
            </span>
            {quest.recurring && quest.recurring !== 'None' && (
              <span className="label-caps" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                [{quest.recurring}]
              </span>
            )}
          </div>
          {quest.description && (
            <div 
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '520px',
                marginTop: '2px'
              }}
            >
              {quest.description}
            </div>
          )}
        </div>
      </div>

      {/* Right: Difficulty + XP Reward + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {/* Difficulty Badge */}
        <span className={`badge ${difficultyClass}`}>
          {quest.difficulty}
        </span>

        {/* XP Reward Badge */}
        <div 
          className="mono-num"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 700,
            color: quest.completed ? 'var(--text-muted)' : 'var(--accent-primary)',
            padding: '4px 8px',
            background: 'rgba(167, 139, 250, 0.08)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Sparkles size={12} />
          <span>+{quest.xpReward} XP</span>
        </div>

        {/* Delete Action (revealed on hover) */}
        {onDelete && (
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onDelete(quest._id);
            }}
            title="Delete mission"
            className="quest-delete-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              transition: 'color var(--transition-fast)'
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <style>{`
        .quest-item-row:hover {
          border-color: rgba(167, 139, 250, 0.4) !important;
          background-color: var(--bg-surface-hover) !important;
        }
        .quest-item-row:hover .quest-delete-btn {
          color: #F87171 !important;
        }
        .quest-animate-victory {
          animation: victoryFlash 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes victoryFlash {
          0% { box-shadow: 0 0 0 rgba(114, 214, 160, 0); }
          50% { box-shadow: 0 0 24px rgba(114, 214, 160, 0.5); border-color: #72D6A0; }
          100% { box-shadow: 0 0 0 rgba(114, 214, 160, 0); }
        }
      `}</style>
    </div>
  );
}
