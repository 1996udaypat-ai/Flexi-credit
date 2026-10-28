import React, { useState } from 'react';
import { X, Sword, Target, Clock, AlertCircle } from 'lucide-react';
import { playClickSound } from '../utils/audio.js';

export default function NewQuestModal({ isOpen, onClose, onCreateQuest, soundEnabled }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Craft & Career');
  const [difficulty, setDifficulty] = useState('Adept');
  const [xpReward, setXpReward] = useState('200');
  const [attributeReward, setAttributeReward] = useState('focus');
  const [recurring, setRecurring] = useState('None');
  const [isPriority, setIsPriority] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const difficultyXp = {
    Novice: '100',
    Adept: '200',
    Master: '350',
    Legendary: '650'
  };

  const handleDifficultyChange = (e) => {
    const diff = e.target.value;
    setDifficulty(diff);
    setXpReward(difficultyXp[diff] || '200');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Mission title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      playClickSound(soundEnabled);
      await onCreateQuest({
        title,
        description,
        category,
        difficulty,
        xpReward: Number(xpReward),
        attributeReward,
        recurring,
        isPriority
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to dispatch mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="levelup-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Dispatch New Mission"
    >
      <div 
        className="surface-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '560px',
          padding: '32px',
          position: 'relative',
          animation: 'scaleUpIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>
              // PROTOCOL DISPATCH
            </div>
            <h2 style={{ fontSize: '20px' }}>DISPATCH NEW MISSION</h2>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div 
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#F87171',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
              Mission Directive *
            </label>
            <input 
              type="text" 
              placeholder="e.g. Master Class System Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
              Briefing / Objectives
            </label>
            <textarea 
              rows={2}
              placeholder="Define specific actionable conditions for mission victory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                resize: 'none'
              }}
            />
          </div>

          {/* Category & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="Craft & Career">Craft & Career</option>
                <option value="Mind & Knowledge">Mind & Knowledge</option>
                <option value="Vitality & Health">Vitality & Health</option>
                <option value="Discipline & Focus">Discipline & Focus</option>
              </select>
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="Novice">Novice (100 XP)</option>
                <option value="Adept">Adept (200 XP)</option>
                <option value="Master">Master (350 XP)</option>
                <option value="Legendary">Legendary (650 XP)</option>
              </select>
            </div>
          </div>

          {/* XP & Attribute Reward */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
                XP Reward
              </label>
              <input 
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '6px' }}>
                Attribute Boost
              </label>
              <select
                value={attributeReward}
                onChange={(e) => setAttributeReward(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="discipline">Discipline (+2)</option>
                <option value="intellect">Intellect (+2)</option>
                <option value="focus">Focus (+2)</option>
                <option value="vitality">Vitality (+2)</option>
                <option value="strength">Strength (+2)</option>
              </select>
            </div>
          </div>

          {/* Recurring & Priority Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="label-caps" style={{ margin: 0 }}>Recurrence:</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="None">One-Off</option>
                <option value="Daily">Daily Protocol</option>
                <option value="Weekly">Weekly Cycle</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <input 
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
              />
              <span>High Priority Objective</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <Sword size={14} />
              <span>{loading ? 'Transmitting...' : 'Dispatch Mission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
