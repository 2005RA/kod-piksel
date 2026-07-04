// src/utils/lastSession.js
// Tiny read/write helpers for "davam et" feature.
// Call saveSession() every time a lesson is opened.
// Call getSession() to resume.

const KEY = 'kodpiksel_last_session';

export function saveSession({ courseId, lessonId }) {
  localStorage.setItem(KEY, JSON.stringify({ courseId, lessonId, ts: Date.now() }));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}