// src/pages/ChallengePage.jsx
// Props: { courseId, challengeId, totalChallenges, challenges, onBack, onNavigate }
// Like LessonPage but no İzahat panel — only task + editor + preview.

import { useState, useRef, useEffect } from 'react';
import { useRewards } from '../context/RewardContext';
import { usePuzzle  } from '../context/PuzzleContext';
import { flyReward  } from '../components/RewardFly';

// ── BINARY RAIN ───────────────────────────────────────────
function BinaryRain({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [active, onDone]);

  if (!active) return null;
  const colors = ['#a78bfa','#3A86FF','#4cae50','#f45050','#f4c84a','#00D4AA'];
  return (
    <div className="binary-rain">
      {Array.from({ length: 90 }).map((_, i) => (
        <span key={i} style={{
          left:              `${Math.random()*100}vw`,
          color:             colors[Math.floor(Math.random()*colors.length)],
          fontSize:          `${14+Math.random()*16}px`,
          animationDuration: `${1.4+Math.random()*1.6}s`,
          animationDelay:    `${Math.random()*0.6}s`,
        }}>
          {Math.random()<0.5?'0':'1'}
        </span>
      ))}
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast show">{msg}</div>;
}

// ── REWARD BADGE ROW ──────────────────────────────────────
// Shows what this challenge gives before the student starts
function RewardBadges({ challenge }) {
  const badges = [
    challenge.chips       > 0 && { emoji: '🖥️', val: `×${challenge.chips}`       },
    challenge.keys        > 0 && { emoji: '🗝️', val: `×${challenge.keys}`        },
    challenge.hourglasses > 0 && { emoji: '⏳', val: `×${challenge.hourglasses}` },
    challenge.pixels      > 0 && { emoji: '🧩', val: `×${challenge.pixels}`      },
  ].filter(Boolean);

  if (badges.length === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
      {badges.map((b, i) => (
        <span key={i} style={{
          fontSize: '0.72rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--teal)',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          {b.emoji} {b.val}
        </span>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────
export default function ChallengePage({ courseId, challengeId, totalChallenges, challenges, onBack, onNavigate }) {
  const { addChips, addReward, completedTasks }  = useRewards();
  const { earnPixel }            = usePuzzle();

  const challenge = challenges[challengeId];

  const [code,      setCode]      = useState(challenge?.starter || '');
  const [toast,     setToast]     = useState('');
  const [error,     setError]     = useState('');
  const [rain,      setRain]      = useState(false);
  const [showNext,  setShowNext]  = useState(false);
  const [taskBounce, setTaskBounce] = useState(false);

  const iframeRef    = useRef(null);
  const taskRef      = useRef(null);
  const rewardRef    = useRef(null); // fly origin

  // Reset when challenge changes
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const c = challenges[challengeId];
    setCode(c?.starter || '');
    setError('');
    setShowNext(false);
    setRain(false);
    window.scrollTo(0, 0);
    if (iframeRef.current) iframeRef.current.srcdoc = '';
  }, [challengeId, challenges]);

  // Progress helpers — derived from the same completedTasks Set that backs
  // chip awards, so this is per-user (synced to Supabase) and correctly
  // resets on logout, instead of a separate localStorage key that used to
  // leak completion state between accounts on the same device.
  function getDone() {
    const prefix = `${courseId}-challenge-`;
    const ids = [];
    completedTasks.forEach(t => {
      if (t.startsWith(prefix)) {
        const id = Number(t.slice(prefix.length));
        if (!Number.isNaN(id)) ids.push(id);
      }
    });
    return ids;
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }

  const lines    = code.split('\n').length;
  const lineNums = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

  function handleRun() {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${code}</body></html>`;
    }
  }

  function handleCheck() {
    if (!challenge) return;
    if (iframeRef.current) {
      iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${code}</body></html>`;
    }
    if (!challenge.validate) { showToast('Bu çalışmanın yoxlaması hələ hazır deyil 🚧'); return; }

    const ok = challenge.validate(code);
    if (ok) {
      const taskId  = `${courseId}-challenge-${challengeId}`;
      const awarded = addChips(taskId, challenge.chips || 0);

      if (awarded) {
        // Fly chips
        if (challenge.chips > 0)
          flyReward({ type: 'chip', fromEl: rewardRef.current });

        // Keys — staggered
        if (challenge.keys > 0)
          setTimeout(() => flyReward({ type: 'key', fromEl: rewardRef.current }), 180);

        // Hourglasses
        if (challenge.hourglasses > 0)
          setTimeout(() => flyReward({ type: 'hourglass', fromEl: rewardRef.current }), 360);

        // Pixels — earn one per pixel reward
        if (challenge.pixels > 0) {
          for (let p = 0; p < challenge.pixels; p++) {
            setTimeout(() => earnPixel({ fromEl: rewardRef.current }), 500 + p * 150);
          }
        }

        // Add keys + hourglasses to reward state
        if (challenge.keys        > 0) addReward('key',       challenge.keys);
        if (challenge.hourglasses > 0) addReward('hourglass', challenge.hourglasses);
      }

      setError('');
      showToast(awarded ? 'Əla! Mükafatlar qazanıldı 🏆' : 'Artıq tamamlanıb! ✅');
      setRain(true);
      if (challengeId < totalChallenges) setShowNext(true);
    } else {
      setError(challenge.errorMsg || 'Kodda bir şey düz deyil. Tapşırığı yenidən oxu.');
    }
  }

  function handleReset() {
    setCode(challenge?.starter || '');
    if (iframeRef.current) iframeRef.current.srcdoc = '';
  }

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => showToast('Kopyalandı! 📋'));
  }

  if (!challenge) return (
    <div className="lp-wrapper">
      <p style={{ color: 'var(--muted)', padding: 40 }}>Çalışma tapılmadı.</p>
    </div>
  );

  return (
    <div className="lp-wrapper">
      <BinaryRain active={rain} onDone={() => setRain(false)} />
      <Toast msg={toast} />

      {/* ── NAV BAR ── */}
      <nav className="lp-nav">
        <button className="btn-back" onClick={onBack}>◀ GERİ</button>
        <div className="lesson-nav">
          <button disabled={challengeId <= 1}                onClick={() => onNavigate(challengeId - 1)}>◀</button>
          <span className="label">ÇALIŞMA {challengeId} / {totalChallenges}</span>
          <button disabled={challengeId >= totalChallenges}  onClick={() => onNavigate(challengeId + 1)}>▶</button>
        </div>
        <span className="tag-pill">{challenge.tag}</span>
        <span className="lesson-name">{challenge.title}</span>

        {/* Reward indicator — click origin for fly animations */}
        <div className="lp-chip-counter" ref={rewardRef}>
          🏆 <span>{getDone().length}</span> / {totalChallenges} TAMAMLANDI
        </div>
      </nav>

      {/* ── WORKSPACE ── */}
      <div className="workspace">

        {/* LEFT COL — task only, no İzahat */}
        <div className="left-col">
          <section className="panel">
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">📋 TAPŞIRIQ</span>
              <span className="spacer"/>
              <RewardBadges challenge={challenge} />
              <span className={`diff-pill diff-pill--nav`}>{challenge.difficulty}</span>
            </div>

            <div className="panel-body top-left-body">
              {/* Task */}
              <div ref={taskRef} className={`task-box task-box--challenge${taskBounce ? ' bounce' : ''}`}>
                <div className="task-text"
                  dangerouslySetInnerHTML={{ __html: challenge.taskHtml || '' }}
                />
              </div>
            </div>
          </section>

          {/* Code editor */}
          <section className="panel">
            <div className="panel-header">
              <span className="dots"><span className="dot-g"/></span>
              <span className="panel-title">KOD YAZIN (INDEX.HTML)</span>
              <span className="spacer"/>
              <button className="link-btn" onClick={handleCopy}>NÜSXƏLƏ</button>
            </div>
            <div className="editor-wrap">
              <div className="line-numbers">{lineNums}</div>
              <textarea
                className="code-input"
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="editor-actions">
              <button className="btn btn-reset" onClick={handleReset}>↺ SIFIRLA</button>
              <div className="btn-group">
                <button className="btn btn-run"   onClick={handleRun}>RUN</button>
                <button className="btn btn-check" onClick={handleCheck}>CAVABIMI YOXLA</button>
                {showNext && (
                  <button className="btn btn-next-lesson" onClick={() => onNavigate(challengeId + 1)}>
                    NÖVBƏTİ ÇALIŞMA ▶
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COL — live preview */}
        <div className="right-col">
          <section className="panel">
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">CANLI MONİTOR</span>
              <div className="url-bar">
                <span>pixel-browser://challanges.az/{challenge.urlPath}</span>
                <span>⤴</span>
              </div>
            </div>
            <div className="preview-area">
              <iframe ref={iframeRef} title="Canlı önizləmə" />
              <span className="watermark">PİKSEL BRAUZER V1</span>
            </div>
          </section>

          {error && (
            <section className="panel error-panel">
              <div className="panel-header">
                <div className="dots"><span className="dot-r"/><span className="dot-r"/><span className="dot-r"/></div>
                <span className="panel-title">⚠ XƏTA KONSOLU</span>
              </div>
              <div className="error-body">✗ {error}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}