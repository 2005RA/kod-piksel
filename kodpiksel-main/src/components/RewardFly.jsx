// src/components/RewardFly.jsx
// Usage from anywhere:
//   import { flyReward } from './components/RewardFly';
//   flyReward({ emoji: '🗝️', targetId: 'pill-key', fromEl: chestButtonRef.current });
//   flyReward({ emoji: '🖥️', targetId: 'pill-chip', x: 400, y: 300 }); // or raw coords
//
// Sticker special case → targetId: 'sb-notebook' (goes to sidebar notebook icon)
// No React component needed — pure DOM so it works called from anywhere.

const TARGETS = {
  key:       'pill-key',
  chip:      'pill-chip',
  level:     'pill-level',
  hourglass: 'pill-hourglass',
  sticker:   'sb-notebook',
  pixel:     'sb-puzzle',     // sidebar puzzle icon
};

/**
 * flyReward({ type?, emoji, targetId?, fromEl?, x?, y? })
 *
 * type     → shorthand: 'key' | 'chip' | 'level' | 'hourglass' | 'sticker'
 * emoji    → override emoji (optional if type is set, required otherwise)
 * targetId → override target element id (optional if type is set)
 * fromEl   → DOM element to fly from (its center is used)
 * x, y     → raw page coordinates to fly from (alternative to fromEl)
 */
export function flyReward({ type, emoji, targetId, fromEl, x, y }) {
  // Resolve emoji + target from type shorthand
  const EMOJIS = { key: '🗝️', chip: '🖥️', level: '⭐', hourglass: '⏳', sticker: '🗒️', pixel: '🧩' };
  const resolvedEmoji    = emoji    ?? EMOJIS[type]   ?? '✨';
  const resolvedTargetId = targetId ?? TARGETS[type]  ?? 'pill-key';

  const targetEl = document.getElementById(resolvedTargetId);
  if (!targetEl) return;

  // Source coords
  let startX, startY;
  if (fromEl) {
    const r = fromEl.getBoundingClientRect();
    startX = r.left + r.width  / 2;
    startY = r.top  + r.height / 2;
  } else {
    startX = x ?? window.innerWidth  / 2;
    startY = y ?? window.innerHeight / 2;
  }

  // Target coords
  const tr = targetEl.getBoundingClientRect();
  const endX = tr.left + tr.width  / 2;
  const endY = tr.top  + tr.height / 2;

  // Build the flying element
  const el = document.createElement('div');
  el.textContent = resolvedEmoji;
  Object.assign(el.style, {
    position:      'fixed',
    left:          `${startX}px`,
    top:           `${startY}px`,
    fontSize:      '1.6rem',
    pointerEvents: 'none',
    zIndex:        '9999',
    transform:     'translate(-50%, -50%) scale(1)',
    transition:    'left .55s cubic-bezier(.4,0,.2,1), top .55s cubic-bezier(.4,0,.2,1), transform .55s, opacity .2s',
    opacity:       '1',
  });
  document.body.appendChild(el);

  // Spawn pop effect
  requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%, -50%) scale(1.4)';

    // Fly to target after one frame
    requestAnimationFrame(() => {
      el.style.left      = `${endX}px`;
      el.style.top       = `${endY}px`;
      el.style.transform = 'translate(-50%, -50%) scale(0.4)';
    });
  });

  // Target pulse on arrival
  setTimeout(() => {
    targetEl.classList.add('pill-pulse');
    setTimeout(() => targetEl.classList.remove('pill-pulse'), 400);
  }, 560);

  // Clean up
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 200);
  }, 520);
}

// Convenience wrappers — import these directly if you prefer
export const flyKey       = (fromEl) => flyReward({ type: 'key',       fromEl });
export const flyChip      = (fromEl) => flyReward({ type: 'chip',      fromEl });
export const flyLevel     = (fromEl) => flyReward({ type: 'level',     fromEl });
export const flyHourglass = (fromEl) => flyReward({ type: 'hourglass', fromEl });
export const flySticker   = (fromEl) => flyReward({ type: 'sticker',   fromEl });