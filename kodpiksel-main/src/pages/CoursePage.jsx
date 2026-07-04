// src/pages/CoursePage.jsx
// Universal template — pass any course data object and it renders correctly.
// Usage in App.jsx:
//   import CoursePage from './pages/CoursePage';
//   import htmlcss    from './data/courses/htmlcss';
//   <CoursePage course={htmlcss} onBack={() => setCurrentPage('')} onLesson={(id) => ...} />

import { useState } from 'react';
import { useRewards }          from '../context/RewardContext';

// ── CHIP SVG (difficulty indicator) ─────────────────────
function ChipIcon({ color }) {
  return (
    <svg className="chip-icon" width="20" height="22" viewBox="0 0 20 22" fill="none">
      <rect x="4"  y="3"  width="12" height="16" rx="1" fill={color} opacity=".85"/>
      <rect x="6"  y="5"  width="8"  height="12" fill="#0A1622"/>
      <rect x="7"  y="6"  width="2"  height="3"  fill={color} opacity=".7"/>
      <rect x="11" y="6"  width="2"  height="3"  fill={color} opacity=".7"/>
      <rect x="7"  y="13" width="6"  height="1"  fill={color} opacity=".5"/>
      <rect x="1"  y="7"  width="3"  height="1"  fill={color} opacity=".6"/>
      <rect x="1"  y="10" width="3"  height="1"  fill={color} opacity=".6"/>
      <rect x="1"  y="13" width="3"  height="1"  fill={color} opacity=".6"/>
      <rect x="16" y="7"  width="3"  height="1"  fill={color} opacity=".6"/>
      <rect x="16" y="10" width="3"  height="1"  fill={color} opacity=".6"/>
      <rect x="16" y="13" width="3"  height="1"  fill={color} opacity=".6"/>
    </svg>
  );
}

// ── BATTERY ──────────────────────────────────────────────
function Battery({ total, filled, locked }) {
  return (
    <div className="battery-wrap">
      <div className={`battery${locked ? ' locked' : ''}`}>
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`cell${!locked && i < filled ? ' filled' : ''}${!locked && i === filled ? ' just-filled' : ''}`}
          />
        ))}
      </div>
      <div className={`battery-nub${locked ? ' locked-nub' : ''}`} />
    </div>
  );
}

// ── LESSON CARD ──────────────────────────────────────────
const PILL_COLORS = [
  '', // 0 unused
  { bg: 'rgba(167,139,250,.1)', color: '#a78bfa', border: '#a78bfa' },
  { bg: 'rgba(58,134,255,.1)',  color: '#3A86FF', border: '#3A86FF' },
  { bg: 'rgba(122,75,209,.1)', color: '#9b69e8',  border: '#9b69e8' },
  { bg: 'rgba(228,77,38,.1)',  color: '#e44d26',  border: '#e44d26' },
  { bg: 'rgba(244,166,0,.1)',  color: '#F4A600',  border: '#F4A600' },
  { bg: 'rgba(0,212,170,.1)',  color: '#00D4AA',  border: '#00D4AA' },
];

function LessonCard({ lesson, done, active, courseColor, onClick }) {
  const pillStyle = PILL_COLORS[lesson.pill] || PILL_COLORS[1];
  const cls = [
    'lesson-card',
    done   ? 'done-lesson'   : '',
    active ? 'active-lesson' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} onClick={() => onClick(lesson.id)} style={{ cursor: 'pointer' }}>
      {/* Chip difficulty icons */}
      <div className="chip-corner">
        {[...Array(lesson.chips)].map((_, i) => (
          <ChipIcon key={i} color={courseColor} />
        ))}
      </div>

      {/* Pill */}
      <span className="cp-pill" style={{
        background:   pillStyle.bg,
        color:        pillStyle.color,
        borderColor:  pillStyle.border,
      }}>
        DƏRS {lesson.id}
      </span>

      <h3>{lesson.title}</h3>
      <p>{lesson.desc}</p>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function CoursePage({ course, onBack, onLesson }) {
  const { rewards, completedTasks } = useRewards();

  // Progress derived from the same completedTasks Set that backs chip
  // awards (per-user, synced to Supabase, resets on logout) — replaces a
  // localStorage key that used to leak completion between accounts on the
  // same device.
  const prefix = `${course.id}-lesson-`;
  const done = [];
  completedTasks.forEach(t => {
    if (t.startsWith(prefix)) {
      const id = Number(t.slice(prefix.length));
      if (!Number.isNaN(id)) done.push(id);
    }
  });

  // Which lesson is next (first not done)
  function getActive(lessons) {
    const next = lessons.find(l => !done.includes(l.id));
    return next?.id ?? null;
  }

  // Toggle visibility of lesson grid per module
  const [collapsed, setCollapsed] = useState({});
  function toggleModule(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="cp-page">

      {/* Back breadcrumb */}
      <button className="cp-back" onClick={onBack}>← Ana Səhifə</button>

      {/* Page header */}
      <p className="page-eyebrow">{course.eyebrow}</p>
      <h1 className="page-title">{course.title}</h1>
      <p className="page-sub">{course.description}</p>

      {/* Modules */}
      {course.modules.map(mod => {
        const isLocked   = mod.status === 'locked';
        const donInMod   = mod.lessons.filter(l => done.includes(l.id)).length;
        const activeId   = isLocked ? null : getActive(mod.lessons);
        const isHidden   = collapsed[mod.id];

        return (
          <section key={mod.id} className={`module-card${isLocked ? ' locked' : ''}`}>

            {/* Module top row */}
            <div className="module-top">
              {isLocked
                ? <span className="badge badge-locked">🔒 KİLİDLİ BÖLMƏ</span>
                : donInMod === 0
                  ? <span className="badge badge-active">● AKTİV</span>
                  : donInMod < mod.lessonCount
                    ? <span className="badge badge-progress">◐ {donInMod} / {mod.lessonCount} TAMAMLANDI</span>
                    : <span className="badge badge-active">✓ TAMAMLANDI</span>
              }
              {isLocked
                ? <button className="btn-soon" disabled>Yaxında</button>
                : <button className="btn-toggle" onClick={() => toggleModule(mod.id)}>
                    {isHidden ? '▶ Göstər' : '▼ Gizlət'}
                  </button>
              }
            </div>

            {/* Module title */}
            <h2 className={`module-title${isLocked ? ' locked-text' : ''}`}>{mod.title}</h2>

            {/* Battery */}
            <div className="battery-row">
              <span className={`battery-label${isLocked ? ' locked-text' : ''}`}>
                BATARYA İNDİKATORU:
              </span>
              <Battery
                total={mod.lessonCount}
                filled={donInMod}
                locked={isLocked}
              />
            </div>

            {/* Lessons grid */}
            {!isLocked && !isHidden && mod.lessons.length > 0 && (
              <>
                <hr className="dashed" />
                <div className="topics-row">
                  <span className="topics-title">// MÖVZULAR</span>
                </div>
                <div className="lesson-grid">
                  {mod.lessons.map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      done={done.includes(lesson.id)}
                      active={activeId === lesson.id}
                      courseColor={course.color}
                      onClick={(id) => onLesson && onLesson(id, course)}
                    />
                  ))}
                </div>
              </>
            )}

          </section>
        );
      })}
    </div>
  );
}