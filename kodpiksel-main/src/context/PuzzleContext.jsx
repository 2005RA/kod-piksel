import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { flyReward } from '../components/RewardFly';
import { useAuth } from './AuthContext';
// ── 5×5 PIXEL ART BOARD ──────────────────────────────────────────────────────
// Each cell: { color: '#hex' } — the target picture.
// Change colors here to make a different pixel art. Currently: a small rocket 🚀
// Row-major order, top-left to bottom-right.
// Make sure everything above this line is completely closed off!

export const BOARD_TARGET = [
  // Row 1: Top loop of the key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 2: Hollow center of key head
  { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 3: Bottom loop of key head
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 4: Key shaft starts
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 5: Key shaft / first tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 6: Key shaft gap
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' },
  // Row 7: Second key tooth
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' },
  // Row 8: Key tip
  { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#F4A600' }, { color: '#F4A600' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }, { color: '#0D1B2A' }
];
// ─────────────────────────────────────────────────────────────────────────────

// ── BUBBLE REWARDS ────────────────────────────────────────────────────────────
export const BUBBLES = [
  {
    id:      'small',
    label:   '10 Piksel Balonu',
    cost:    10,
    emoji:   '🫧',
    rewards: [
      { type: 'key',  amount: 5 },
      { type: 'hourglass', amount: 3  },
    ],
    color:   '#00D4AA',
  },
  {
    id:      'medium',
    label:   '20 Piksel Balonu',
    cost:    20,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 8  },
      { type: 'hourglass', amount: 5 },
    ],
    color:   '#a78bfa',
  },
  {
    id:      'large',
    label:   '30 Piksel Balonu',
    cost:    30,
    emoji:   '🫧',
    rewards: [
      { type: 'key',       amount: 10  },
      { type: 'hourglass', amount: 8  },
    ],
    color:   '#F4A600',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const PuzzleContext = createContext(null);

export function PuzzleProvider({ children }) {
  const { user, profile, updateProfile } = useAuth();
  const [revealed,  setRevealed]  = useState(new Set());
  const [repeated,  setRepeated]  = useState(0);
  const [hasNewPixel, setHasNewPixel] = useState(false);
  const loadedRef = useRef(false);
  const skipPersistRef = useRef(false);
  const prevUserIdRef = useRef(undefined); // undefined = not yet initialized

  // Wipe local puzzle state when the logged-in identity changes (login,
  // logout, or switching accounts) — otherwise the previous user's
  // `revealed` set stays in state and the persist effect below overwrites
  // the newly-logged-in user's puzzle_state with it.
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      return;
    }
    if (prevUserIdRef.current === currentUserId) return;

    prevUserIdRef.current = currentUserId;
    skipPersistRef.current = true;
    loadedRef.current = false;
    setRevealed(new Set());
    setRepeated(0);
    setHasNewPixel(false);
  }, [user]);

  useEffect(() => {
    if (profile && !loadedRef.current) {
      const saved = profile.puzzle_state ?? { revealed: [], repeated: 0 };
      setRevealed(new Set(saved.revealed ?? []));
      setRepeated(saved.repeated ?? 0);
      loadedRef.current = true;
    }
  }, [profile]);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (skipPersistRef.current) { skipPersistRef.current = false; return; }
    updateProfile({
      puzzle_state: { revealed: Array.from(revealed), repeated },
      repeated_pixels: repeated,
    });
  }, [revealed, repeated]);

  const earnPixel = useCallback(({ fromEl, x, y } = {}) => {
    setRevealed(prev => {
      const totalPieces = 64;
      let pick;

      const unrevealedPieces = [];
      for (let i = 0; i < totalPieces; i++) {
        if (!prev.has(i)) unrevealedPieces.push(i);
      }

      if (unrevealedPieces.length > 0 && Math.random() < 0.60) {
        const randomUnrevealedIndex = Math.floor(Math.random() * unrevealedPieces.length);
        pick = unrevealedPieces[randomUnrevealedIndex];
      } else {
        pick = Math.floor(Math.random() * totalPieces);
      }

      if (prev.has(pick)) {
        setRepeated(r => r + 1);
        setHasNewPixel(true);
        flyReward({ type: 'pixel', fromEl, x, y });
        return prev;
      }

      const next = new Set(prev);
      next.add(pick);
      setHasNewPixel(true);
      flyReward({ type: 'pixel', fromEl, x, y });
      return next;
    });
  }, []);

  // Listen for 'earn-pixel' events dispatched by RewardContext when a
  // race-end or weekly-end reward includes pixels. Decouples PuzzleContext
  // from RewardContext (no circular import needed).
  useEffect(() => {
    function handler() { earnPixel(); }
    window.addEventListener('earn-pixel', handler);
    return () => window.removeEventListener('earn-pixel', handler);
  }, [earnPixel]);

  // Fire 'puzzle-complete' the moment the board goes from not-full to full.
  // RewardContext listens for this and grants the grand reward. Guarded by
  // firedCompleteRef so it only dispatches once per completion transition —
  // addChips() on the RewardContext side is what actually stops it from being
  // granted twice across reloads/relogins (same pattern as lessons/challenges).
  const firedCompleteRef = useRef(false);
  useEffect(() => {
    if (!loadedRef.current) return;
    const isFull = revealed.size >= BOARD_TARGET.length;
    if (isFull && !firedCompleteRef.current) {
      firedCompleteRef.current = true;
      window.dispatchEvent(new CustomEvent('puzzle-complete'));
    } else if (!isFull) {
      firedCompleteRef.current = false;
    }
  }, [revealed]);

  const claimBubble = useCallback((bubbleId, addReward) => {
    const bubble = BUBBLES.find(b => b.id === bubbleId);
    if (!bubble) return false;
    if (repeated < bubble.cost) return false;

    setRepeated(r => r - bubble.cost);
    bubble.rewards.forEach(r => addReward(r.type, r.amount));
    return true;
  }, [repeated]);

  const clearNewPixel = useCallback(() => setHasNewPixel(false), []);

  return (
    <PuzzleContext.Provider value={{
      revealed, repeated, hasNewPixel,
      earnPixel, claimBubble, clearNewPixel,
      boardTarget: BOARD_TARGET,
      bubbles:     BUBBLES,
    }}>
      {children}
    </PuzzleContext.Provider>
  );
}
export function usePuzzle() {
  return useContext(PuzzleContext);
}