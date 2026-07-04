// src/components/Hero.jsx
import { useEffect, useRef } from 'react';

// ── TYPEWRITER DATA ──────────────────────────────────────
const SNIPPETS = [
  { lang: 'python', filename: 'main.py', lines: [
    { t:'cm',    v:'# Salam, KodPiksel!' },
    { t:'mixed', v:'def salam_de(ad):',          spans:[{cls:'kw',s:0,e:2},{cls:'fn',s:4,e:12}] },
    { t:'mixed', v:'    print(f"Salam, {ad}!")', spans:[{cls:'kw',s:4,e:8},{cls:'str',s:10,e:24}] },
    { t:'plain', v:'' },
    { t:'mixed', v:'salam_de("Dünya")',           spans:[{cls:'fn',s:0,e:8},{cls:'str',s:9,e:16}] },
  ]},
  { lang: 'js', filename: 'script.js', lines: [
    { t:'cm',    v:'// Element yaradırıq' },
    { t:'mixed', v:'const kart = document',       spans:[{cls:'kw',s:0,e:4}] },
    { t:'mixed', v:'  .createElement("div")',     spans:[{cls:'fn',s:3,e:16},{cls:'str',s:17,e:21}] },
    { t:'mixed', v:'kart.classList.add("kart")',  spans:[{cls:'fn',s:5,e:14},{cls:'fn',s:15,e:18},{cls:'str',s:19,e:25}] },
    { t:'plain', v:'' },
    { t:'cm',    v:'// ✓ Element hazırdır' },
  ]},
  { lang: 'python', filename: 'fib.py', lines: [
    { t:'cm',    v:'# Fibonacci sırası' },
    { t:'mixed', v:'def fib(n):',                spans:[{cls:'kw',s:0,e:2},{cls:'fn',s:4,e:6}] },
    { t:'mixed', v:'    a, b = 0, 1',            spans:[{cls:'num',s:10,e:10},{cls:'num',s:13,e:13}] },
    { t:'mixed', v:'    while a < n:',            spans:[{cls:'kw',s:4,e:8}] },
    { t:'mixed', v:'        print(a, end=" ")',   spans:[{cls:'kw',s:8,e:12},{cls:'str',s:20,e:22}] },
    { t:'plain', v:'        a, b = b, a+b' },
    { t:'plain', v:'' },
    { t:'mixed', v:'fib(100)',                    spans:[{cls:'fn',s:0,e:2},{cls:'num',s:4,e:6}] },
  ]},
  { lang: 'css', filename: 'style.css', lines: [
    { t:'cm',    v:'/* CSS animasiya */' },
    { t:'mixed', v:'.btn { background: #00D4AA;', spans:[{cls:'fn',s:6,e:15},{cls:'str',s:18,e:24}] },
    { t:'mixed', v:'  transition: all 0.3s ease;',spans:[{cls:'fn',s:2,e:11},{cls:'str',s:14,e:26}] },
    { t:'mixed', v:'  transform: scale(1); }',    spans:[{cls:'fn',s:2,e:10},{cls:'num',s:18,e:18}] },
    { t:'plain', v:'' },
    { t:'mixed', v:'.btn:hover {',                spans:[{cls:'kw',s:0,e:9}] },
    { t:'mixed', v:'  transform: scale(1.05); }', spans:[{cls:'fn',s:2,e:10},{cls:'num',s:18,e:21}] },
  ]},
];

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function colorLine(line, typed) {
  if (line.t === 'cm')    return `<span class="t-cm">${esc(typed)}</span>`;
  if (line.t === 'plain') return `<span class="t-pl">${esc(typed)}</span>`;
  let html = '';
  for (let ci = 0; ci < typed.length; ci++) {
    const sp  = line.spans?.find(s => ci >= s.s && ci <= s.e);
    const cls = sp ? `t-${sp.cls}` : 't-pl';
    html += `<span class="${cls}">${esc(line.v[ci])}</span>`;
  }
  return html;
}

