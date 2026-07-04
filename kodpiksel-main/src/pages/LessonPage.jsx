// src/pages/LessonPage.jsx
// Props: { courseId, lessonId, totalLessons, lessons, lessonChips, onBack, onNavigate }
// onNavigate(newId) — called when prev/next is clicked

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRewards } from '../context/RewardContext';
import { flyReward  } from '../components/RewardFly';

// ── MARKER COLORS ────────────────────────────────────────
const MARKER_COLORS = [
  { id: 'yellow', color: '#FFE066', label: 'Sarı' },
  { id: 'teal',   color: '#00D4AA', label: 'Firuzəyi' },
  { id: 'purple', color: '#a78bfa', label: 'Bənövşəyi' },
  { id: 'red',    color: '#f45050', label: 'Qırmızı' },
];

// ── BINARY RAIN (success) ────────────────────────────────
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

// ── TOAST ────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast show">{msg}</div>;
}

// ── MAIN COMPONENT ───────────────────────────────────────
export default function LessonPage({ courseId, lessonId, totalLessons, lessons, lessonChips, onBack, onNavigate }) {
  const { addChips, completedTasks } = useRewards();
  const lesson = lessons[lessonId];

  const [code,         setCode]         = useState(lesson?.starter || '');
  const [toast,        setToast]        = useState('');
  const [error,        setError]        = useState('');
  const [rain,         setRain]         = useState(false);
  const [showNext,     setShowNext]     = useState(false);
  const [markerActive, setMarkerActive] = useState(false);
  const [markerColor,  setMarkerColor]  = useState(MARKER_COLORS[0]);
  const [taskBounce,   setTaskBounce]   = useState(false);
  const [panelBounce,  setPanelBounce]  = useState(false);

  const iframeRef   = useRef(null);
  const taskRef     = useRef(null);
  const explainRef  = useRef(null);
  const chipPillRef = useRef(null);
  const panelBodyRef = useRef(null);
  useEffect(() => {
    // Save 'course' so your App knows to resume the lesson page on next reload
    localStorage.setItem('lastLesson', 'course');
  }, []);
  // Reset when lesson changes
  useEffect(() => {
    // 1. Tell the browser to stop focusing on whatever it's tracking (like the old textarea/buttons)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const l = lessons[lessonId];
    setCode(l?.starter || '');
    setError('');
    setShowNext(false);
    setRain(false);
    setPanelBounce(true);
    
    // 2. Reset both the panel AND the global window just in case your CSS layout is causing the main page to scroll
    setTimeout(() => {
      if (panelBodyRef.current) {
        panelBodyRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }, 0);

    setTimeout(() => setPanelBounce(false), 650);
    if (iframeRef.current) iframeRef.current.srcdoc = '';
  }, [lessonId, lessons]);

  // Progress helpers — derived from the same completedTasks Set that backs
  // chip awards, so this is per-user (synced to Supabase) and correctly
  // resets on logout, instead of a separate localStorage key that used to
  // leak completion state between accounts on the same device.
  function getDone() {
    const prefix = `${courseId}-lesson-`;
    const ids = [];
    completedTasks.forEach(t => {
      if (t.startsWith(prefix)) {
        const id = Number(t.slice(prefix.length));
        if (!Number.isNaN(id)) ids.push(id);
      }
    });
    return ids;
  }

  // Toast helper
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  // Line numbers
  const lines = code.split('\n').length;
  const lineNums = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

  // Actions
  function handleRun() {
if (iframeRef.current) iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head>${code}</html>`;
  }

  function handleCheck() {
    if (!lesson || lesson.locked) return;
if (iframeRef.current) iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head>${code}</html>`;
    if (!lesson.validate) { showToast('Bu dərsin yoxlaması hələ hazır deyil 🚧'); return; }

    const ok = lesson.validate(code);
    if (ok) {
      const chips  = lessonChips[lessonId] || 1;
const taskId = `${courseId}-lesson-${lessonId}`;
const awarded = addChips(taskId, chips);
if (awarded) flyReward({ type: 'chip', fromEl: chipPillRef.current });
      setError('');
      showToast('Düzgün! Batareya dolur 🔋');
      setRain(true);
      if (lessonId < totalLessons) setShowNext(true);
    } else {
      setError(lesson.errorMsg || 'Kodda bir şey düz deyil. Tapşırığı yenidən oxu.');
    }
  }

  function handleReset() {
    setCode(lesson?.starter || '');
    if (iframeRef.current) iframeRef.current.srcdoc = '';
  }

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => showToast('Kopyalandı! 📋'));
  }

  function handleTaskJump() {
    taskRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTaskBounce(true);
    setTimeout(() => setTaskBounce(false), 650);
  }

  // ── MARKER / HIGHLIGHTER ─────────────────────────────
  function handleMouseUp() {
    if (!markerActive) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const explainEl = explainRef.current;
    if (!explainEl || !explainEl.contains(range.commonAncestorContainer)) return;

    // Wrap selection in a highlight span
    const mark = document.createElement('mark');
    mark.style.background = markerColor.color + '55';
    mark.style.color = 'inherit';
    mark.style.borderRadius = '2px';
    mark.style.padding = '0 2px';
    mark.dataset.highlight = markerColor.id;

    try {
      range.surroundContents(mark);
    } catch {
      // Selection spans multiple nodes — extract and wrap
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }

    // Save to notebook (future: send to NotebookContext)
    const highlighted = mark.textContent;
    const event = new CustomEvent('kodpiksel:highlight', {
      detail: { text: highlighted, color: markerColor.color, source: `${lesson?.tag} · Dərs ${lessonId}` }
    });
    window.dispatchEvent(event);

    sel.removeAllRanges();
  }

  if (!lesson) return <div className="lp-wrapper"><p style={{color:'var(--muted)',padding:40}}>Dərs tapılmadı.</p></div>;

  return (
    <div className="lp-wrapper">
      <BinaryRain active={rain} onDone={() => setRain(false)} />
      <Toast msg={toast} />

      {/* ── NAV BAR ── */}
      <nav className="lp-nav">
        <button className="btn-back" onClick={onBack}>◀ GERİ</button>
        <div className="lesson-nav">
          <button disabled={lessonId <= 1}             onClick={() => onNavigate(lessonId - 1)}>◀</button>
          <span className="label">DƏRS {lessonId} / {totalLessons}</span>
          <button disabled={lessonId >= totalLessons}  onClick={() => onNavigate(lessonId + 1)}>▶</button>
        </div>
        <span className="tag-pill">{lesson.tag}</span>
        <span className="lesson-name" dangerouslySetInnerHTML={{ __html: lesson.indexLabel + ' ' + lesson.title }} />

        {/* Chip counter (reward target)
        <div className="lp-chip-counter" ref={chipPillRef}>
          🖥️ <span>{Object.entries(lessonChips).filter(([id]) => getDone().includes(Number(id))).reduce((s,[,v])=>s+v,0)}</span> ÇİP
        </div> */}
      </nav>
      
      {/* ── WORKSPACE ── */}
      <div className="workspace">

        {/* LEFT COL */}
        <div className="left-col">

          {/* Explanation panel */}
          <section className="panel">
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">📖 İZAHAT</span>
              <span className="spacer"/>

              {/* ── MARKER TOOLBAR ── */}
              <div className="marker-toolbar">
                <button
                  className={`marker-toggle${markerActive ? ' active' : ''}`}
                  title={markerActive ? 'Markeri söndür' : 'Markeri yandır'}
                  onClick={() => setMarkerActive(v => !v)}
                >
                  🖊️
                </button>
                {markerActive && (
                  <div className="marker-colors">
                    {MARKER_COLORS.map(mc => (
                      <button
                        key={mc.id}
                        className={`marker-dot${markerColor.id === mc.id ? ' selected' : ''}`}
                        style={{ background: mc.color }}
                        title={mc.label}
                        onClick={() => setMarkerColor(mc)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button className="btn-task-jump" onClick={handleTaskJump}>⚡ TAPŞIRIĞA KEÇ</button>
            </div>

            <div className={`panel-body top-left-body${panelBounce ? ' bounce' : ''}`}
              style={{ cursor: markerActive ? 'crosshair' : 'auto' ,
                fontSize: '18px',  
                lineHeight: '1.6'
              }}
              onMouseUp={handleMouseUp}
            >
              {/* Explanation */}
              <div className="explain-block">
                <div className="explain-label">💡 İZAH</div>
                <div
                  className="explain-text"
                  style={{ fontSize: '19px', lineHeight: '1.6' }}
                  ref={explainRef}
                  dangerouslySetInnerHTML={{ __html: lesson.explanationHtml || '' }}
                />
              </div>

              {/* Diagram */}
              {lesson.diagramHtml && (
                <div className="diagram-slot"
                  style={{ 
                    userSelect: 'none', 
                    WebkitUserSelect: 'none', /* Safari üçün */
                    MozUserSelect: 'none',    /* Firefox üçün */
                    msUserSelect: 'none'      /* Köhnə IE/Edge üçün */
                  }}
                  dangerouslySetInnerHTML={{ __html: lesson.diagramHtml }}
                />
              )}

              {/* Task box */}
              <div ref={taskRef} className={`task-box${taskBounce ? ' bounce' : ''}`}>
                <div className="task-head">
                  <span className="task-label">📋 TAPŞIRIQ</span>
                  <span className="diff-pill">{lesson.difficulty}</span>
                </div>
                <div className="task-text"
                  style={{ fontSize: '19px', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ __html: lesson.taskHtml || '' }}
                />
              </div>
            </div>
          </section>

          {/* Code editor panel */}
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
                disabled={!!lesson.locked}
              />
            </div>
            <div className="editor-actions">
              <button className="btn btn-reset" onClick={handleReset}>↺ SIFIRLA</button>
              <div className="btn-group">
                <button className="btn btn-run"   onClick={handleRun}   disabled={!!lesson.locked}>RUN</button>
                <button className="btn btn-check" onClick={handleCheck} disabled={!!lesson.locked}>CAVABIMI YOXLA</button>
                {showNext && (
                  <button className="btn btn-next-lesson" onClick={() => onNavigate(lessonId + 1)}>
                    NÖVBƏTİ DƏRS ▶
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COL */}
        <div className="right-col">
          <section className="panel">
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">CANLI MONİTOR</span>
              <div className="url-bar">
                <span>pixel-browser://html-sinif.az/{lesson.urlPath}</span>
                <span>⤴</span>
              </div>
            </div>
            <div className="preview-area">
              <iframe ref={iframeRef} title="Canlı önizləmə" sandbox="allow-scripts allow-popups" />
              <span className="watermark">PİKSEL BRAUZER V1</span>
              {lesson.locked && (
                <div className="lock-overlay">
                  🔒 Bu bölmə hələ kilidlidir.<br/>Əvvəlki dərsləri tamamla!
                </div>
              )}
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