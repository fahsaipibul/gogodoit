import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = 'dashboard' | 'empty' | 'detail' | 'create' | 'goals' | 'celebration' | 'progress' | 'profile'
type NavTab = 'home' | 'progress' | 'goals' | 'profile'
type MascotMood = 'neutral' | 'encouraging' | 'celebrating'
type IconType = 'email' | 'phone' | 'briefcase' | 'book'

interface Tracker {
  id: string
  name: string
  iconType: IconType
  current: number
  total: number
  dailyGoal: number
  todayDone: number
  unit: string
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const NAVY = '#1A2B4A'
const BLUE = '#4479C4'
const CORAL = '#FF6952'
const CREAM = '#FAF7F0'
const MUTED = '#6B7A96'
const SUBTLE = '#9BA8BC'
const CARD_BG = '#FFFFFF'
const SURFACE = '#F0ECE4'
const BORDER = '#E8E4DC'

const CONFETTI = [
  { left: '6%',  top: '8%',  color: BLUE,    size: 10, delay: '0s',    duration: '1.2s' },
  { left: '18%', top: '5%',  color: CORAL,   size: 8,  delay: '0.15s', duration: '1.4s' },
  { left: '32%', top: '3%',  color: '#FFD700', size: 6, delay: '0.05s', duration: '1.1s' },
  { left: '48%', top: '7%',  color: '#52C47A', size: 9, delay: '0.2s',  duration: '1.3s' },
  { left: '62%', top: '4%',  color: BLUE,    size: 7,  delay: '0.1s',  duration: '1.5s' },
  { left: '75%', top: '6%',  color: CORAL,   size: 11, delay: '0.25s', duration: '1.2s' },
  { left: '88%', top: '9%',  color: '#9B59B6', size: 8, delay: '0s',   duration: '1.4s' },
  { left: '12%', top: '18%', color: '#FFD700', size: 7, delay: '0.3s', duration: '1.1s' },
  { left: '55%', top: '15%', color: BLUE,    size: 6,  delay: '0.18s', duration: '1.3s' },
  { left: '80%', top: '20%', color: CORAL,   size: 9,  delay: '0.08s', duration: '1.5s' },
  { left: '25%', top: '22%', color: '#52C47A', size: 5, delay: '0.35s', duration: '1.0s' },
  { left: '70%', top: '14%', color: '#FFD700', size: 8, delay: '0.22s', duration: '1.2s' },
]

const DEFAULT_TRACKERS: Tracker[] = [
  { id: '1', name: 'Networking Emails', iconType: 'email',    current: 40,  total: 100, dailyGoal: 10, todayDone: 0, unit: 'emails' },
  { id: '2', name: 'Networking Calls',  iconType: 'phone',    current: 3,   total: 10,  dailyGoal: 1,  todayDone: 0, unit: 'calls'  },
  { id: '3', name: 'Applications',      iconType: 'briefcase',current: 12,  total: 25,  dailyGoal: 2,  todayDone: 0, unit: 'apps'   },
  { id: '4', name: '400 Questions IB Guide', iconType: 'book', current: 125, total: 400, dailyGoal: 10, todayDone: 0, unit: 'pages' },
]

// ─── WACCY Mascot SVG ─────────────────────────────────────────────────────────

function WaccyMascot({ mood = 'neutral', size = 120 }: { mood?: MascotMood; size?: number }) {
  const h = Math.round(size * 1.2)
  return (
    <svg width={size} height={h} viewBox="0 0 120 144" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── Ears ── */}
      <ellipse cx="33" cy="30" rx="11.5" ry="26" fill="#C8906A" transform="rotate(-14 33 30)" />
      <ellipse cx="33" cy="30" rx="6.5"  ry="18" fill="#F4B09A" transform="rotate(-14 33 30)" />
      <ellipse cx="87" cy="30" rx="11.5" ry="26" fill="#C8906A" transform="rotate(14 87 30)" />
      <ellipse cx="87" cy="30" rx="6.5"  ry="18" fill="#F4B09A" transform="rotate(14 87 30)" />

      {/* ── Body ── */}
      <ellipse cx="60" cy="120" rx="28" ry="26" fill="#C8906A" />
      <ellipse cx="60" cy="124" rx="17" ry="19" fill="#DBA882" />

      {/* ── Head ── */}
      <ellipse cx="60" cy="64" rx="35" ry="32" fill="#D49870" />

      {/* ── Muzzle ── */}
      <ellipse cx="60" cy="76" rx="17" ry="11.5" fill="#DBA882" />

      {/* ── Cheeks ── */}
      <ellipse cx="39" cy="72" rx="10" ry="6.5" fill="#F49898" opacity="0.32" />
      <ellipse cx="81" cy="72" rx="10" ry="6.5" fill="#F49898" opacity="0.32" />

      {/* ── Eye whites ── */}
      <circle cx="46" cy="60" r="9.5" fill="white" />
      <circle cx="74" cy="60" r="9.5" fill="white" />

      {/* ── Irises ── */}
      <circle cx="48" cy="60" r="6"   fill={NAVY} />
      <circle cx="76" cy="60" r="6"   fill={NAVY} />

      {/* ── Eye shine ── */}
      <circle cx="50.5" cy="57.5" r="2.2" fill="white" />
      <circle cx="78.5" cy="57.5" r="2.2" fill="white" />

      {/* ── Eyebrows by mood ── */}
      {mood !== 'neutral' && (
        <>
          <path d="M 40 50 Q 47 45 54 49" stroke="#8B5A3A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 66 49 Q 73 45 80 50" stroke="#8B5A3A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* ── Nose ── */}
      <ellipse cx="60" cy="72" rx="5.5" ry="4" fill="#C07060" />

      {/* ── Mouth by mood ── */}
      {mood === 'celebrating' ? (
        <>
          <path d="M 50 79 Q 60 91 70 79" fill="#FF9B8A" stroke="#8B5A3A" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="54" y="79" width="12" height="6" rx="2" fill="white" />
        </>
      ) : (
        <path
          d={mood === 'encouraging' ? 'M 50 79 Q 60 88 70 79' : 'M 51 80 Q 60 87 69 80'}
          stroke="#8B5A3A" strokeWidth="2.2" fill="none" strokeLinecap="round"
        />
      )}

      {/* ── Collar + tie ── */}
      <path d="M 52 100 L 68 100 L 68 106 L 52 106 Z" fill="#E8EDF8" />
      <path d="M 57 100 L 60 95 L 63 100 L 60 113 Z" fill={BLUE} />
      <rect x="56" y="93" width="8" height="7" rx="1.5" fill="#2D5FA8" />

      {/* ── Arms by mood ── */}
      {mood === 'celebrating' ? (
        <>
          <path d="M 34 112 Q 16 90 12 72" stroke="#C8906A" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="11" cy="70" r="7.5" fill="#C8906A" />
          <path d="M 86 112 Q 104 90 108 72" stroke="#C8906A" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="109" cy="70" r="7.5" fill="#C8906A" />
        </>
      ) : (
        <>
          <path d="M 34 110 Q 25 124 28 134" stroke="#C8906A" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="27" cy="136" r="6.5" fill="#C8906A" />
          <path d="M 86 110 Q 95 124 92 134" stroke="#C8906A" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="93" cy="136" r="6.5" fill="#C8906A" />
        </>
      )}

      {/* ── Celebration sparkles ── */}
      {mood === 'celebrating' && (
        <>
          <path d="M 16 44 L 18 37 L 20 44 L 13 39.5 L 23 39.5 Z" fill="#FFD700" />
          <path d="M 100 38 L 102 31 L 104 38 L 97 33.5 L 107 33.5 Z" fill="#FFD700" />
          <circle cx="14" cy="70" r="3.5" fill={CORAL} />
          <circle cx="106" cy="66" r="3" fill={BLUE} />
          <circle cx="20" cy="88" r="2.5" fill="#52C47A" />
          <circle cx="100" cy="84" r="2.5" fill="#FFD700" />
        </>
      )}
    </svg>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total, dailyGoal }: { current: number; total: number; dailyGoal: number }) {
  const donePct  = Math.min((current / total) * 100, 100)
  const coralPct = Math.min(Math.max((dailyGoal / total) * 100, 0), 100 - donePct)
  const grayPct  = Math.max(100 - donePct - coralPct, 0)

  return (
    <div className="flex rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: BORDER }}>
      {donePct > 0 && (
        <div style={{ width: `${donePct}%`, backgroundColor: BLUE, borderRadius: coralPct === 0 && grayPct === 0 ? '9999px' : '9999px 0 0 9999px', transition: 'width 0.5s ease' }} />
      )}
      {coralPct > 0 && (
        <div style={{ width: `${coralPct}%`, backgroundColor: CORAL, borderRadius: grayPct === 0 ? '0 9999px 9999px 0' : '0', transition: 'width 0.5s ease' }} />
      )}
      {grayPct > 0 && (
        <div style={{ flex: 1, backgroundColor: BORDER, borderRadius: '0 9999px 9999px 0' }} />
      )}
    </div>
  )
}

// ─── Tracker Icon ─────────────────────────────────────────────────────────────

function TrackerIcon({ type, size = 17, color = MUTED }: { type: string; size?: number; color?: string }) {
  switch (type) {
    case 'email':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="2" />
          <path d="M2 8l10 7 10-7" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'phone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth="2" />
          <line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" />
        </svg>
      )
    case 'book':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={color} strokeWidth="2" />
        </svg>
      )
    default: return null
  }
}

