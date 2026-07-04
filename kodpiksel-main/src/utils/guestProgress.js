// src/utils/guestProgress.js
// Tracks a guest's rewards + completed lessons in localStorage until they
// create an account, at which point RewardContext merges this into their
// new profile and calls clearGuestProgress().

const KEY = 'kodpiksel_guest_progress';

export function loadGuestProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      rewards: {
        key:       parsed.rewards?.key       ?? 0,
        chip:      parsed.rewards?.chip      ?? 0,
        hourglass: parsed.rewards?.hourglass ?? 0,
      },
      completedTasks: Array.isArray(parsed.completedTasks) ? parsed.completedTasks : [],
    };
  } catch {
    return null;
  }
}

export function saveGuestProgress({ rewards, completedTasks }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      rewards: { key: rewards.key, chip: rewards.chip, hourglass: rewards.hourglass },
      completedTasks,
    }));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — guest progress
    // just won't persist across reloads, which is a safe degradation.
  }
}

export function clearGuestProgress() {
  localStorage.removeItem(KEY);
}
