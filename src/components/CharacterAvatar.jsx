import React from 'react';

export default function CharacterAvatar({ size = 'md', level = 14, rank = 'Rank IV — Obsidian', showAura = true }) {
  const sizeMap = {
    sm: { width: 44, height: 44, strokeWidth: 1.5 },
    md: { width: 120, height: 120, strokeWidth: 2 },
    lg: { width: 220, height: 220, strokeWidth: 2.5 },
    hero: { width: 320, height: 320, strokeWidth: 3 }
  };

  const dim = sizeMap[size] || sizeMap.md;
  const isLarge = size === 'lg' || size === 'hero';

  return (
    <div 
      className="character-avatar-wrapper"
      style={{
        position: 'relative',
        width: dim.width,
        height: dim.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Animated Aura Glow */}
      {showAura && (
        <div
          className="character-aura-ring"
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.22) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)',
            filter: 'blur(8px)',
            animation: 'pulseAura 4s ease-in-out infinite',
            zIndex: 0
          }}
        />
      )}

      {/* Hero Outer Geometric Frame */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E202B" />
            <stop offset="50%" stopColor="#13141B" />
            <stop offset="100%" stopColor="#0B0C10" />
          </linearGradient>

          <linearGradient id="obsidianTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id="visorGlow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>

          <radialGradient id="chestCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="40%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Outer Circular/Octagonal Ring */}
        <circle cx="100" cy="100" r="92" stroke="#292A35" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="86" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" />

        {/* Outer Octagon Base */}
        <polygon
          points="60,18 140,18 182,60 182,140 140,182 60,182 18,140 18,60"
          fill="url(#armorGradient)"
          stroke="#292A35"
          strokeWidth="2"
        />

        {/* Background Radial Shade */}
        <circle cx="100" cy="100" r="68" fill="#101116" />

        {/* Shoulders / Armor Gorget */}
        <path
          d="M38 165 L65 130 L135 130 L162 165 L130 180 L70 180 Z"
          fill="#171822"
          stroke="#2E3040"
          strokeWidth="2"
        />
        <path
          d="M65 130 L100 145 L135 130"
          stroke="url(#obsidianTrim)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Torso Central Sigil Core */}
        <polygon points="100,140 108,154 100,168 92,154" fill="url(#chestCore)" opacity="0.8" />

        {/* Cowl / Neck Collar */}
        <path
          d="M75 110 L100 128 L125 110 L115 132 L85 132 Z"
          fill="#1C1D27"
          stroke="#323445"
          strokeWidth="1.5"
        />

        {/* Character Helmet / Visor Silhouette */}
        <path
          d="M68 62 C68 40, 132 40, 132 62 L136 95 C136 115, 100 125, 100 125 C100 125, 64 115, 64 95 Z"
          fill="#151620"
          stroke="#2E3040"
          strokeWidth="2"
        />

        {/* Crown Crest Plate */}
        <polygon
          points="100,32 114,48 100,52 86,48"
          fill="#252736"
          stroke="url(#obsidianTrim)"
          strokeWidth="1.5"
        />

        {/* Temple Guard Plates */}
        <path d="M64 70 L76 75 L74 95 L62 90 Z" fill="#202230" stroke="#37394D" strokeWidth="1.2" />
        <path d="M136 70 L124 75 L126 95 L138 90 Z" fill="#202230" stroke="#37394D" strokeWidth="1.2" />

        {/* Sleek Luminous Visor Blade (RPG Signature Optics) */}
        <path
          d="M72 78 Q100 86 128 78 Q100 89 72 78 Z"
          fill="url(#visorGlow)"
          filter="drop-shadow(0 0 6px rgba(167, 139, 250, 0.9))"
        />

        {/* Auxiliary Target Optics Dot */}
        <circle cx="100" cy="83" r="2.5" fill="#FFFFFF" />

        {/* Obsidian Lower Facemask / Rebreather Ribs */}
        <line x1="90" y1="98" x2="110" y2="98" stroke="#3B3D52" strokeWidth="1.5" />
        <line x1="93" y1="104" x2="107" y2="104" stroke="#3B3D52" strokeWidth="1.5" />
        <line x1="96" y1="110" x2="104" y2="110" stroke="#A78BFA" strokeWidth="1.5" opacity="0.7" />

        {/* Orbiting Orbital Nodes for High Level */}
        {level >= 10 && (
          <>
            <circle cx="34" cy="54" r="3" fill="#A78BFA" opacity="0.7" />
            <circle cx="166" cy="146" r="3" fill="#A78BFA" opacity="0.7" />
          </>
        )}
        {level >= 20 && (
          <>
            <circle cx="166" cy="54" r="3" fill="#F0C674" opacity="0.8" />
            <circle cx="34" cy="146" r="3" fill="#F0C674" opacity="0.8" />
          </>
        )}
      </svg>
    </div>
  );
}