// ─── Speech Bubble ─────────────────────────────────────────────────────────────

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative flex justify-center">
      <div
        className="rounded-2xl px-4 py-3 text-center text-sm font-semibold leading-snug"
        style={{ backgroundColor: CARD_BG, color: NAVY, boxShadow: '0 3px 16px rgba(26,43,74,0.12)', maxWidth: '248px' }}
      >
        {text}
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '-9px',
          width: 0, height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: `10px solid ${CARD_BG}`,
        }}
      />
    </div>
  )
}

// ─── Progress Card ─────────────────────────────────────────────────────────────

function ProgressCard({ tracker, onIncrement, onOpen }: { tracker: Tracker; onIncrement: () => void; onOpen: () => void }) {
  const remaining = Math.max(tracker.dailyGoal - tracker.todayDone, 0)
  const donePct = Math.round((tracker.current / tracker.total) * 100)

  return (
    <div
      className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
      style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 14px rgba(26,43,74,0.08)' }}
      onClick={onOpen}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: SURFACE }}>
            <TrackerIcon type={tracker.iconType} size={16} />
          </div>
          <span className="font-bold text-sm leading-tight truncate" style={{ color: NAVY }}>{tracker.name}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onIncrement() }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs ml-2 transition-transform active:scale-90"
          style={{ backgroundColor: BLUE, color: 'white' }}
        >
          +1
        </button>
      </div>

      <div className="mb-2.5">
        <ProgressBar current={tracker.current} total={tracker.total} dailyGoal={remaining} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: SUBTLE }}>
          {tracker.current} <span style={{ color: BORDER }}>/ {tracker.total}</span>
        </span>
        <div className="flex items-center gap-1.5">
          {remaining > 0 ? (
            <>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CORAL }} />
              <span className="text-xs font-bold" style={{ color: CORAL }}>+{remaining} today</span>
            </>
          ) : (
            <span className="text-xs font-bold" style={{ color: '#52C47A' }}>Goal done ✓</span>
          )}
          <span className="text-xs font-bold ml-1" style={{ color: SUBTLE }}>{donePct}%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom Nav ─────────────────────────────────────────────────────────────────

