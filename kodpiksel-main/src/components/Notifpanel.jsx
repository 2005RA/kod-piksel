// src/components/NotifPanel.jsx
import { useSyncExternalStore } from 'react';

// Access the module-level store from NotifContext directly
let _notifs_ref = null;
let _subscribe_ref = null;
let _getSnapshot_ref = null;

// We'll use a different approach: subscribe to the same external store
// by importing the subscribe/getSnapshot functions

import { subscribe, getSnapshot, markAllGlobal, readOneGlobal } from '../context/NotifContext';

export default function NotifPanel({ open, onClose }) {
  const notifs = useSyncExternalStore(subscribe, getSnapshot);
  const hasUnread = notifs.some(n => n.unread);

  return (
    <>
      <div
        id="notif-overlay"
        className={open ? 'open' : ''}
        onClick={onClose}
      />
      <div id="notif-panel" className={open ? 'open' : ''}>
        <div className="notif-panel-head">
          <span className="notif-panel-title">// Bildirişlər</span>
          <button className="notif-close" onClick={onClose}>✕</button>
        </div>
        <div className="notif-list">
          {notifs.length === 0
            ? <div className="notif-empty">Hələ bildiriş yoxdur.</div>
            : notifs.map(n => (
                <div
                  key={n.id}
                  className={`notif-item${n.unread ? ' unread' : ''}`}
                  onClick={() => readOneGlobal(n.id)}
                >
                  <div className="notif-dot" />
                  <div className="notif-body">
                    <div className="notif-msg">{n.msg}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))
          }
        </div>
        {notifs.length > 0 && (
          <div className="notif-mark-all">
            <button onClick={markAllGlobal} disabled={!hasUnread}>
              Hamısını oxunmuş say
            </button>
          </div>
        )}
      </div>
    </>
  );
}