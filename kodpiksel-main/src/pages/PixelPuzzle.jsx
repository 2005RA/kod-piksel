// src/pages/PixelPuzzle.jsx

import { useEffect, useRef, useState } from 'react';
import { usePuzzle }         from '../context/PuzzleContext';
import { useRewards }        from '../context/RewardContext';
import { PUZZLE_GRAND_REWARD } from '../data/rewards';

// ── PAGE HEADER WITH HELP POPOVER ───────────────────────────────────────────
function PageHeader() {
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setShowHelp(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="pp-header">
      <div className="pp-title-row" ref={helpRef}>
        <p className="page-eyebrow">Piksel Tapmacası</p>
        <button
          type="button"
          className="pp-help-btn"
          onClick={() => setShowHelp(v => !v)}
          aria-label="Məlumat"
        >
          ?
        </button>
        {showHelp && (
          <div className="pp-help-popover">
            Dərslərdən, yarışlardan və oyunlardan piksel qazanırsan — hər biri
            lövhədə öz yerinə uçur. Artıq qazandığın pikselləri isə balon
            mağazasında hədiyyələrə çevir!
          </div>
        )}
      </div>
    </div>
  );
}

// ── GRAND REWARD BANNER ───────────────────────────────────────────────────────
function GrandRewardBanner() {
  const { chips, keys, hourglasses } = PUZZLE_GRAND_REWARD;
  return (
    <div className="pp-grand-banner">
      <div className="pp-grand-icon">🏆</div>
      <div className="pp-grand-copy">
        <div className="pp-grand-title">Lövhəni tamamla, nəhəng bonusu qazan!</div>
        <div className="pp-grand-sub">64 pikselin hamısı yerini tapanda bu böyük hədiyyə sənindir.</div>
      </div>
      <div className="pp-grand-rewards">
        <span className="pp-grand-reward">
          <span className="pp-grand-emoji">🖥️</span>
          <span className="pp-grand-amount">×{chips}</span>
        </span>
        <span className="pp-grand-reward">
          <span className="pp-grand-emoji">🗝️</span>
          <span className="pp-grand-amount">×{keys}</span>
        </span>
        <span className="pp-grand-reward">
          <span className="pp-grand-emoji">⏳</span>
          <span className="pp-grand-amount">×{hourglasses}</span>
        </span>
      </div>
    </div>
  );
}

// ── PIXEL BOARD ──────────────────────────────────────────────────────────────
function PixelBoard({ boardTarget, revealed }) {
  const total    = boardTarget.length;
  const done     = revealed.size;
  const pct      = Math.round((done / total) * 100);

  return (
    <div className="pp-board-card">
      <div className="pp-board-label">
        <span>// PİKSEL LÖVHƏSI</span>
        <span className="pp-board-pct">{pct}% tamamlandı</span>
      </div>

      <div className="pp-progress-track">
        <div className="pp-progress-fill" style={{ width: `${pct}%` }} />
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
    <div className="pp-shop-card">
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
              <div className="pp-bubble-top">
                <div className="pp-bubble-emoji">{b.emoji}</div>
                <div>
                  <div className="pp-bubble-name">{b.label}</div>
                  <div className="pp-bubble-cost">
                    <span className="pp-cost-num">{b.cost}</span>
                    <span className="pp-cost-label"> təkrar piksel</span>
                  </div>
                </div>
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

  useEffect(() => { clearNewPixel(); }, [clearNewPixel]);

  function handleClaim(bubbleId) {
    const ok = claimBubble(bubbleId, addReward);
    if (!ok) return;
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
      <PageHeader />

      <GrandRewardBanner />

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