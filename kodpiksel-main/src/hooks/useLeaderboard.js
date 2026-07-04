// src/hooks/useLeaderboard.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ── GLOBAL LEADERBOARD ────────────────────────────────────
export function useLeaderboard(currentUserId) {
  const [rows, setRows]       = useState([]);
  const [me, setMe]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const since = new Date(Date.now() - 7 * 864e5).toISOString();

        const { data, error } = await supabase
          .from('chip_events')
          .select('user_id, amount, profiles(username, avatar_emoji, level)')
          .gte('created_at', since);

        if (error) throw error;

        const map = {};
        for (const row of data ?? []) {
          if (!map[row.user_id]) {
            map[row.user_id] = {
              id: row.user_id,
              username:     row.profiles?.username,
              avatar_emoji: row.profiles?.avatar_emoji,
              level:        row.profiles?.level,
              chips:        0,
            };
          }
          map[row.user_id].chips += row.amount ?? 0;
        }

        const sorted = Object.values(map)
          .filter(r => r.chips > 0)
          .sort((a, b) => b.chips - a.chips);

        const top20 = sorted.slice(0, 20);

        if (!cancelled) {
          setRows(top20);
          if (currentUserId) {
            const idx = sorted.findIndex(r => r.id === currentUserId);
            if (idx >= 0) {
              setMe({ chips: sorted[idx].chips, rank: idx + 1 });
            } else {
              setMe({ chips: 0, rank: null });
            }
          } else {
            setMe(null);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    window.addEventListener('chips-updated', fetch);
    return () => {
      cancelled = true;
      window.removeEventListener('chips-updated', fetch);
    };
  }, [currentUserId]);

  return { rows, me, loading, error };
}

// ── PER-RACE LEADERBOARD ─────────────────────────────────
// Filters by ends_at so each "run" of a race has its own leaderboard.
export function useRaceLeaderboard(raceId, endsAt, raceType) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tick, setTick]       = useState(0);
  const refetch = () => setTick(t => t + 1);
  const isGolf = raceType === 'golf';

  useEffect(() => {
    if (!raceId || !endsAt) return;
    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('race_results')
          .select('id, user_id, time_taken, char_count, chips_earned, completed_at, profiles(username, avatar_emoji, level)')
          .eq('race_id', raceId)
          .eq('ends_at', new Date(endsAt).toISOString())
          .eq('completed', true)
          .order(isGolf ? 'char_count' : 'time_taken', { ascending: true })
          .order('completed_at', { ascending: true })
          .limit(50);

        if (error) throw error;

        const seen = new Set();
        const deduped = [];
        for (const row of data ?? []) {
          if (seen.has(row.user_id)) continue;
          seen.add(row.user_id);
          deduped.push(row);
        }

        if (!cancelled) setRows(deduped);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [raceId, endsAt, tick, isGolf]);

  return { rows, loading, error, refetch };
}