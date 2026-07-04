// src/storage.js
// ─────────────────────────────────────────────────────────────
// Single file for ALL app persistence via localStorage.
// Import the helpers you need anywhere in the app.
// ─────────────────────────────────────────────────────────────

const PREFIX = 'kodpiksel_';
const key    = (k) => `${PREFIX}${k}`;

function load(k, fallback) {
  try {
    const raw = localStorage.getItem(key(k));
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(k, val) {
  try { localStorage.setItem(key(k), JSON.stringify(val)); } catch {}
}

function remove(k) {
  localStorage.removeItem(key(k));
}

// ─── NOTEBOOK ────────────────────────────────────────────────
// pages: [{ id, label, canvasImgData, objects: [...] }]
// droppedNoteIds: string[]   (note ids that were dragged to a page)

export const notebookStorage = {
  loadPages:         ()  => load('nb_pages', [{ id: 'p1', label: 'Səhifə 1', canvasImgData: null, objects: [] }]),
  savePages:         (v) => save('nb_pages', v),

  loadDroppedIds:    ()  => load('nb_dropped_ids', []),
  saveDroppedIds:    (v) => save('nb_dropped_ids', [...v]),   // Set → Array
};

// ─── HIGHLIGHTS (Qaralamalar) ─────────────────────────────────
// highlights: [{ id, text, source, color }]

export const highlightStorage = {
  load:  ()  => load('highlights', []),
  save:  (v) => save('highlights', v),
};

// ─── REWARDS ─────────────────────────────────────────────────
// rewards: { key: number, chip: number, level: number, hourglass: number }

export const rewardStorage = {
  load:  ()  => load('rewards', { key: 0, chip: 0, level: 1, hourglass: 30 }),
  save:  (v) => save('rewards', v),
};

// ─── USER SETTINGS ───────────────────────────────────────────

export const settingsStorage = {
  load:  ()  => load('settings', {
    notifRace: true, notifCourse: true, notifSys: false,
    rain: true, typewriter: true,
  }),
  save:  (v) => save('settings', v),
};

// // ─── NOTEBOOK COVER ──────────────────────────────────────────

// export const coverStorage = {
//   load:  ()  => load('nb_cover', { themeIdx: 0, decoIdx: 0, title: 'Mənim Dəftərim' }),
//   save:  (v) => save('nb_cover', v),
// };

// ─── GENERIC HELPERS (for anything else) ─────────────────────

export const storage = { load, save, remove };