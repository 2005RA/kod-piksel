// src/pages/RacesPage.jsx
import { useState } from 'react';
import { RACES } from '../data/races';
import { useCountdown } from '../hooks/useCountdown';

const STATUS_FILTERS = [
  { id: 'all',  label: 'Hamısı' },
  { id: 'live', label: '🔴 Canlı' },
  { id: 'soon', label: '🟡 Tezliklə' },
  { id: 'done', label: '⚫ Bitmiş' },
];

const COURSE_FILTERS = [
  { id: 'all',        label: 'Bütün kurslar' },
  { id: 'htmlcss',    label: 'HTML / CSS' },
  { id: 'python',     label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
];

const STATUS_LABELS = { live: 'CANLI', soon: 'TEZLIKLƏ', done: 'BİTDİ' };

// ── SINGLE RACE CARD ─────────────────────────────────────
// Pulled out as its own component so each card can call useCountdown
// independently (hooks can't be called inside .map on the parent).
function RaceCard({ race, onRaceClick }) {
  const countdown = useCountdown(race.endsAt);
  const expired = race.endsAt ? countdown === null : race.status === 'done';

  // Effective status for display purposes only — once the countdown
  // hits 0 the card always reads as finished, regardless of r.status.
  const displayStatus = expired ? 'done' : race.status;

  return (
    <div
      className={`race-page-card status-${displayStatus}`}
      onClick={() => onRaceClick?.(race)}
      style={{ cursor: 'pointer' }}
    >
      <div className="race-page-icon">{race.icon}</div>

      <div className="race-page-info">
        <div className="race-page-title">{race.title}</div>
        <div className="race-page-sub">{race.sub}</div>
        <div className="race-page-meta">
          <span className={`race-badge ${displayStatus}`}>
            {STATUS_LABELS[displayStatus]}
          </span>
          <span className="race-course-tag">{race.label}</span>
          {!expired && countdown
            ? <span className="race-date-tag race-countdown">⏳ {countdown}</span>
            : <span className="race-date-tag">📅 {race.dateLabel}</span>
          }
          <span className="race-prize-tag">🏆 {race.prize}</span>
        </div>
      </div>

      <button
        className={`race-page-btn${expired ? ' btn-done' : race.status === 'live' ? ' btn-live' : ' btn-soon'}`}
        onClick={e => { e.stopPropagation(); onRaceClick?.(race); }}
      >
        {expired ? 'Sıralamaya bax' : race.status === 'live' ? 'Qoşul →' : 'Xatırlat'}
      </button>
    </div>
  );
}

export default function RacesPage({ onBack, onRaceClick }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // A race only belongs on this page while its countdown is still running.
  // Once endsAt has passed, it's dropped from RacesPage entirely (per product
  // decision — finished races are reached through other means, not this list).
  const active = RACES.filter(r => {
    if (!r.endsAt) return r.status !== 'done';
    return new Date(r.endsAt).getTime() > Date.now();
  });

  const shown = active.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCourse = courseFilter === 'all' || r.course === courseFilter;
    return matchStatus && matchCourse;
  });

  // Sort: live first, then soon, then done
  const ORDER = { live: 0, soon: 1, done: 2 };
  shown.sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  return (
    <div className="cp-page">
      <button className="cp-back" onClick={onBack}>← Ana Səhifə</button>
      <p className="page-eyebrow">Yarışlar</p>
      <h1 className="page-title">Yarış et, zirvəyə çıx</h1>
      <p className="page-sub">
        Canlı yarışlara qoşul, çip və açar qazan. Sıralamada yüksəl!
      </p>

      {/* ── FILTER BAR ── */}
      <div className="race-filter-bar">
        {/* Status filter */}
        <div className="ch-filter-tabs">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              className={`ch-filter-btn${statusFilter === f.id ? ' active' : ''}`}
              onClick={() => setStatusFilter(f.id)}
            >
              {f.label}
              <span className="ch-filter-count">
                {f.id === 'all' ? active.length : active.filter(r => r.status === f.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Course filter */}
        <select
          className="race-course-select"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          {COURSE_FILTERS.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* ── RACE LIST ── */}
      {shown.length === 0
        ? <div className="ch-empty">Heç bir yarış tapılmadı.</div>
        : <div className="race-page-list">
            {shown.map(r => (
              <RaceCard key={r.id} race={r} onRaceClick={onRaceClick} />
            ))}
          </div>
      }
    </div>
  );
}