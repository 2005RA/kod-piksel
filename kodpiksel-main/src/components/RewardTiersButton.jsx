// src/components/RewardTiersButton.jsx
import { useState, useRef, useEffect } from 'react';

// `tiers` = array of { minRank, maxRank, keys, hourglasses, pixels }
// from src/data/rewards.js (RACE_END_REWARDS or WEEKLY_REWARDS)
export default function RewardTiersButton({ tiers }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function rankLabel(t) {
    if (t.minRank === t.maxRank) return `#${t.minRank}`;
    if (t.maxRank === Infinity) return `#${t.minRank}+`;
    return `#${t.minRank}–${t.maxRank}`;
  }

  return (
    <div className="reward-tiers-wrap" ref={wrapRef}>
      <button
        className="reward-tiers-btn"
        onClick={() => setOpen(o => !o)}
        title="Mükafatlara bax"
        type="button"
      >
        🎁
      </button>

      {open && (
        <div className="reward-tiers-popover">
          <div className="reward-tiers-title">Mükafatlar</div>
          <table className="reward-tiers-table">
            <tbody>
              {tiers.map((t, i) => (
                <tr key={i}>
                  <td className="reward-tiers-rank">{rankLabel(t)}</td>
                  <td className="reward-tiers-cell">
                    {t.keys > 0        && <span>{t.keys}🗝️</span>}
                    {t.hourglasses > 0 && <span>{t.hourglasses}⏳</span>}
                    {t.pixels > 0      && <span>{t.pixels}🧩</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}