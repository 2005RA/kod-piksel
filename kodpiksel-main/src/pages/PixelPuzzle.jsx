// src/pages/PixelPuzzle.jsx

import { useEffect, useRef } from 'react';
import { usePuzzle }         from '../context/PuzzleContext';
import { useRewards }        from '../context/RewardContext';

// ── PIXEL BOARD ──────────────────────────────────────────────────────────────
function PixelBoard({ boardTarget, revealed }) {
  const total    = boardTarget.length;
  const done     = revealed.size;
  const pct      = Math.round((done / total) * 100);

  return (
    <div className="pp-board-wrap">
      <div className="pp-board-label">
        <span>// PİKSEL LÖVHƏSI</span>
        <span className="pp-board-pct">{pct}% tamamlandı</span>
      </div>

      <div className="pp-board">
        {boardTarget.map((cell, i) => (
          <div
            key={i}
            className={`pp-cell${revealed.has(i) ? ' revealed' : ' hidden'}`}
            style={revealed.has(i) ? { background: cell.color } : {}}
          />
        ))}
      </div>

      {done === total && (
        <div className="pp-complete">
          🎉 Lövhə tamamlandı! Yeni piksel lövhəsi tezliklə gəlir.
        </div>
      )}
    </div>
  );
}

// ── BUBBLE SHOP ──────────────────────────────────────────────────────────────
function BubbleShop({ bubbles, repeated, onClaim }) {
  return (
    <div className="pp-shop">
      <div className="pp-shop-label">// BALON MAĞAZASI</div>
      <div className="pp-repeated-count">
        <span className="pp-rep-icon">🔁</span>
        <span>Təkrar piksellərin:</span>
        <span className="pp-rep-num">{repeated}</span>
      </div>

      <div className="pp-bubbles">
        {bubbles.map(b => {
          const canAfford = repeated >= b.cost;
          return (
            <div
              key={b.id}
              className={`pp-bubble${canAfford ? ' can-afford' : ' cant-afford'}`}
              style={{ '--bubble-color': b.color }}
            >
              <div className="pp-bubble-emoji">{b.emoji}</div>
              <div className="pp-bubble-name">{b.label}</div>
              <div className="pp-bubble-cost">
                <span className="pp-cost-num">{b.cost}</span>
                <span className="pp-cost-label"> təkrar piksel</span>
              </div>
              <div className="pp-bubble-rewards">
                {b.rewards.map((r, i) => (
                  <span key={i} className="pp-reward-chip">
                    {r.type === 'key'       && `🗝️ ×${r.amount}`}
                    {r.type === 'chip'      && `🖥️ ×${r.amount}`}
                    {r.type === 'hourglass' && `⏳ ×${r.amount}`}
                    {r.type === 'level'     && `⭐ ×${r.amount}`}
                  </span>
                ))}
              </div>
              <button
                className="pp-bubble-btn"
                disabled={!canAfford}
                onClick={() => onClaim(b.id)}
                style={{ background: canAfford ? b.color : undefined }}
              >
                {canAfford ? 'Al' : `${b.cost - repeated} çatışmır`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PixelPuzzle() {
  const { revealed, repeated, bubbles, boardTarget,
          earnPixel, claimBubble, clearNewPixel } = usePuzzle();
  const { addReward } = useRewards();
  const testBtnRef = useRef(null);

  // Clear red dot when page opens
  useEffect(() => { clearNewPixel(); }, [clearNewPixel]);

  function handleClaim(bubbleId) {
    const ok = claimBubble(bubbleId, addReward);
    if (!ok) return;
    // Fly all rewards to their icons
    const b = bubbles.find(b => b.id === bubbleId);
    b?.rewards.forEach(r => {
      setTimeout(() => {
        flyRewardByType(r.type);
      }, 80);
    });
  }

  function flyRewardByType(type) {
    const MAP = { key: 'pill-key', chip: 'pill-chip', hourglass: 'pill-hourglass', level: 'pill-level' };
    const targetId = MAP[type];
    if (!targetId) return;
    import('../components/RewardFly').then(({ flyReward }) => {
      flyReward({ emoji: type === 'key' ? '🗝️' : type === 'chip' ? '🖥️' : type === 'hourglass' ? '⏳' : '⭐', targetId });
    });
  }

  return (
    <div className="pp-wrapper">
      <div className="pp-header">
        <p className="page-eyebrow">Piksel Tapmacası</p>
        <h1 className="page-title">Piksel Lövhəni Tamamla</h1>
        <p className="page-sub">
          Dərslərdən, yarışlardan və oyunlardan piksel qazanırsan.
          Hər piksel lövhədəki öz yerinə uçur. Təkrar pikselləri
          balonlarla mükafata çevir!
        </p>
      </div>

      <div className="pp-layout">
        <PixelBoard boardTarget={boardTarget} revealed={revealed} />
        <BubbleShop bubbles={bubbles} repeated={repeated} onClaim={handleClaim} />
      </div>

      {/* TEST BUTTON — remove when real pixel earning is wired up */}
      <button
        ref={testBtnRef}
        className="pp-test-btn"
        onClick={() => earnPixel({ fromEl: testBtnRef.current })}
      >
        🧪 Test: Piksel qazandır
      </button>
    </div>
  );
}