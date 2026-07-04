// src/pages/CoursesPage.jsx
// Shows all available courses as folder cards. Click → onCourseClick(id)

const COURSES = [
  {
    id: 'htmlcss', name: 'HTML / CSS', lessons: 24, badge: { text: 'YENİ', cls: 'badge-new' },
    desc: 'Veb səhifələrin skeletini qur, CSS ilə gözəlləşdir.',
    tabColor: '#E44D26', tabDark: '#bf3a1e',
    letters: [
      {x:6,y:30,w:3,h:14},{x:9,y:36,w:5,h:3},{x:14,y:30,w:3,h:14},
      {x:20,y:30,w:10,h:3},{x:24,y:33,w:3,h:11},
      {x:33,y:30,w:3,h:14},{x:36,y:33,w:3,h:3},{x:39,y:36,w:2,h:3},{x:41,y:33,w:3,h:3},{x:44,y:30,w:3,h:14},
      {x:50,y:30,w:3,h:14},{x:50,y:41,w:9,h:3},
    ]
  },
  {
    id: 'python', name: 'Python', lessons: 31, badge: { text: 'POPULYAR', cls: 'badge-hot' },
    desc: 'Dəyişənlərdən funksiyalara — Python ilə proqramlaşdırma.',
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
    desc: 'Veb səhifələri canlı et — interaktivlik və animasiyalar.',
    tabColor: '#e0a000', tabDark: '#c98900',
    letters: [
      {x:14,y:30,w:3,h:11},{x:17,y:41,w:2,h:2},{x:9,y:43,w:5,h:2},{x:8,y:41,w:2,h:2},
      {x:24,y:30,w:10,h:3},{x:24,y:33,w:3,h:4},{x:24,y:37,w:10,h:3},{x:31,y:40,w:3,h:4},{x:24,y:44,w:10,h:3},
    ]
  },
  {
    id: 'excel', name: 'Excel', lessons: 18, badge: null,
    desc: 'Cədvəllər, formullar və məlumat analizi.',
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

function FolderSVG({ tabColor, tabDark, letters }) {
  return (
    <svg className="folder-svg" viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="10" width="28" height="6" fill={tabDark}/>
      <rect x="2" y="8"  width="26" height="4" fill={tabColor}/>
      <rect x="2"  y="16" width="76" height="48" fill="#F4A600"/>
      <rect x="2"  y="60" width="76" height="4"  fill="#c98900"/>
      <rect x="74" y="16" width="4"  height="48" fill="#c98900"/>
      <rect x="4"  y="18" width="70" height="5"  fill="#FFD000" opacity=".22"/>
      <rect x="14" y="6"  width="18" height="26" fill="#ececec"/>
      <rect x="24" y="3"  width="18" height="26" fill="#ffffff"/>
      <rect x="27" y="8"  width="12" height="1"  fill="#ccc"/>
      <rect x="27" y="12" width="12" height="1"  fill="#ccc"/>
      <rect x="27" y="16" width="8"  height="1"  fill="#ccc"/>
      {letters.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#fff"/>)}
    </svg>
  );
}

export default function CoursesPage({ onCourseClick, onBack }) {
  return (
    <div className="cp-page">
      <button className="cp-back" onClick={onBack}>← Ana Səhifə</button>
      <p className="page-eyebrow">Bütün Kurslar</p>
      <h1 className="page-title">Hansı dili öyrənmək istəyirsən?</h1>
      <p className="page-sub">Hər kurs addım-addım dərslər, çalışmalar və yarışlarla doludur.</p>

      <div className="allcourses-grid">
        {COURSES.map(c => (
          <div
            key={c.id}
            className="allcourse-card"
            onClick={() => onCourseClick?.(c.id)}
            style={{ '--course-color': c.tabColor }}
          >
            <div className="allcourse-folder">
              <FolderSVG tabColor={c.tabColor} tabDark={c.tabDark} letters={c.letters}/>
            </div>
            <div className="allcourse-info">
              <div className="allcourse-top">
                <span className="allcourse-name">{c.name}</span>
                {c.badge && <span className={`badge ${c.badge.cls}`}>{c.badge.text}</span>}
              </div>
              <p className="allcourse-desc">{c.desc}</p>
              <div className="allcourse-meta">
                <span>📖 {c.lessons} dərs</span>
              </div>
            </div>
            <div className="allcourse-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}