import React from 'react';
import { 
  LayoutDashboard, 
  Sword, 
  User as UserIcon, 
  GitFork, 
  Trophy, 
  BarChart2, 
  Volume2, 
  VolumeX, 
  Radio
} from 'lucide-react';
import CharacterAvatar from './CharacterAvatar.jsx';
import { playClickSound } from '../utils/audio.js';

export default function Navigation({ activeTab, onSelectTab, user, onToggleSound }) {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'quests', label: 'Missions', icon: Sword },
    { id: 'character', label: 'Hero Profile', icon: UserIcon },
    { id: 'skills', label: 'Skill Matrix', icon: GitFork },
    { id: 'achievements', label: 'Relics & Trophies', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart2 }
  ];

  const handleNavClick = (id) => {
    playClickSound(user?.soundEnabled);
    onSelectTab(id);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className="app-sidebar"
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          flexShrink: 0
        }}
      >
        <div>
          {/* Brand Header */}
          <div 
            style={{
              padding: '28px 24px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #171822, #0A0A0D)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(167, 139, 250, 0.2)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="#A78BFA" strokeWidth="8" />
                <path d="M50,25 L50,75 M30,38 L70,62 M30,62 L70,38" stroke="#A78BFA" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                Life<span style={{ color: 'var(--accent-primary)' }}>XP</span>
              </div>
              <div className="label-caps" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                OPERATING SYSTEM
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="label-caps" style={{ padding: '4px 12px 10px', fontSize: '10px' }}>
              NAVIGATION // CORE
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(167, 139, 250, 0.3)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    position: 'relative'
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '-6px',
                        width: '3px',
                        height: '18px',
                        backgroundColor: 'var(--accent-primary)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--accent-primary)'
                      }}
                    />
                  )}
                  <Icon size={17} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User & Audio Quick Controls */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Quick Sound Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={12} color="#72D6A0" style={{ animation: 'pulse 2s infinite' }} />
              <span className="label-caps" style={{ fontSize: '10px', color: '#72D6A0' }}>
                SYNC ONLINE
              </span>
            </div>
            <button
              onClick={onToggleSound}
              title={user?.soundEnabled ? 'Mute Procedural Audio' : 'Enable Procedural Audio'}
              style={{
                background: 'transparent',
                border: 'none',
                color: user?.soundEnabled ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {user?.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{user?.soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
            </button>
          </div>

          {/* User Mini Card */}
          {user && (
            <div 
              onClick={() => handleNavClick('character')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              <CharacterAvatar size="sm" level={user.level} showAura={false} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.name}
                </div>
                <div className="mono-num" style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>
                  LVL {user.level} // {user.xp} XP
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        className="mobile-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'rgba(16, 17, 22, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border-subtle)',
          zIndex: 80,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 8px'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '10px',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <Icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 860px) {
          .app-sidebar {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
