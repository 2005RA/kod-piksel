// src/components/RaceLeaderboard.jsx
import { useEffect } from 'react';
import { useRaceLeaderboard } from '../hooks/useLeaderboard';
import { useCountdown } from '../hooks/useCountdown';
import RewardTiersButton from './RewardTiersButton';
import { RACE_END_REWARDS } from '../data/rewards';
import { useRewards } from '../context/RewardContext';

const MEDAL = ['🥇', '🥈', '🥉'];

function formatScore(row, isGolf) {
  if (isGolf) {
    return row.char_count != null ? `${row.char_count} simvol` : '';
  }
  if (row.time_taken != null) {
    const m = Math.floor(row.time_taken / 60);
    const s = row.time_taken % 60;
    return `${m > 0 ? m + 'd ' : ''}${s}s`;
  }
  return '';
}

export default function RaceLeaderboard({ race, currentUserId, refetchOnMount }) {
  const isGolf = race?.type === 'golf';
  const { rows, loading, error, refetch } = useRaceLeaderboard(race?.id, race?.endsAt, race?.type);
  const userRank = rows.findIndex(r => r.user_id === currentUserId) + 1;
  const { checkRaceRewards } = useRewards();
  const timeLeft = useCountdown(race?.endsAt, checkRaceRewards);

  useEffect(() => {
    if (refetchOnMount) setTimeout(refetch, 800);
  }, [refetchOnMount]);

  if (!race) return null;

  return (
    <div className="rl-leaderboard">
      <div className="rl-header">
        <span>{race.icon}</span>
        <span>{race.title} — Sıralama</span>
        {timeLeft && <span className="rl-countdown">⏳ {timeLeft}</span>}
        <RewardTiersButton tiers={RACE_END_REWARDS} />
      </div>

      {loading && <div className="rl-empty">Yüklənir…</div>}
      {error && <div className="rl-empty" style={{ color: 'var(--error, #e44d26)' }}>Xəta: {error}</div>}

      {!loading && !error && rows.length === 0 && (
        <div className="rl-empty">Hələ heç kim tamamlamamış.</div>
      )}

      {!loading && rows.length > 0 && (
        <>
          {userRank > 0 && (
            <div className="rl-your-rank">
              Sənin yerin: <strong>#{userRank}</strong>
            </div>
          )}
          <div className="rl-list">
            {rows.map((row, i) => {
              const isMe = row.user_id === currentUserId;
              return (
                <div key={row.id} className={`rl-row${i < 3 ? ' rl-top' : ''}${isMe ? ' rl-me' : ''}`}>
                  <span className="rl-pos">
                    {i < 3 ? MEDAL[i] : <span className="rl-num">{i + 1}</span>}
                  </span>
                  <span className="rl-avatar">{row.profiles?.avatar_emoji ?? '🐣'}</span>
                  <span className="rl-name">
                    {row.profiles?.username ?? 'İstifadəçi'}
                    {isMe && <span className="rl-you-badge"> sən</span>}
                  </span>
                  <span className="rl-score">{formatScore(row, isGolf)}</span>
                  <span className="rl-chips">+{row.chips_earned}🖥️</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
