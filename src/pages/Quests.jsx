import React, { useState } from 'react';
import { 
  Sword, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search,
  AlertCircle
} from 'lucide-react';
import QuestRow from '../components/QuestRow.jsx';
import { playClickSound } from '../utils/audio.js';

export default function Quests({ 
  quests = [], 
  onCompleteQuest, 
  onDeleteQuest, 
  onOpenNewQuest,
  soundEnabled 
}) {
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'upcoming', 'recurring', 'completed', 'all'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'today', label: 'Today’s Directives' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'recurring', label: 'Protocols & Habits' },
    { id: 'completed', label: 'Completed Log' },
    { id: 'all', label: 'All Operations' }
  ];

  const categories = [
    'All',
    'Vitality & Health',
    'Mind & Knowledge',
    'Craft & Career',
    'Discipline & Focus'
  ];

  const difficulties = ['All', 'Novice', 'Adept', 'Master', 'Legendary'];

  // Filter logic
  const filteredQuests = quests.filter((quest) => {
    // Tab filter
    if (activeTab === 'today') {
      if (quest.completed) return false;
      // Include daily or priority or today
      const isDaily = quest.recurring === 'Daily';
      const isPriority = quest.isPriority;
      if (!isDaily && !isPriority && quest.dueDate) {
        const due = new Date(quest.dueDate);
        const today = new Date();
        if (due.toDateString() !== today.toDateString()) return false;
      }
    } else if (activeTab === 'upcoming') {
      if (quest.completed) return false;
      if (quest.dueDate) {
        const due = new Date(quest.dueDate);
        const today = new Date();
        if (due <= today) return false;
      }
    } else if (activeTab === 'recurring') {
      if (!quest.recurring || quest.recurring === 'None') return false;
    } else if (activeTab === 'completed') {
      if (!quest.completed) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && quest.category !== selectedCategory) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All' && quest.difficulty !== selectedDifficulty) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = quest.title.toLowerCase().includes(q);
      const matchDesc = quest.description && quest.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // Highlighted Featured/Priority Quest
  const priorityQuest = filteredQuests.find(q => q.isPriority && !q.completed);
  const regularQuests = priorityQuest 
    ? filteredQuests.filter(q => q._id !== priorityQuest._id) 
    : filteredQuests;

  return (
    <div className="quests-page" style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>
            // MISSION CONTROL
          </div>
          <h1 style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            YOUR MISSIONS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Small actions. Extraordinary progress.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenNewQuest();
          }}
        >
          <Plus size={15} />
          <span>Dispatch Mission</span>
        </button>
      </div>

      {/* Tabs */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveTab(tab.id);
              }}
              style={{
                background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px'
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Filter directives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="label-caps" style={{ fontSize: '10px' }}>DOMAIN:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="label-caps" style={{ fontSize: '10px' }}>DIFFICULTY:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="mono-num" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          SHOWING {filteredQuests.length} DIRECTIVES
        </div>
      </div>

      {/* Featured Priority Quest (if present) */}
      {priorityQuest && (
        <div style={{ marginBottom: '24px' }}>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>
            // APEX OBJECTIVE — HIGHEST PRIORITY
          </div>
          <div 
            style={{
              padding: '2px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(90deg, #A78BFA, #8B5CF6, transparent)'
            }}
          >
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <QuestRow
                quest={priorityQuest}
                onComplete={onCompleteQuest}
                onDelete={onDeleteQuest}
                soundEnabled={soundEnabled}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Quests List */}
      {filteredQuests.length === 0 ? (
        <div 
          className="surface-panel"
          style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}
        >
          <CheckCircle2 size={36} color="var(--border-subtle)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
            No Matching Directives Found
          </div>
          <p style={{ fontSize: '13px', maxWidth: '360px', margin: '0 auto 20px' }}>
            Either all missions for this parameter set are accomplished, or the filter criteria yielded no active tasks.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {regularQuests.map((quest) => (
            <QuestRow
              key={quest._id}
              quest={quest}
              onComplete={onCompleteQuest}
              onDelete={onDeleteQuest}
              soundEnabled={soundEnabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
