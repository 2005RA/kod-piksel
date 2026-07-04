import { useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { subscribe, getSnapshot } from '../context/NotifContext';

const TOP_ITEMS = [
  { id: 'home',     emoji: '⌂',  tip: 'Ana Səhifə',      domId: 'sb-home'     },
  { id: 'notif',    emoji: '🔔', tip: 'Bildirişlər',      domId: 'sb-notif'    },
  { id: 'notebook', emoji: '🗂️', tip: 'Qeyd dəftəri',    domId: 'sb-notebook' },
  { id: 'puzzle',   emoji: '🧩', tip: 'Piksel tapmacası', domId: 'sb-puzzle'   },
  { id: 'course',   emoji: '▶️', tip: 'Davam et',         domId: 'sb-course'   },
];

function getActiveId(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/notebook')) return 'notebook';
  if (pathname.startsWith('/puzzle')) return 'puzzle';
  if (pathname.startsWith('/profil')) return 'profil';
  if (pathname.startsWith('/courses')) return 'course';
  return '';
}

export default function Sidebar({ onNav, onNotif, onSettings, hasNewPixel }) {
  const notifs    = useSyncExternalStore(subscribe, getSnapshot);
  const hasUnread = notifs.some(n => n.unread);
  const { pathname } = useLocation();
  const activePage = getActiveId(pathname);

  return (
    <nav className="left-sidebar">
      <button
        id="sb-home"
        className={`sb-logo-btn${activePage === 'home' ? ' active' : ''}`}
        data-tip="Ana Səhifə"
        onClick={() => onNav('home')}
        aria-label="Ana Səhifə"
      >
        &lt;&gt;
      </button>

      <div className="sb-divider" />

      {TOP_ITEMS.slice(1).map(item => (
        <button
          key={item.id}
          id={item.domId}
          className={`sb-icon${activePage === item.id ? ' active' : ''}${item.id === 'notif' && hasUnread ? ' has-unread' : ''}`}
          data-tip={item.tip}
          onClick={() => {
            if (item.id === 'notif') { onNotif(); return; }
            onNav(item.id);
          }}
          aria-label={item.tip}
        >
          {item.emoji}
          {item.id === 'notif'  && hasUnread    && <span className="sb-notif-dot" />}
          {item.id === 'puzzle' && hasNewPixel  && <span className="sb-puzzle-dot" />}
        </button>
      ))}

      <div className="sb-divider sb-divider--push" />

      <button id="sb-settings" className="sb-icon" data-tip="Ayarlar" onClick={onSettings} aria-label="Ayarlar">
        ⚙️
      </button>
      <button className={`sb-profile${activePage === 'profil' ? ' active' : ''}`} onClick={() => onNav('profil')} aria-label="Profil">
        👤
      </button>
    </nav>
  );
}