// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAuth }  from '../context/AuthContext';

const AVATARS = [
  { emoji: '🧑‍💻', label: 'Kodçu'    },
  { emoji: '🦊',   label: 'Tülkü'    },
  { emoji: '🐼',   label: 'Panda'    },
  { emoji: '🚀',   label: 'Raket'    },
  { emoji: '👾',   label: 'Oyunçu'   },
  { emoji: '🐉',   label: 'Əjdaha'  },
  { emoji: '🌸',   label: 'Çiçək'   },
  { emoji: '⚡',   label: 'Şimşək'  },
  { emoji: '🎮',   label: 'Gamer'  },
  { emoji: '🤖',   label: 'Robot'    },
  { emoji: '🐙',   label: 'Ahtapot'  },
  { emoji: '🦋',   label: 'Kəpənək' },
];

// XP thresholds per level
const LEVEL_XP = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];
function xpForLevel(lvl) { return LEVEL_XP[lvl] ?? LEVEL_XP[LEVEL_XP.length - 1]; }
function xpProgress(xp, lvl) {
  const curr = xpForLevel(lvl - 1);
  const next = xpForLevel(lvl);
  return Math.min(100, Math.round(((xp - curr) / (next - curr)) * 100));
}

// ── STAT PILL ─────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, color }) {
  return (
    <div style={{ ...S.statPill, borderTopColor: color }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <span style={{ ...S.statValue, color }}>{value}</span>
      <span style={S.statLabel}>{label}</span>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProfilePage({ onBack }) {
  const { profile, logout, updateProfile } = useAuth();

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [editingAge, setEditingAge] = useState(false);
  const [newAge, setNewAge] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  if (!profile) return (
    <div style={S.loading}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--teal)' }}>
        Yüklənir...
      </span>
    </div>
  );

  const lvl = profile.level ?? 1;
  const xp  = profile.xp   ?? 0;
  const pct = xpProgress(xp, lvl);

  async function handleAvatarChange(emoji) {
    setSaving(true);
    await updateProfile({ avatar_emoji: emoji });
    setEditingAvatar(false);
    setSaving(false);
    flash('Avatar yeniləndi ✓');
  }

 async function handleUsernameChange() {
    if (!newUsername.trim()) return;
    setSaving(true);
    await updateProfile({ username: newUsername.trim() });
    setEditingUsername(false);
    setNewUsername('');
    setSaving(false);
    flash('İstifadəçi adı yeniləndi ✓');
  }

  async function handleAgeChange() {
    const age = parseInt(newAge);
    if (!newAge || age < 7 || age > 99) return;    setSaving(true);
    await updateProfile({ age });
    setEditingAge(false);
    setNewAge('');
    setSaving(false);
    flash('Yaş yeniləndi ✓');
  }

  function flash(msg) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 2500);
  }

  async function handleLogout() {
    await logout();
    onBack?.();
  }

  return (
    <div className="nb-wrapper" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div style={S.container}>

        {/* ── LEFT COLUMN ── */}
        <div style={S.leftCol}>

          {/* Avatar card */}
          <div style={S.avatarCard}>
            <div style={S.avatarBig}>{profile.avatar_emoji ?? '🧑‍💻'}</div>

            {/* Username */}
            {editingUsername ? (
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <input
                  style={S.inlineInput}
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder={profile.username}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleUsernameChange()}
                />
                <button style={S.smallBtn} onClick={handleUsernameChange} disabled={saving}>✓</button>
                <button style={S.smallBtnGhost} onClick={() => setEditingUsername(false)}>✕</button>
              </div>
            ) : (
              <div style={S.usernameRow}>
                <span style={S.username}>{profile.username}</span>
                <button style={S.editIconBtn} onClick={() => { setNewUsername(profile.username); setEditingUsername(true); }} title="Adı dəyiş">✏️</button>
              </div>
            )}

{editingAge ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  style={S.inlineInput}
                  type="number"
                  min={7} max={99}
                  value={newAge}
                  onChange={e => setNewAge(e.target.value)}
                  placeholder={profile.age ?? '12'}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleAgeChange()}
                />
                <button style={S.smallBtn} onClick={handleAgeChange} disabled={saving}>✓</button>
                <button style={S.smallBtnGhost} onClick={() => setEditingAge(false)}>✕</button>
              </div>
            ) : (
              <span style={S.ageBadge}>
                Yaş: {profile.age ?? '—'}{' '}
                <button style={S.editIconBtn} onClick={() => { setNewAge(profile.age ?? ''); setEditingAge(true); }} title="Yaşı dəyiş">✏️</button>
              </span>
            )}
            {/* Level + XP bar */}
            <div style={S.levelRow}>
              <span style={S.levelBadge}>LVL {lvl}</span>
              <div style={S.xpBarWrap}>
                <div style={{ ...S.xpBarFill, width: `${pct}%` }} />
              </div>
              <span style={S.xpText}>{xp} XP</span>
            </div>

            {/* Change avatar button */}
            <button style={S.changeAvatarBtn} onClick={() => setEditingAvatar(v => !v)}>
              {editingAvatar ? 'Bağla' : '🎨 Avatarı Dəyiş'}
            </button>

            {editingAvatar && (
              <div style={S.avatarPickerGrid}>
                {AVATARS.map(a => (
                  <button
                    key={a.emoji}
                    style={{
                      ...S.avatarPickBtn,
                      ...(profile.avatar_emoji === a.emoji ? S.avatarPickSelected : {}),
                    }}
                    onClick={() => handleAvatarChange(a.emoji)}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            )}

            {saveMsg && <div style={S.flashMsg}>{saveMsg}</div>}
          </div>

          {/* Logout */}
          <button style={S.logoutBtn} onClick={handleLogout}>↩ Çıxış</button>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={S.rightCol}>

          {/* Stats row */}
          <div style={S.statsRow}>
            <StatPill icon="🖥️" label="Çip"       value={profile.chips       ?? 0} color="var(--teal)"   />
            <StatPill icon="🗝️" label="Açar"      value={profile.keys        ?? 0} color="var(--yellow)" />
            <StatPill icon="⏳" label="Qum Saatı" value={profile.hourglasses ?? 0} color="#a78bfa"       />
            <StatPill icon="🔁" label="Təkrar Piksellər" value={profile.repeated_pixels ?? 0} color="var(--pink)" />
          </div>

          {/* Section: Course progress */}
          {/* <div style={S.section}>
            <div style={S.sectionHeader}>// KURS İRƏLİLƏYİŞİ</div>
            <CourseBar label="HTML / CSS" done={0} total={14} color="var(--teal)" />
            <CourseBar label="Python"     done={0} total={10} color="var(--yellow)" />
          </div> */}

          {/* Section: Recent badges */}
          <div style={S.section}>
            {/* <div style={S.sectionHeader}>// NAILIYYƏTLƏR</div>
            <div style={S.badgeGrid}>
              {[
                { emoji: '🏁', label: 'İlk Dərs',    earned: true  },
                { emoji: '🔥', label: '3 Gün Sıra',  earned: true  },
                { emoji: '⚡', label: 'Sürət Yarışı', earned: false },
                { emoji: '🏆', label: 'Modul 1',     earned: false },
                { emoji: '👾', label: 'Bug Hunter',  earned: false },
                { emoji: '🌟', label: 'Mükəmməl',    earned: false },
              ].map(b => (
                <div key={b.label} style={{ ...S.badge, opacity: b.earned ? 1 : 0.3 }}>
                  <span style={{ fontSize: '1.8rem' }}>{b.emoji}</span>
                  <span style={S.badgeLabel}>{b.label}</span>
                  {!b.earned && <span style={S.badgeLock}>🔒</span>}
                </div>
              ))}
            </div> */}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── COURSE PROGRESS BAR ───────────────────────────────────────────────────────
function CourseBar({ label, done, total, color }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div style={S.courseBarWrap}>
      <div style={S.courseBarTop}>
        <span style={S.courseBarLabel}>{label}</span>
        <span style={{ ...S.courseBarPct, color }}>{done}/{total} dərs</span>
      </div>
      <div style={S.courseBarTrack}>
        <div style={{ ...S.courseBarFill, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  loading: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'var(--navy)',
  },
  container: {
    width: '100%', maxWidth: 960,
    display: 'grid', gridTemplateColumns: '260px 1fr',
    gap: 24, margin: '0 auto',
  },
  leftCol:  { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },

  // Avatar card
  avatarCard: {
    background: 'var(--navy2)',
    border: '2px solid var(--border-teal)',
    boxShadow: '4px 4px 0 var(--teal)',
    padding: 24,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 10,
  },
  avatarBig: { fontSize: '5rem', lineHeight: 1 },
  usernameRow: { display: 'flex', alignItems: 'center', gap: 6 },
  username: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700, fontSize: '1.1rem', color: 'var(--white)',
  },
  editIconBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '0.8rem', padding: 2,
  },
  inlineInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--teal)',
    color: 'var(--white)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem', padding: '4px 8px',
    outline: 'none', width: 130,
  },
  smallBtn: {
    background: 'var(--teal)', border: 'none',
    color: '#0b0f19', fontWeight: 700,
    padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem',
  },
  smallBtnGhost: {
    background: 'none',
    border: '1px solid var(--border-teal)',
    color: 'var(--muted)',
    padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem',
  },
  ageBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem', color: 'var(--muted)',
  },
  levelRow: {
    width: '100%', display: 'flex',
    alignItems: 'center', gap: 8,
  },
  levelBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem', fontWeight: 700,
    color: 'var(--yellow)',
    background: 'rgba(245,158,11,0.15)',
    padding: '2px 8px', borderRadius: 2,
    whiteSpace: 'nowrap',
  },
  xpBarWrap: {
    flex: 1, height: 6,
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 3, overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--teal), var(--yellow))',
    borderRadius: 3, transition: 'width 0.4s',
  },
  xpText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', color: 'var(--muted)', whiteSpace: 'nowrap',
  },
  changeAvatarBtn: {
    width: '100%', marginTop: 4,
    background: 'rgba(0,212,170,0.07)',
    border: '1px solid var(--border-teal)',
    color: 'var(--teal)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.72rem', padding: '8px 0', cursor: 'pointer',
  },
  avatarPickerGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, width: '100%',
  },
  avatarPickBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '2px solid transparent',
    fontSize: '1.4rem', padding: '6px 0',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  avatarPickSelected: {
    borderColor: 'var(--teal)',
    background: 'rgba(0,212,170,0.1)',
  },
  flashMsg: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem', color: 'var(--teal)',
    background: 'rgba(0,212,170,0.1)',
    padding: '6px 12px', width: '100%', textAlign: 'center',
  },
  logoutBtn: {
    background: 'rgba(236,72,153,0.07)',
    border: '1px solid rgba(236,72,153,0.25)',
    color: '#ec4899',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem', padding: '10px 0',
    cursor: 'pointer', width: '100%',
  },

  // Stats
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 },
  statPill: {
    background: 'var(--navy2)',
    border: '1px solid var(--border-teal)',
    borderTop: '3px solid',
    padding: '14px 10px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
  },
  statValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700, fontSize: '1.4rem',
  },
  statLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: 1,
  },

  // Sections
  section: {
    background: 'var(--navy2)',
    border: '1px solid var(--border-teal)',
    padding: '20px 24px',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  sectionHeader: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem', color: 'var(--muted)',
    letterSpacing: 2, textTransform: 'uppercase',
  },

  // Course bars
  courseBarWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  courseBarTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  courseBarLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.85rem', color: 'var(--white)',
  },
  courseBarPct: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
  },
  courseBarTrack: {
    height: 8, background: 'rgba(255,255,255,0.06)',
    borderRadius: 4, overflow: 'hidden',
  },
  courseBarFill: {
    height: '100%', borderRadius: 4, transition: 'width 0.4s',
  },

  // Badges
  badgeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10,
  },
  badge: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
    position: 'relative',
  },
  badgeLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem', color: 'var(--muted)',
    textAlign: 'center',
  },
  badgeLock: {
    position: 'absolute', top: -4, right: -4,
    fontSize: '0.6rem',
  },
};