function BottomNav({ active, onChange }: { active: NavTab; onChange: (tab: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      id: 'home', label: 'Home',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" fill={a ? 'currentColor' : 'none'} opacity={a ? 0.2 : 1} />
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'progress', label: 'Progress',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="14" width="4" height="6" rx="1" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
          <rect x="10" y="9" width="4" height="11" rx="1" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
          <rect x="16" y="4" width="4" height="16" rx="1" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'goals', label: 'Goals',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'profile', label: 'Profile',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill={a ? 'currentColor' : 'none'} opacity={a ? 0.2 : 1} />
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex items-center justify-around py-3 px-2" style={{ backgroundColor: CARD_BG, borderTop: `1px solid ${BORDER}` }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex flex-col items-center gap-0.5 min-w-[60px] py-1 transition-all"
          style={{ color: active === tab.id ? BLUE : SUBTLE }}
        >
          {tab.icon(active === tab.id)}
          <span className="text-[10px] font-bold">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Streak Badge ─────────────────────────────────────────────────────────────

function StreakBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#FFF4ED' }}>
      <span style={{ fontSize: '15px' }}>🔥</span>
      <span className="text-xs font-extrabold" style={{ color: '#E86A3A' }}>{count} day streak</span>
    </div>
  )
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

function DashboardScreen({
  trackers, onOpenTracker, onIncrementTracker, onCreateTracker, onGoals, onTabChange,
}: {
  trackers: Tracker[]
  onOpenTracker: (id: string) => void
  onIncrementTracker: (id: string) => void
  onCreateTracker: () => void
  onGoals: () => void
  onTabChange: (tab: NavTab) => void
}) {
  const emailTracker = trackers[0]
  const remaining = Math.max(emailTracker.dailyGoal - emailTracker.todayDone, 0)
  const message = remaining > 0
    ? `${remaining} more email${remaining !== 1 ? 's' : ''} to reach today's goal—you've got this!`
    : "You crushed today's email goal! Keep that momentum going! 🎉"

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <div>
          <p className="text-xs font-bold" style={{ color: SUBTLE }}>Good morning,</p>
          <h1 className="text-[22px] font-black leading-tight" style={{ color: NAVY }}>Fahsai 👋</h1>
        </div>
        <StreakBadge count={6} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 pb-2" style={{ scrollbarWidth: 'none' }}>
        {/* Mascot + bubble */}
        <div className="flex flex-col items-center pt-2 pb-3">
          <SpeechBubble text={message} />
          <div className="mt-3 mascot-float">
            <WaccyMascot mood="encouraging" size={108} />
          </div>
        </div>

        {/* Today's Goals CTA */}
        <button
          onClick={onGoals}
          className="w-full py-3.5 rounded-2xl font-extrabold text-[15px] mb-4 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: NAVY, color: 'white' }}
        >
          Today's Goals
        </button>

        {/* Cards */}
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-2.5" style={{ color: SUBTLE }}>
          Your Trackers
        </h2>
        <div className="space-y-3 pb-2">
          {trackers.map(tracker => (
            <ProgressCard
              key={tracker.id}
              tracker={tracker}
              onIncrement={() => onIncrementTracker(tracker.id)}
              onOpen={() => onOpenTracker(tracker.id)}
            />
          ))}
        </div>
      </div>

      {/* Floating + btn + bottom nav */}
      <div className="relative flex-shrink-0">
        <button
          onClick={onCreateTracker}
          className="absolute -top-6 right-5 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl z-10 active:scale-90 transition-transform"
          style={{ backgroundColor: CORAL, color: 'white', boxShadow: `0 6px 18px rgba(255,105,82,0.42)` }}
        >
          +
        </button>
        <BottomNav active="home" onChange={onTabChange} />
      </div>
    </div>
  )
}

// ─── Tracker Detail Screen ─────────────────────────────────────────────────────

function TrackerDetailScreen({
  tracker, onBack, onIncrement, onDecrement,
}: {
  tracker: Tracker
  onBack: () => void
  onIncrement: () => void
  onDecrement: () => void
}) {
  const remaining = Math.max(tracker.dailyGoal - tracker.todayDone, 0)
  const pct = Math.round((tracker.current / tracker.total) * 100)

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: CREAM, scrollbarWidth: 'none' }}>
      <div className="px-5 pt-6 pb-10">
        {/* Back header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: CARD_BG, boxShadow: '0 1px 8px rgba(26,43,74,0.10)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: SURFACE }}>
              <TrackerIcon type={tracker.iconType} size={16} color={BLUE} />
            </div>
            <h1 className="text-lg font-extrabold" style={{ color: NAVY }}>{tracker.name}</h1>
          </div>
        </div>

        {/* Big count card */}
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 16px rgba(26,43,74,0.09)' }}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-6xl font-black" style={{ color: NAVY }}>{tracker.current}</span>
            <span className="text-2xl font-bold" style={{ color: BORDER }}>/ {tracker.total}</span>
          </div>
          <p className="text-xs font-semibold mb-3" style={{ color: SUBTLE }}>{tracker.unit} completed</p>
          <ProgressBar current={tracker.current} total={tracker.total} dailyGoal={remaining} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BLUE }} />
                <span className="text-[11px] font-semibold" style={{ color: MUTED }}>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CORAL }} />
                <span className="text-[11px] font-semibold" style={{ color: MUTED }}>Today's target</span>
              </div>
            </div>
            <span className="text-sm font-extrabold" style={{ color: NAVY }}>{pct}%</span>
          </div>
        </div>

        {/* +/− controls */}
        <div
          className="rounded-2xl p-5 mb-4 flex items-center justify-between"
          style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 16px rgba(26,43,74,0.09)' }}
        >
          <button
            onClick={onDecrement}
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black active:scale-90 transition-transform"
            style={{ backgroundColor: SURFACE, color: MUTED }}
          >
            −
          </button>

          <div className="flex flex-col items-center">
            <WaccyMascot mood={remaining === 0 ? 'celebrating' : 'encouraging'} size={72} />
            <span className="text-[11px] font-bold mt-1" style={{ color: remaining === 0 ? '#52C47A' : SUBTLE }}>
              {remaining === 0 ? 'Goal done! 🎉' : `${remaining} more to go`}
            </span>
          </div>

          <button
            onClick={onIncrement}
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl font-black active:scale-90 transition-transform"
            style={{ backgroundColor: BLUE, color: 'white', boxShadow: `0 6px 16px rgba(68,121,196,0.38)` }}
          >
            +
          </button>
        </div>

        {/* Today's stats */}
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 14px rgba(26,43,74,0.08)' }}>
          <h3 className="text-xs font-extrabold uppercase tracking-wider mb-4" style={{ color: SUBTLE }}>Today's Progress</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Done Today',  value: tracker.todayDone,   color: BLUE  },
              { label: 'Remaining',   value: remaining,            color: CORAL },
              { label: 'Daily Goal',  value: tracker.dailyGoal,   color: NAVY  },
            ].map(stat => (
              <div key={stat.label} className="text-center rounded-xl py-3" style={{ backgroundColor: SURFACE }}>
                <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: SUBTLE }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 14px rgba(26,43,74,0.08)' }}>
          <h3 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: SUBTLE }}>Recent Activity</h3>
          <div className="space-y-2.5">
            {[
              { date: 'Today, Sep 5',    amount: tracker.todayDone, show: tracker.todayDone > 0 },
              { date: 'Yesterday, Sep 4', amount: 8,  show: true },
              { date: 'Mon, Sep 3',       amount: 12, show: true },
              { date: 'Sun, Sep 2',       amount: 7,  show: true },
            ].filter(a => a.show).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: MUTED }}>{item.date}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: SURFACE, color: BLUE }}>
                  +{item.amount} {tracker.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Create Tracker Screen ────────────────────────────────────────────────────

function CreateTrackerScreen({ onBack, onCreate }: { onBack: () => void; onCreate: (t: Tracker) => void }) {
  const [name, setName] = useState('')
  const [measureType, setMeasureType] = useState<'count' | 'pages'>('count')
  const [current, setCurrent] = useState('')
  const [total, setTotal] = useState('')
  const [dailyGoal, setDailyGoal] = useState('')

  const canSubmit = name.trim().length > 0 && Number(total) > 0

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: CREAM, scrollbarWidth: 'none' }}>
      <div className="px-5 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: CARD_BG, boxShadow: '0 1px 8px rgba(26,43,74,0.10)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-extrabold" style={{ color: NAVY }}>New Tracker</h1>
        </div>

        <div className="flex justify-center mb-5">
          <WaccyMascot mood="encouraging" size={82} />
        </div>

        <div
          className="rounded-2xl p-4 mb-5 text-center text-sm font-semibold"
          style={{ backgroundColor: CARD_BG, color: MUTED, boxShadow: '0 2px 12px rgba(26,43,74,0.07)' }}
        >
          What recruiting activity do you want to track? I'll help keep you accountable!
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
              Tracker Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Cold Emails Sent"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none focus:border-blue-400 transition-colors"
              style={{ backgroundColor: CARD_BG, color: NAVY, border: `2px solid ${BORDER}`, fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
              Measurement Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['count', 'pages'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setMeasureType(t)}
                  className="py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    backgroundColor: measureType === t ? NAVY : CARD_BG,
                    color: measureType === t ? 'white' : MUTED,
                    border: `2px solid ${measureType === t ? NAVY : BORDER}`,
                  }}
                >
                  {t === 'count' ? '# Count' : '📄 Pages / Steps'}
                </button>
              ))}
            </div>
          </div>

          {/* Starting value */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
              Starting Value <span style={{ color: BORDER }}>(optional)</span>
            </label>
            <input
              type="number"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none"
              style={{ backgroundColor: CARD_BG, color: NAVY, border: `2px solid ${BORDER}`, fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          {/* Total goal */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
              Total Goal <span style={{ color: CORAL }}>*</span>
            </label>
            <input
              type="number"
              value={total}
              onChange={e => setTotal(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none"
              style={{ backgroundColor: CARD_BG, color: NAVY, border: `2px solid ${BORDER}`, fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          {/* Daily target */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: SUBTLE }}>
              Daily Target
            </label>
            <input
              type="number"
              value={dailyGoal}
              onChange={e => setDailyGoal(e.target.value)}
              placeholder="10"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none"
              style={{ backgroundColor: CARD_BG, color: NAVY, border: `2px solid ${BORDER}`, fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          <button
            onClick={() => {
              if (!canSubmit) return
              onCreate({
                id: Date.now().toString(),
                name: name.trim(),
                iconType: measureType === 'pages' ? 'book' : 'briefcase',
                current: Number(current) || 0,
                total: Number(total),
                dailyGoal: Number(dailyGoal) || 5,
                todayDone: 0,
                unit: measureType === 'pages' ? 'pages' : 'items',
              })
            }}
            disabled={!canSubmit}
            className="w-full py-4 rounded-2xl font-extrabold text-base mt-2 active:scale-[0.98] transition-all"
            style={{ backgroundColor: canSubmit ? NAVY : '#C4C0B8', color: 'white' }}
          >
            Create Tracker
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Today's Goals Screen ────────────────────────────────────────────────────

function TodaysGoalsScreen({ trackers, onBack, onSave }: {
  trackers: Tracker[]
  onBack: () => void
  onSave: (goals: Record<string, number>) => void
}) {
  const [goals, setGoals] = useState<Record<string, number>>(
    Object.fromEntries(trackers.map(t => [t.id, t.dailyGoal]))
  )

  const bump = (id: string, delta: number) =>
    setGoals(g => ({ ...g, [id]: Math.max(0, (g[id] || 0) + delta) }))

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: CREAM, scrollbarWidth: 'none' }}>
      <div className="px-5 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: CARD_BG, boxShadow: '0 1px 8px rgba(26,43,74,0.10)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: NAVY }}>Today's Goals</h1>
            <p className="text-xs font-semibold" style={{ color: SUBTLE }}>Saturday, September 5</p>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <WaccyMascot mood="encouraging" size={82} />
        </div>

        <div
          className="rounded-2xl p-4 mb-5 text-sm font-semibold text-center"
          style={{ backgroundColor: CARD_BG, color: MUTED, boxShadow: '0 2px 12px rgba(26,43,74,0.07)' }}
        >
          Set your daily targets. Small, consistent steps lead to big results—I believe in you!
        </div>

        <div className="space-y-3 mb-5">
          {trackers.map(tracker => (
            <div
              key={tracker.id}
              className="rounded-2xl p-4"
              style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 14px rgba(26,43,74,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: SURFACE }}>
                  <TrackerIcon type={tracker.iconType} size={16} color={BLUE} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: NAVY }}>{tracker.name}</p>
                  <p className="text-xs font-semibold" style={{ color: SUBTLE }}>{tracker.current} / {tracker.total} total</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: SUBTLE }}>Daily target</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => bump(tracker.id, -1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: SURFACE, color: MUTED }}
                  >
                    −
                  </button>
                  <span className="text-xl font-black w-8 text-center" style={{ color: NAVY }}>{goals[tracker.id] ?? 0}</span>
                  <button
                    onClick={() => bump(tracker.id, 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: BLUE, color: 'white' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSave(goals)}
          className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-[0.98] transition-transform"
          style={{ backgroundColor: NAVY, color: 'white' }}
        >
          Save Today's Goals
        </button>
      </div>
    </div>
  )
}

// ─── Celebration Screen ────────────────────────────────────────────────────────

function CelebrationScreen({ tracker, onContinue }: { tracker: Tracker; onContinue: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full px-6 overflow-hidden" style={{ backgroundColor: CREAM }}>
      {/* Confetti */}
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full confetti-piece"
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDelay: c.delay,
            animationDuration: c.duration,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center screen-pop">
        <WaccyMascot mood="celebrating" size={148} />

        <h1 className="text-4xl font-black mt-3 mb-1" style={{ color: NAVY }}>
          You did it! 🎉
        </h1>
        <p className="text-base font-bold mb-1" style={{ color: BLUE }}>
          +1 {tracker.name}
        </p>
        <p className="text-sm font-semibold mb-6 leading-relaxed" style={{ color: MUTED, maxWidth: '280px' }}>
          Every action you take brings you closer to your dream offer. Keep building that streak!
        </p>

        {/* Updated card */}
        <div
          className="rounded-2xl p-5 w-full mb-6"
          style={{ backgroundColor: CARD_BG, boxShadow: '0 6px 24px rgba(26,43,74,0.13)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: SURFACE }}>
                <TrackerIcon type={tracker.iconType} size={16} color={BLUE} />
              </div>
              <span className="font-bold text-sm" style={{ color: NAVY }}>{tracker.name}</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#EDF7F0', color: '#52C47A' }}>
              Updated ✓
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-black" style={{ color: NAVY }}>{tracker.current}</span>
            <span className="text-lg font-semibold" style={{ color: BORDER }}>/ {tracker.total}</span>
          </div>
          <ProgressBar
            current={tracker.current}
            total={tracker.total}
            dailyGoal={Math.max(tracker.dailyGoal - tracker.todayDone, 0)}
          />
          <p className="text-xs font-semibold mt-2" style={{ color: SUBTLE }}>
            {Math.round((tracker.current / tracker.total) * 100)}% of total goal
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-[0.98] transition-transform"
          style={{ backgroundColor: NAVY, color: 'white' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

// ─── Empty Dashboard Screen ───────────────────────────────────────────────────

function EmptyDashboardScreen({ onCreate, onTabChange }: { onCreate: () => void; onTabChange: (tab: NavTab) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-2 flex-shrink-0">
        <p className="text-xs font-bold" style={{ color: SUBTLE }}>Good morning,</p>
        <h1 className="text-[22px] font-black" style={{ color: NAVY }}>Fahsai 👋</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="mascot-float">
          <WaccyMascot mood="encouraging" size={128} />
        </div>

        <h2 className="text-2xl font-black mt-4 mb-2" style={{ color: NAVY }}>
          Ready to land your dream role?
        </h2>
        <p className="text-sm font-semibold mb-6 leading-relaxed" style={{ color: MUTED }}>
          Create your first tracker to start monitoring your recruiting progress. I'll cheer you on every step of the way!
        </p>

        <button
          onClick={onCreate}
          className="w-full py-4 rounded-2xl font-extrabold text-base mb-6 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: NAVY, color: 'white' }}
        >
          Create My First Tracker
        </button>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { emoji: '📧', label: 'Track emails' },
            { emoji: '📞', label: 'Log calls'   },
            { emoji: '📋', label: 'Count apps'  },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 10px rgba(26,43,74,0.06)' }}
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className="text-[10px] font-bold" style={{ color: MUTED }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" onChange={onTabChange} />
    </div>
  )
}

// ─── Progress Screen ──────────────────────────────────────────────────────────

function ProgressScreen({ trackers, onTabChange }: { trackers: Tracker[]; onTabChange: (tab: NavTab) => void }) {
  const totalEmailsSent = trackers[0].current
  const totalApps = trackers[2].current

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        <h1 className="text-[22px] font-black mb-4" style={{ color: NAVY }}>Progress</h1>

        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Emails Sent',  value: totalEmailsSent, icon: '📧', color: BLUE  },
            { label: 'Apps Filed',   value: totalApps,        icon: '📋', color: CORAL },
            { label: 'Day Streak',   value: 6,                icon: '🔥', color: '#E86A3A' },
            { label: 'Goals Hit',    value: 14,               icon: '🎯', color: '#52C47A' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl p-4"
              style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 12px rgba(26,43,74,0.08)' }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: SUBTLE }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: SUBTLE }}>All Trackers</h2>

        <div className="space-y-3">
          {trackers.map(tracker => {
            const pct = Math.round((tracker.current / tracker.total) * 100)
            return (
              <div
                key={tracker.id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 12px rgba(26,43,74,0.08)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: SURFACE }}>
                      <TrackerIcon type={tracker.iconType} size={14} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>{tracker.name}</span>
                  </div>
                  <span className="font-extrabold text-sm" style={{ color: BLUE }}>{pct}%</span>
                </div>
                <ProgressBar current={tracker.current} total={tracker.total} dailyGoal={0} />
                <p className="text-xs font-semibold mt-1.5" style={{ color: SUBTLE }}>
                  {tracker.current} of {tracker.total} completed
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav active="progress" onChange={onTabChange} />
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({ onTabChange }: { onTabChange: (tab: NavTab) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        <h1 className="text-[22px] font-black mb-5" style={{ color: NAVY }}>Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-3"
            style={{ backgroundColor: NAVY }}
          >
            👩‍💼
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: NAVY }}>Fahsai Pongpai</h2>
          <p className="text-sm font-semibold" style={{ color: MUTED }}>Junior · Finance & Economics</p>
          <div
            className="mt-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#FFF4ED', color: '#E86A3A' }}
          >
            🔥 6-day streak
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Networking Emails', value: '40',  emoji: '📧' },
            { label: 'Applications',      value: '12',  emoji: '📋' },
            { label: 'Goals Hit',         value: '14',  emoji: '🎯' },
            { label: 'Active Trackers',   value: '4',   emoji: '📊' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 12px rgba(26,43,74,0.08)' }}
            >
              <div className="text-xl mb-1">{stat.emoji}</div>
              <p className="text-2xl font-black" style={{ color: NAVY }}>{stat.value}</p>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: SUBTLE }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: CARD_BG, boxShadow: '0 2px 12px rgba(26,43,74,0.08)' }}>
          {['Edit Profile', 'Notification Preferences', 'Recruiting Season', 'Export Data', 'About WACCY'].map((item, i, arr) => (
            <div
              key={item}
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}
            >
              <span className="text-sm font-semibold" style={{ color: NAVY }}>{item}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke={SUBTLE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" onChange={onTabChange} />
    </div>
  )
}

// ─── Screen Label ─────────────────────────────────────────────────────────────

const SCREEN_LABELS: Partial<Record<Screen, string>> = {
  dashboard:  'Tap a card or + to explore',
  empty:      'Empty state — onboarding',
  detail:     'Tap + to log progress',
  create:     'Create a new tracker',
  goals:      "Set today's daily targets",
  celebration:'WACCY celebrates! 🎉',
  progress:   'Progress overview',
  profile:    'Your profile & stats',
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]     = useState<Screen>('dashboard')
  const [trackers, setTrackers] = useState<Tracker[]>(DEFAULT_TRACKERS)
  const [selectedId, setSelectedId] = useState<string>('1')

  const selectedTracker = useMemo(() => trackers.find(t => t.id === selectedId), [trackers, selectedId])

  const goto = (s: Screen) => setScreen(s)

  const handleOpenTracker = (id: string) => { setSelectedId(id); goto('detail') }

  const handleIncrement = (id: string) =>
    setTrackers(ts => ts.map(t => t.id === id ? { ...t, current: t.current + 1, todayDone: t.todayDone + 1 } : t))

  const handleDecrement = (id: string) =>
    setTrackers(ts => ts.map(t => t.id === id ? { ...t, current: Math.max(0, t.current - 1), todayDone: Math.max(0, t.todayDone - 1) } : t))

  const handleIncrementInDetail = () => {
    handleIncrement(selectedId)
    goto('celebration')
  }

  const handleTabChange = (tab: NavTab) => {
    const map: Record<NavTab, Screen> = { home: 'dashboard', progress: 'progress', goals: 'goals', profile: 'profile' }
    goto(map[tab])
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <DashboardScreen
            trackers={trackers}
            onOpenTracker={handleOpenTracker}
            onIncrementTracker={handleIncrement}
            onCreateTracker={() => goto('create')}
            onGoals={() => goto('goals')}
            onTabChange={handleTabChange}
          />
        )
      case 'empty':
        return <EmptyDashboardScreen onCreate={() => goto('create')} onTabChange={handleTabChange} />
      case 'detail':
        if (!selectedTracker) return null
        return (
          <TrackerDetailScreen
            tracker={selectedTracker}
            onBack={() => goto('dashboard')}
            onIncrement={handleIncrementInDetail}
            onDecrement={() => handleDecrement(selectedId)}
          />
        )
      case 'create':
        return (
          <CreateTrackerScreen
            onBack={() => goto('dashboard')}
            onCreate={t => { setTrackers(ts => [...ts, t]); goto('dashboard') }}
          />
        )
      case 'goals':
        return (
          <TodaysGoalsScreen
            trackers={trackers}
            onBack={() => goto('dashboard')}
            onSave={goals => {
              setTrackers(ts => ts.map(t => ({ ...t, dailyGoal: goals[t.id] ?? t.dailyGoal })))
              goto('dashboard')
            }}
          />
        )
      case 'celebration':
        if (!selectedTracker) return null
        return <CelebrationScreen tracker={selectedTracker} onContinue={() => goto('dashboard')} />
      case 'progress':
        return <ProgressScreen trackers={trackers} onTabChange={handleTabChange} />
      case 'profile':
        return <ProfileScreen onTabChange={handleTabChange} />
      default:
        return null
    }
  }

  const ALL_SCREENS: Screen[] = ['dashboard', 'empty', 'detail', 'create', 'goals', 'celebration', 'progress', 'profile']

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: '#DDD8CE', fontFamily: "'Nunito', sans-serif" }}
    >
      {/* iPhone shell */}
      <div
        style={{
          width: '390px',
          height: '844px',
          backgroundColor: CREAM,
          borderRadius: '52px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.32), 0 0 0 11px #1C1C1E, 0 0 0 13px #3A3A3C, 0 0 0 14px #1C1C1E',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-8 py-2 flex-shrink-0"
          style={{ backgroundColor: CREAM }}
        >
          <span className="text-xs font-extrabold" style={{ color: NAVY }}>9:41</span>
          {/* Dynamic island */}
          <div style={{ width: '96px', height: '28px', backgroundColor: '#1C1C1E', borderRadius: '20px' }} />
          {/* Icons */}
          <div className="flex items-center gap-1.5">
            <svg width="15" height="11" viewBox="0 0 15 11" fill={NAVY}>
              <rect x="0"  y="7" width="2.5" height="4" rx="0.5" />
              <rect x="3.5" y="5" width="2.5" height="6" rx="0.5" />
              <rect x="7"  y="2.5" width="2.5" height="8.5" rx="0.5" />
              <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" opacity="0.35" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.5a6 6 0 016 6h-2a4 4 0 00-4-4 4 4 0 00-4 4H2a6 6 0 016-6z" fill={NAVY} />
              <circle cx="8" cy="9.5" r="2" fill={NAVY} />
            </svg>
            <div className="flex items-center gap-0.5">
              <div style={{ width: '25px', height: '13px', border: `1.5px solid ${NAVY}`, borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '2px', top: '2px', bottom: '2px', width: '70%', backgroundColor: NAVY, borderRadius: '1.5px' }} />
              </div>
              <div style={{ width: '2px', height: '6px', backgroundColor: NAVY, borderRadius: '1px', opacity: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: CREAM }}>
          {renderScreen()}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex flex-col items-center gap-2 mt-6">
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8B8070' }}>
          WACCY — Finance Recruiting Tracker
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center" style={{ maxWidth: '340px' }}>
          {ALL_SCREENS.map(s => (
            <button
              key={s}
              onClick={() => {
                if (s === 'detail' || s === 'celebration') setSelectedId('1')
                setScreen(s)
              }}
              title={s}
              className="transition-all"
              style={{
                width: screen === s ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: screen === s ? NAVY : '#C4BDB0',
              }}
            />
          ))}
        </div>
        <p className="text-[11px] font-semibold" style={{ color: '#9B9285' }}>
          {SCREEN_LABELS[screen]}
        </p>
      </div>
    </div>
  )
}
