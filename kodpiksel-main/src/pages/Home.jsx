// src/pages/Home.jsx
// Contains: section nav, courses grid, challenges, races, right sidebar ranking
import { useEffect } from 'react';
import Hero from '../components/Hero';
import { HTMLCSS_CHALLENGES } from '../data/challenges/htmlcss';
import { RACES } from '../data/races';
import GlobalLeaderboard from '../components/GlobalLeaderboard';
import { useAuth } from '../context/AuthContext';
import { useCountdown } from '../hooks/useCountdown';

// ── DATA ────────────────────────────────────────────────
const COURSES = [
  {
    id: 'htmlcss', name: 'HTML / CSS', lessons: 24, badge: { text: 'YENİ', cls: 'badge-new' },
    tabColor: '#E44D26', tabDark: '#bf3a1e',
    letters: [
      // H
      {x:6,y:30,w:3,h:14},{x:9,y:36,w:5,h:3},{x:14,y:30,w:3,h:14},
      // T
      {x:20,y:30,w:10,h:3},{x:24,y:33,w:3,h:11},
      // M
      {x:33,y:30,w:3,h:14},{x:36,y:33,w:3,h:3},{x:39,y:36,w:2,h:3},{x:41,y:33,w:3,h:3},{x:44,y:30,w:3,h:14},
      // L
      {x:50,y:30,w:3,h:14},{x:50,y:41,w:9,h:3},
    ]
  },
  {
    id: 'python', name: 'Python', lessons: 31, badge: { text: 'POPULYAR', cls: 'badge-hot' },
    tabColor: '#3A86FF', tabDark: '#2060cc',
    letters: [
      {x:6,y:30,w:3,h:14},{x:9,y:30,w:5,h:3},{x:14,y:33,w:3,h:4},{x:9,y:37,w:5,h:3},
      {x:20,y:30,w:3,h:6},{x:30,y:30,w:3,h:6},{x:23,y:35,w:4,h:2},{x:25,y:37,w:3,h:7},
      {x:36,y:30,w:10,h:3},{x:40,y:33,w:3,h:11},
      {x:50,y:30,w:3,h:14},{x:53,y:36,w:5,h:3},{x:58,y:30,w:3,h:14},
    ]
  },
  {
    id: 'javascript', name: 'JavaScript', lessons: 28, badge: { text: 'YENİ', cls: 'badge-new' },
    tabColor: '#e0a000', tabDark: '#c98900',
    letters: [
      {x:14,y:30,w:3,h:11},{x:17,y:41,w:2,h:2},{x:9,y:43,w:5,h:2},{x:8,y:41,w:2,h:2},
      {x:24,y:30,w:10,h:3},{x:24,y:33,w:3,h:4},{x:24,y:37,w:10,h:3},{x:31,y:40,w:3,h:4},{x:24,y:44,w:10,h:3},
    ]
  },
  {
    id: 'excel', name: 'Excel', lessons: 18, badge: null,
    tabColor: '#1D6F42', tabDark: '#155232',
    letters: [
      {x:8,y:30,w:3,h:3},{x:19,y:30,w:3,h:3},
      {x:11,y:33,w:3,h:3},{x:16,y:33,w:3,h:3},
      {x:14,y:36,w:3,h:3},
      {x:11,y:39,w:3,h:3},{x:16,y:39,w:3,h:3},
      {x:8,y:42,w:3,h:3},{x:19,y:42,w:3,h:3},
    ]
  },
];

const CHALLENGES = Object.values(HTMLCSS_CHALLENGES).map(c => ({
  id:         c.id,
  courseId:   'htmlcss',
  lang:       'HTML',
  cls:        'html',
  name:       c.title,
  difficulty: c.difficulty === 'ASAN' ? 1 : c.difficulty === 'ORTA' ? 2 : 3,
  chips:      c.chips,
}));

// RACES imported from data/races.js

