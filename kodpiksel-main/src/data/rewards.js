// src/data/rewards.js
// Reward tiers for race-end and weekly-end payouts.
// "pixels" here means earnPixel() calls — random, mix of new/repeated.

export const RACE_END_REWARDS = [
  { minRank: 1,  maxRank: 3,        keys: 5, hourglasses: 3, pixels: 2 },
  { minRank: 4,  maxRank: 10,       keys: 3, hourglasses: 1, pixels: 2 },
  { minRank: 11, maxRank: Infinity, keys: 1, hourglasses: 0, pixels: 1 },
];

export const WEEKLY_REWARDS = [
  { minRank: 1,  maxRank: 1,        keys: 10, hourglasses: 8, pixels: 5 },
  { minRank: 2,  maxRank: 2,        keys: 8,  hourglasses: 6, pixels: 4 },
  { minRank: 3,  maxRank: 3,        keys: 5,  hourglasses: 3, pixels: 3 },
  { minRank: 4,  maxRank: 10,       keys: 3,  hourglasses: 1, pixels: 2 },
  { minRank: 11, maxRank: Infinity, keys: 1,  hourglasses: 0, pixels: 1 },
];

export function getRewardForRank(tiers, rank) {
  return tiers.find(t => rank >= t.minRank && rank <= t.maxRank) ?? null;
}

// Granted once when a player fills every cell on the pixel puzzle board.
// PUZZLE_ID should bump (e.g. 'puzzle-grand-2') whenever the board art changes,
// so a new board can be claimed again — see PuzzleContext.BOARD_TARGET.
export const PUZZLE_ID = 'puzzle-grand-1';
export const PUZZLE_GRAND_REWARD = { chips: 50, keys: 50, hourglasses: 50 };