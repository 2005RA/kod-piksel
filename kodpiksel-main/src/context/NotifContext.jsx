// src/context/NotifContext.jsx
import { createContext, useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import { useAuth } from './AuthContext';

const NotifContext = createContext(null);

// ── Module-level store ──────────────────────────────────────────────────────
let _notifs = [];
const _listeners = new Set();

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function getSnapshot() {
  return _notifs;
}

function fire() {
  _notifs = [..._notifs];
  _listeners.forEach(fn => fn());
}

export function addNotifGlobal({ msg, type = 'info' }) {
  // console.log('📬 addNotifGlobal called with:', msg);
  const id   = Date.now() + Math.random();
  const time = 'İndi';
  _notifs = [{ id, msg, type, time, unread: true }, ..._notifs];
  _listeners.forEach(fn => fn());
}

export function markAllGlobal() {
  _notifs = _notifs.map(n => ({ ...n, unread: false }));
  fire();
}

export function readOneGlobal(id) {
  _notifs = _notifs.map(n => n.id === id ? { ...n, unread: false } : n);
  fire();
}

// Clears the notification feed. Needed because _notifs is a module-level
// singleton — without this, logging out and logging into a different
// account (no page reload) leaves the previous user's notifications visible.
export function resetNotifsGlobal() {
  _notifs = [];
  fire();
}

// ── Provider (for components that use useNotif()) ───────────────────────────
export function NotifProvider({ children }) {
  const notifs     = useSyncExternalStore(subscribe, getSnapshot);
  const hasUnread  = notifs.some(n => n.unread);
  const { user } = useAuth();
  const prevUserIdRef = useRef(undefined); // undefined = not yet initialized

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      return;
    }
    if (prevUserIdRef.current === currentUserId) return;
    prevUserIdRef.current = currentUserId;
    resetNotifsGlobal();
  }, [user]);

  return (
    <NotifContext.Provider value={{
      notifs,
      hasUnread,
      addNotif:  addNotifGlobal,
      markAll:   markAllGlobal,
      readOne:   readOneGlobal,
    }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotif() {
  return useContext(NotifContext);
}