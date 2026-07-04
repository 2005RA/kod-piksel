// src/components/GlobalLeaderboard.jsx
import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useCountdown, getWeekEnd } from '../hooks/useCountdown';
import { useRewards } from '../context/RewardContext';
import RewardTiersButton from './RewardTiersButton';
import { WEEKLY_REWARDS } from '../data/rewards';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function GlobalLeaderboard({ currentUserId }) {
  const { rows, me, loading, error } = useLeaderboard(currentUserId);
  const { checkWeeklyRewards } = useRewards();
  const [weekEnd] = useState(() => getWeekEnd());
  const timeLeft = useCountdown(weekEnd, checkWeeklyRewards);

  return (
    <div className="gl-leaderboard">
      <div className="rank-header">
        🏅 Sıralama (Bu həftə)
        {timeLeft && <span className="rank-countdown">⏳ {timeLeft}</span>}
        <RewardTiersButton tiers={WEEKLY_REWARDS} />
      </div>

      <div className="rank-list">
        {loading && <div className="rank-empty">Yüklənir…</div>}
        {error   && <div className="rank-empty" style={{ color: 'var(--error, #e44d26)' }}>Xəta: {error}</div>}
        {!loading && !error && rows.length === 0 && (
          <div className="rank-empty">Hələ nəticə yoxdur.</div>
        )}
        {!loading && rows.map((row, i) => {
          const isMe = row.id === currentUserId;
          return (
            <div
              key={row.id}
              className={`rank-row${i < 3 ? ' rank-top' : ''}${isMe ? ' rank-me' : ''}`}
            >
              <span className="rank-pos">
                {i < 3 ? MEDAL[i] : <span className="rank-num">{i + 1}</span>}
              </span>
              <span className="rank-avatar">{row.avatar_emoji ?? '🐣'}</span>
              <span className="rank-name">
                {row.username ?? 'İstifadəçi'}
                {isMe && <span className="rl-you-badge">sən</span>}
              </span>
              <span className="rank-chips">🖥️ {row.chips}</span>
            </div>
          );
        })}

        {!loading && !error && me && me.rank === null && me.chips === 0 && (
          <div className="rank-empty" style={{ marginTop: 8 }}>
            Bu həftə hələ çip qazanmamısan.
          </div>
        )}
        {!loading && !error && me && me.rank !== null && me.rank > rows.length && (
          <div className="rank-your-rank">
            Sənin yerin: <strong>#{me.rank}</strong> — 🖥️ {me.chips}
          </div>
        )}
      </div>
    </div>
  );
}