// ── HOOKS ────────────────────────────────────────────────
function useRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const chars = '01アイウエオカキクHTMLCSSPYJSRETURNIF{}[];=><>/()#@!'.split('');
    let cols, drops, dropLengths, raf;

    function init() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols        = Math.floor(canvas.width / 16);
      drops       = Array.from({ length: cols }, () => Math.random() * -canvas.height / 16);
      dropLengths = Array.from({ length: cols }, () => 10 + Math.floor(Math.random() * 22));
    }

    let last = 0;
    function draw(ts) {
      raf = requestAnimationFrame(draw);
      if (ts - last < 45) return; // ~22fps, same as original setInterval(45)
      last = ts;
      ctx.fillStyle = 'rgba(13,27,42,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '18px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        const len = dropLengths[i];
        for (let j = 0; j < len; j++) {
          const fy = y - j;
          if (fy < 0) continue;
          const py = fy * 35;
          if (py > canvas.height) continue;
          ctx.fillStyle = j === 0 ? '#e0fff8'
            : j < 3 ? '#00D4AA'
            : `rgba(0,180,140,${(Math.max(0, 1 - j / len) * 0.8).toFixed(2)})`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, py);
        }
        drops[i] += 0.5;
        if ((y - dropLengths[i]) * 16 > canvas.height) {
          drops[i]       = Math.random() * -30;
          dropLengths[i] = 10 + Math.floor(Math.random() * 22);
        }
      });
    }

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); };
  }, [canvasRef]);
}

function useTypewriter(displayRef) {
  useEffect(() => {
    let twIdx = 0, twLine = 0, twChar = 0;
    let twRendered = [], twTyping = '';
    let timer;

    function render(withCursor) {
      const el = displayRef.current;
      if (!el) return;
      const lines = [...twRendered];
      if (withCursor !== undefined) {
        const line = SNIPPETS[twIdx].lines[twLine];
        lines.push(`<div class="t-line">${colorLine(line, twTyping)}<span class="t-cursor"></span></div>`);
      }
      el.innerHTML = lines.join('');
      el.scrollTop = el.scrollHeight;
    }

    function reset() {
      twLine = 0; twChar = 0; twRendered = []; twTyping = '';
      if (displayRef.current) displayRef.current.innerHTML = '';
    }

    function step() {
      const sn   = SNIPPETS[twIdx];
      if (twLine >= sn.lines.length) {
        timer = setTimeout(() => {
          twIdx = (twIdx + 1) % SNIPPETS.length;
          reset();
          timer = setTimeout(step, 700);
        }, 2400);
        return;
      }
      const line = sn.lines[twLine];
      if (twChar === 0 && line.v === '') {
        twRendered.push(`<div class="t-line">&nbsp;</div>`);
        twLine++; render();
        timer = setTimeout(step, 60);
        return;
      }
      if (twChar < line.v.length) {
        twTyping = line.v.slice(0, twChar + 1);
        twChar++;
        render(true);
        timer = setTimeout(step, 36 + Math.random() * 28);
      } else {
        twRendered.push(`<div class="t-line">${colorLine(line, line.v)}</div>`);
        twLine++; twChar = 0; twTyping = '';
        render();
        timer = setTimeout(step, line.v === '' ? 60 : 120);
      }
    }

    timer = setTimeout(step, 900);
    return () => clearTimeout(timer);
  }, [displayRef]);
}

// ── COMPONENT ────────────────────────────────────────────
export default function Hero() {
  const canvasRef  = useRef(null);
  const displayRef = useRef(null);
  const twIdx      = useRef(0);

  useRain(canvasRef);
  useTypewriter(displayRef);

  // filename updates with snippet — track via state would re-render, 
  // so we just show the first filename; full dynamic filename is a nice-to-have
  const filename = SNIPPETS[twIdx.current]?.filename ?? 'main.py';

  return (
    <section id="hero">
      <canvas id="rain-canvas" ref={canvasRef} />
      <div className="hero-split">

        {/* Left — text */}
        <div className="hero-left">
          <p className="hero-eyebrow">Kodlamanı öyrənməyin ən əyləncəli yolu</p>
          <h1 className="hero-headline">
            HTML, CSS, Python<br/>
            <em>və daha çoxu</em>
          </h1>
          {/* <p className="hero-sub">
            HTML, CSS, Python və daha çox şey —<br/>
            interaktiv dərslər, yarışlar və real tapşırıqlarla.
          </p> */}
          <a href="#kurslar" className="btn-primary">
            Yolunu seç və öyrənməyə başla →
          </a>
        </div>

        {/* Right — terminal */}
        <div className="hero-right">
          <div className="code-terminal">
            <div className="terminal-bar">
              <div className="t-dot red"    />
              <div className="t-dot yellow" />
              <div className="t-dot green"  />
              <span className="terminal-filename">{filename}</span>
            </div>
            <div className="terminal-body" ref={displayRef} />
          </div>
        </div>

      </div>
      {/* <div className="scroll-hint">▼ aşağı sürüşdür</div> */}
    </section>
  );
}