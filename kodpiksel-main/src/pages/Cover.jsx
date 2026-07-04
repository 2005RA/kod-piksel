// // src/pages/Notebook/Cover.jsx
// // Customizable notebook cover — name, theme color, emoji decoration

// import { useState } from 'react';

// const THEMES = [
//   { id: 'teal',   bg: '#0a2a25', spine: '#00D4AA', accent: '#00D4AA' },
//   { id: 'purple', bg: '#1a1040', spine: '#a78bfa', accent: '#a78bfa' },
//   { id: 'amber',  bg: '#2a1a00', spine: '#F4A600', accent: '#F4A600' },
//   { id: 'red',    bg: '#2a0a0a', spine: '#f45050', accent: '#f45050' },
//   { id: 'blue',   bg: '#0a1a2a', spine: '#3A86FF', accent: '#3A86FF' },
// ];

// const DECOS = ['⭐','🚀','🔥','💎','🎯','⚡','🌀','👾','🎮','🦊'];

// export default function Cover({ onOpen }) {
//   const [title,     setTitle]     = useState('Mənim Dəftərim');
//   const [themeIdx,  setThemeIdx]  = useState(0);
//   const [deco,      setDeco]      = useState('⭐');
//   const [editing,   setEditing]   = useState(false);

//   const theme = THEMES[themeIdx];

//   return (
//     <div className="nb-cover-scene">
//       <div className="nb-cover" style={{ background: theme.bg, borderColor: theme.accent }}>

//         {/* Spine */}
//         <div className="nb-spine" style={{ background: theme.spine }} />

//         {/* Decoration picker */}
//         <div className="nb-cover-deco">{deco}</div>

//         {/* Title */}
//         {editing
//           ? <input
//               className="nb-cover-title-input"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               onBlur={() => setEditing(false)}
//               onKeyDown={e => e.key === 'Enter' && setEditing(false)}
//               autoFocus
//               maxLength={28}
//               style={{ borderColor: theme.accent }}
//             />
//           : <div
//               className="nb-cover-title"
//               style={{ color: theme.accent }}
//               onClick={() => setEditing(true)}
//               title="Ad dəyişmək üçün klik et"
//             >
//               {title}
//             </div>
//         }

//         <div className="nb-cover-sub" style={{ color: theme.spine + 'aa' }}>
//           // KodPiksel Qeyd Dəftəri
//         </div>

//         {/* Open button */}
//         <button
//           className="nb-open-btn"
//           style={{ background: theme.spine, color: '#0D1B2A' }}
//           onClick={onOpen}
//         >
//           Aç →
//         </button>

//         {/* Lines decoration */}
//         <div className="nb-cover-lines">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="nb-cover-line" style={{ background: theme.accent + '22' }} />
//           ))}
//         </div>
//       </div>

//       {/* Controls below cover */}
//       <div className="nb-cover-controls">
//         {/* Theme picker */}
//         <div className="nb-control-group">
//           <span className="nb-control-label">Rəng</span>
//           <div className="nb-theme-dots">
//             {THEMES.map((t, i) => (
//               <button
//                 key={t.id}
//                 className={`nb-theme-dot${themeIdx === i ? ' active' : ''}`}
//                 style={{ background: t.spine }}
//                 onClick={() => setThemeIdx(i)}
//                 aria-label={t.id}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Deco picker */}
//         <div className="nb-control-group">
//           <span className="nb-control-label">Bəzək</span>
//           <div className="nb-deco-grid">
//             {DECOS.map(d => (
//               <button
//                 key={d}
//                 className={`nb-deco-btn${deco === d ? ' active' : ''}`}
//                 onClick={() => setDeco(d)}
//               >
//                 {d}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }