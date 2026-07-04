// src/utils/raceScore.js
// Computes score and char_count before inserting into race_results

/**
 * @param {Object} race   - race object from RACES
 * @param {number} elapsed - seconds taken
 * @param {string} code   - final submitted code (for golf)
 * @returns {{ score: number, char_count: number|null }}
 */
export function computeRaceResult(race, elapsed, code = '') {
  // Match the whitespace-stripped count shown live in <CharCounter> during the race.
  const charCount = code.replace(/\s/g, '').length;

  switch (race.type) {
    case 'speed':
    case 'bughunt':
      return { score: race.timeLimit - elapsed, char_count: null };

    case 'timed':
    case 'blind':
    case 'reverse':
      return { score: race.timeLimit - elapsed, char_count: null };

    case 'golf':
      return {
        score: race.charLimit - charCount,   // higher = shorter code = better
        char_count: charCount,
      };

    default:
      return { score: 0, char_count: null };
  }
}
