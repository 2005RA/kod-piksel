// src/pages/ChallengesPage.jsx
// Shows all challenges across all courses with a filter bar.
// To add a new course's challenges: add to CHALLENGE_SOURCES below.

import { useState } from 'react';
import { HTMLCSS_CHALLENGES } from '../data/challenges/htmlcss';
// import { PYTHON_CHALLENGES } from '../data/challenges/python'; // add when ready

// ── CHALLENGE SOURCES ─────────────────────────────────────
// Add new courses here when ready
const CHALLENGE_SOURCES = [
  {
    courseId:  'htmlcss',
    label:     'HTML / CSS',
    cls:       'html',
    color:     '#E44D26',
    data:      HTMLCSS_CHALLENGES,
  },
  // { courseId: 'python', label: 'Python', cls: 'python', color: '#3A86FF', data: PYTHON_CHALLENGES },
];

// Flatten all challenges into one list
const ALL_CHALLENGES = CHALLENGE_SOURCES.flatMap(src =>
  Object.values(src.data).map(c => ({
    ...c,
    courseId:    src.courseId,
    courseLabel: src.label,
    cls:         src.cls,
    color:       src.color,
  }))
);

const FILTERS = [
  { id: 'all',     label: 'Hamısı' },
  { id: 'htmlcss', label: 'HTML / CSS' },
];

const DIFF_FILTERS = [
  { id: 'all',    label: 'Bütün səviyyələr' },
  { id: 'ASAN',   label: '🟢 Asan'          },
  { id: 'ORTA',   label: '🟡 Orta'          },
  { id: 'ÇƏTİN',  label: '🔴 Çətin'         },
];

const DIFF_COLORS = { ASAN: 'var(--teal)', ORTA: 'var(--amber)', ÇƏTİN: '#f45050' };

function Difficulty({ level }) {
  return (
    <div className="difficulty">
      {[1,2,3].map(i => <span key={i} className={i <= level ? 'filled' : ''}/>)}
    </div>
  );
}

export default function ChallengesPage({ onChallengeClick, onBack }) {
  const [filter,  setFilter]  = useState('all');
  const [diff,    setDiff]    = useState('all');
  const [search,  setSearch]  = useState('');

  const shown = ALL_CHALLENGES.filter(c => {
    const matchFilter = filter === 'all' || c.courseId === filter;
    const matchDiff   = diff   === 'all' || c.difficulty === diff;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchDiff && matchSearch;
  });

  const diffLevel = (d) => d === 'ASAN' ? 1 : d === 'ORTA' ? 2 : 3;

  return (
    <div className="cp-page">
      <button className="cp-back" onClick={onBack}>← Ana Səhifə</button>
      <p className="page-eyebrow">Bütün Çalışmalar</p>
      <h1 className="page-title">Çalış, öyrən, mükafat qazan</h1>
      <p className="page-sub">
        Hər çalışmanı tamamladıqca çip, açar və piksel qazanırsan.
      </p>

      {/* ── FILTER BAR ── */}
      <div className="ch-filter-bar">
        <div className="ch-filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`ch-filter-btn${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="ch-filter-count">
                {f.id === 'all'
                  ? ALL_CHALLENGES.length
                  : ALL_CHALLENGES.filter(c => c.courseId === f.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <select
          className="race-course-select"
          value={diff}
          onChange={e => setDiff(e.target.value)}
        >
          {DIFF_FILTERS.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>

        <input
          className="ch-search"
          placeholder="Çalışma axtar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── CHALLENGE GRID ── */}
      {shown.length === 0
        ? <div className="ch-empty">Heç bir çalışma tapılmadı.</div>
        : <div className="allch-grid">
            {shown.map(ch => (
              <div
                key={`${ch.courseId}-${ch.id}`}
                className="allch-card"
                style={{ '--ch-color': ch.color }}
                onClick={() => onChallengeClick?.(ch.courseId, ch.id)}
              >
                {/* Top row */}
                <div className="allch-top">
                  <span className={`ch-lang ${ch.cls}`}>{ch.courseLabel}</span>
                  <span
                    className="allch-diff"
                    style={{ color: DIFF_COLORS[ch.difficulty] }}
                  >
                    {ch.difficulty}
                  </span>
                </div>

                {/* Title */}
                <div className="allch-title">{ch.title}</div>

                {/* Rewards */}
                <div className="allch-rewards">
                  {ch.chips       > 0 && <span>🖥️ ×{ch.chips}</span>}
                  {ch.keys        > 0 && <span>🗝️ ×{ch.keys}</span>}
                  {ch.hourglasses > 0 && <span>⏳ ×{ch.hourglasses}</span>}
                  {ch.pixels      > 0 && <span>🧩 ×{ch.pixels}</span>}
                </div>

                {/* Bottom */}
                <div className="allch-bottom">
                  <Difficulty level={diffLevel(ch.difficulty)} />
                  <span className="allch-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}