// ── SUB-COMPONENTS ───────────────────────────────────────
function FolderSVG({ tabColor, tabDark, letters }) {
  return (
    <svg className="folder-svg" viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Tab */}
      <rect x="2" y="10" width="28" height="6" fill={tabDark}/>
      <rect x="2" y="8"  width="26" height="4" fill={tabColor}/>
      {/* Body */}
      <rect x="2"  y="16" width="76" height="48" fill="#F4A600"/>
      <rect x="2"  y="60" width="76" height="4"  fill="#c98900"/>
      <rect x="74" y="16" width="4"  height="48" fill="#c98900"/>
      <rect x="4"  y="18" width="70" height="5"  fill="#FFD000" opacity=".22"/>
      {/* Paper */}
      <rect x="14" y="6"  width="18" height="26" fill="#ececec"/>
      <rect x="24" y="3"  width="18" height="26" fill="#ffffff"/>
      <rect x="27" y="8"  width="12" height="1"  fill="#ccc"/>
      <rect x="27" y="12" width="12" height="1"  fill="#ccc"/>
      <rect x="27" y="16" width="8"  height="1"  fill="#ccc"/>
      {/* Letters */}
      {letters.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#fff"/>)}
    </svg>
  );
}

function Difficulty({ level }) {
  return (
    <div className="difficulty">
      {[1,2,3].map(i => <span key={i} className={i <= level ? 'filled' : ''}/>)}
    </div>
  );
}

// Homepage race card — pulled out so each card can call useCountdown
// independently (hooks can't run inside a .map on the parent component).
function RaceCardMini({ race, onRaceClick }) {
  const countdown = useCountdown(race.endsAt);
  const expired = race.endsAt ? countdown === null : race.status === 'done';
  const displayStatus = expired ? 'done' : race.status;
  const STATUS_TEXT = { live: 'CANLI', soon: 'TEZLIKLƏ', done: 'BİTDİ' };

  return (
    <div
      className="race-card"
      style={{ cursor: 'pointer' }}
      onClick={() => onRaceClick?.(race)}
    >
      <div className="race-icon">{race.icon}</div>
      <div className="race-info">
        <div className="race-title">{race.title}</div>
        <div className="race-sub">
          {!expired && race.status === 'live' && countdown
            ? `⏳ ${countdown} qalıb`
            : race.sub}
        </div>
      </div>
      <span className={`race-badge ${displayStatus}`}>
        {STATUS_TEXT[displayStatus]}
      </span>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────
export default function Home({ onCourseClick, onChallengeClick, onGoTo, onRaceClick }) {  
  // Clean out useNavigate and use your existing onGoTo prop!
    const { profile } = useAuth();


  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  
  return (
    <>
      <Hero />

     <nav id="section-nav">
      <button className="snav-btn" onClick={() => onGoTo?.('courses')}>Kurslar</button>
      <button className="snav-btn" onClick={() => onGoTo?.('challenges')}>Çalışma</button>
      <button className="snav-btn" onClick={() => onGoTo?.('races')}>Yarış</button>
    </nav>

      <div className="page-body">
        <div className="main-col">

          {/* COURSES */}
          <section id="kurslar">
            <div className="section-label">Kurslar</div>
            <div className="courses-grid">
              {COURSES.map(c => (
                <div 
                  key={c.id} 
                  className="folder-card" 
                  onClick={() => onCourseClick && onCourseClick(c.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <FolderSVG tabColor={c.tabColor} tabDark={c.tabDark} letters={c.letters}/>
                  <div className="folder-card-name">{c.name}</div>
                  <div className="folder-card-meta">
                    {c.lessons} dərs
                    {c.badge && <span className={`badge ${c.badge.cls}`}>{c.badge.text}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CHALLENGES */}
          <section id="challenge">
            <div className="section-label">Çalışma</div>
            <div className="challenge-grid">
              {CHALLENGES.map((ch, i) => (
                <div
                  key={i}
                  className="challenge-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onChallengeClick && onChallengeClick(ch.courseId, ch.id)}
                >
                  <span className={`ch-lang ${ch.cls}`}>{ch.lang}</span>
                  <div className="ch-task-name">{ch.name}</div>
                  <div className="ch-meta">
                    <Difficulty level={ch.difficulty}/>
                    <span style={{ fontSize: '.68rem', color: 'var(--muted)' }}>🖥️ {ch.chips} çip</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RACES */}
          <section id="yaris">
            <div className="section-label">Yarış</div>
            <div className="race-list">
              {RACES.slice(0, 4).map((r) => (
                <RaceCardMini key={r.id} race={r} onRaceClick={onRaceClick} />
              ))}
            </div>
          </section>

        </div>{/* /main-col */}

        {/* RIGHT SIDEBAR — Ranking */}
        <aside className="right-sidebar">
          <GlobalLeaderboard currentUserId={profile?.id} />
      </aside>
      </div>

      <footer>&lt;&gt; KodPiksel — 2026</footer>
    </>
  );
}