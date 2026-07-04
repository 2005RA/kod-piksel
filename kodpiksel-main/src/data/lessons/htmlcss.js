// src/data/lessons/htmlcss.js
import { parseBody, matchesSolution } from '../validateHelper.js';

export const TOTAL_LESSONS = 14;
export const MODULE1_COUNT = 7;

export const LESSON_CHIPS = { 1:9, 2:9, 3:10, 4:2, 5:3, 6:3, 7:2, 8:1, 9:2, 10:1, 11:1, 12:2, 13:1, 14:3 };

export const SVG = {
  house: `<svg width="130" height="110" viewBox="0 0 130 110" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="82" width="110" height="20" rx="4" fill="#d4e8a0" stroke="#1a1a1a" strokeWidth="2"/>
    <rect x="25" y="52" width="80" height="32" fill="#fff9e6" stroke="#1a1a1a" strokeWidth="2.5"/>
    <polygon points="15,54 65,10 115,54" fill="#e5503f" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
    <rect x="55" y="64" width="20" height="20" rx="2" fill="#f4c84a" stroke="#1a1a1a" strokeWidth="2"/>
    <rect x="30" y="58" width="18" height="14" rx="2" fill="#c0e4ff" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="39" y1="58" x2="39" y2="72" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="30" y1="65" x2="48" y2="65" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="82" y="58" width="18" height="14" rx="2" fill="#c0e4ff" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="91" y1="58" x2="91" y2="72" stroke="#1a1a1a" strokeWidth="1.5"/>
    <line x1="82" y1="65" x2="100" y2="65" stroke="#1a1a1a" strokeWidth="1.5"/>
    <rect x="80" y="20" width="12" height="22" fill="#b0b8c8" stroke="#1a1a1a" strokeWidth="2"/>
  </svg>`,

  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  // ── Lesson 9 — color: same house shape, three different paint colors ──────
  paintHouses: `<svg width="500" height="115" viewBox="0 0 340 115" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(15,10)">
      <rect x="5" y="42" width="60" height="40" fill="#f45050" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#a13030" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: red</text>
    </g>
    <g transform="translate(130,10)">
      <rect x="5" y="42" width="60" height="40" fill="#3A86FF" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#1a4d8f" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: blue</text>
    </g>
    <g transform="translate(245,10)">
      <rect x="5" y="42" width="60" height="40" fill="#4cae50" stroke="#1a1a1a" strokeWidth="2"/>
      <polygon points="0,44 35,14 70,44" fill="#2d6e30" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
      <text x="3" y="98" textAnchor="middle" fontSize="12" fill="#f4f4f4" fontFamily="monospace">color: green</text>
    </g>
  </svg>`,

  // ── Lesson 10 — font-size: same word, three sizes ──────────────────────────
  sizeSteps: `<svg width="320" height="110" viewBox="0 0 320 110" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="40" fontFamily="sans-serif" fontSize="14" fill="#f4f4f4">Salam</text>
    <text x="100" y="55" fontFamily="sans-serif" fontSize="28" fill="#f4f4f4">Salam</text>
    <text x="190" y="85" fontFamily="sans-serif" fontSize="48" fill="#f4f4f4">Salam</text>
    <text x="10" y="100" fontSize="11" fontFamily="monospace" fill="#a78bfa">14px</text>
    <text x="100" y="100" fontSize="11" fontFamily="monospace" fill="#a78bfa">28px</text>
    <text x="190" y="100" fontSize="11" fontFamily="monospace" fill="#a78bfa">48px</text>
  </svg>`,

  // ── Lesson 12 — box model: content / padding / border / margin layers ─────
  boxModel: `<svg width="280" height="200" viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="270" height="190" fill="#fdf0d5" stroke="#f4c84a" strokeWidth="2" strokeDasharray="6,4"/>
    <text x="140" y="20" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#a87d1a">margin</text>
    <rect x="30" y="35" width="220" height="140" fill="#fff" stroke="#e5503f" strokeWidth="3"/>
    <text x="140" y="50" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#e5503f">border</text>
    <rect x="50" y="60" width="180" height="95" fill="#d4e8f0" stroke="#3A86FF" strokeWidth="2" strokeDasharray="4,3"/>
    <text x="140" y="78" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1a6fbf">padding</text>
    <rect x="80" y="95" width="120" height="40" fill="#a78bfa" stroke="#1a1a1a" strokeWidth="2"/>
    <text x="140" y="117" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#fff">content</text>
  </svg>`,

  // ── Lesson 13 — border: a plain box gains a visible frame ──────────────────
  borderBox: `<svg width="260" height="110" viewBox="0 0 260 110" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="90" height="60" fill="#fff9e6" stroke="none"/>
    <text x="55" y="95" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#888">border yoxdur</text>
    <line x1="115" y1="50" x2="150" y2="50" stroke="#888" strokeWidth="2"/>
    <polygon points="150,44 150,56 160,50" fill="#888"/>
    <rect x="160" y="20" width="90" height="60" fill="#fff9e6" stroke="#e5503f" strokeWidth="4"/>
    <text x="205" y="95" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#e5503f">border var!</text>
  </svg>`,
};


export const LESSONS = {
  // ── LESSON 1 — <body> ──────────────────────────────────────────────────────
  1: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '1.', title: 'HTML Nədir? <body>',
    difficulty: 'ASAN', urlPath: 'ders-1',
    explanationHtml: `
      <p>Təsəvvür et ki, bir ev tikirsən. Əvvəl divarları, döşəməni, damı qoyursan, yəni, evin <span class="hl-purple">skeletini</span> qurursan. Sonra rəngləyib bəzəyirsən. İnternetdəki veb səhifələr də belə qurulur, amma "kərpic" əvəzinə <strong>HTML</strong> işlədilir.</p>
      <p>HTML brauzerin (Chrome, Safari, Edge) başa düşdüyü xüsusi bir dildir. Sən kodu yazırsan, brauzer də onu oxuyub ekranda bir səhifəyə çevirir.</p>
      
      <p>Bəs bu kodlar necə yazılır? HTML-də hər bir element <strong>"teq" (tag)</strong> adlanan xüsusi qutuların içinə qoyulur. Teqlər brauzerə <i>"bu mətni başlıq elə"</i> və ya <i>"bura şəkil qoy"</i> əmrini verir. Onlar adətən belə cütlük şəklində yazılır: <span class="code-chip">&lt;teq&gt;</span> mətn <span class="code-chip">&lt;/teq&gt;</span>.</p>
      
      <p>Hər HTML sənədinin əsas canı isə <span class="code-chip">&lt;body&gt;</span> teqidir. Veb saytda istifadəçinin gördüyü <span class="hl-yellow">hər şey</span> — yazılar, şəkillər, düymələr — məhz bu açılan və bağlanan teqlərin arasına yazılır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏠 ANALOGİYA</span><span class="diagram-title">Ev və Veb Səhifə</span></div>
        <p class="diagram-text">Ev necə bir iskeletdən ibarətdirsə, veb səhifə də HTML-dən ibarətdir.</p>
        <div class="tree-wrap">
          <div class="tree-root">&lt;body&gt; — Evin içi</div>
          <div class="tree-stem"></div>
          <div class="tree-branches">
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Mətnlər</div><div class="desc">divar yazıları</div></div></div>
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Şəkillər</div><div class="desc">rəsmlər</div></div></div>
            <div class="branch"><div class="branch-line"></div><div class="tree-node"><div class="tag">Düymələr</div><div class="desc">qapılar</div></div></div>
          </div>
        </div>
      </div>
    `,
    taskHtml: `<p>Redaktorda <span class="code-chip">&lt;body&gt;</span> teqinin içinə öz adını yaz, sonra <strong>RUN</strong> düyməsinə bas.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'Body teqinin içinə bir şey yaz!',
    validate: (code) => {
      // Must have a real <body> with non-empty text content inside it
      const p = parseBody(code);
      if (!p) return false;
      return p.body.textContent.trim().length > 0;
    },
  },

  // ── LESSON 2 — <h1> ───────────────────────────────────────────────────────
  2: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '2.', title: 'Böyük Başlıq &lt;h1&gt;',
    difficulty: 'ASAN', urlPath: 'ders-2',
    explanationHtml: `
      <p>Hər kitabın bir adı var, üz qabığında böyük hərflərlə yazılır. Veb səhifələrdə bu rolu <span class="hl-purple">başlıqlar</span> oynayır. HTML-də ən böyük başlıq üçün <span class="code-chip">&lt;h1&gt;</span> teqindən istifadə edirik.</p>
      <p>Hər teqin bir cütü var: açılış və bağlanış. <span class="code-chip">&lt;h1&gt;</span> açılır, mətn gəlir, sonra <span class="code-chip">&lt;/h1&gt;</span> ilə teq bağlanır. <span class="hl-red">Bağlamağı unutsan</span>, brauzer başlığın harada bitdiyini bilməyəcək.</p>
      <p>Adətən bir səhifədə yalnız <span class="hl-yellow">bir</span> <span class="code-chip">&lt;h1&gt;</span> olur. Daha kiçik alt-başlıqlar üçün <span class="code-chip">&lt;h2&gt;</span>, <span class="code-chip">&lt;h3&gt;</span> və s. istifadə olunur.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Xəbər Manşeti</span></div>
        <p class="diagram-text">Qəzetin ön səhifəsindəki ən böyük, diqqətçəkən əsas başlıq tam olaraq &lt;h1&gt; rolunu oynayır.</p>
        <pre>               &lt;h1&gt;Mən Bu Səhifənin Şahıyam!&lt;/h1&gt;\n                 ↑                            ↑          \n               açılış                    bağlanış</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə <span class="code-chip">&lt;h1&gt;Salam, Dünya!&lt;/h1&gt;</span> yaz, sonra <strong>RUN</strong> et.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'body içində <h1>Salam, Dünya!</h1> yazılmalıdır — xaricdə olan teqlər sayılmır!',
    validate: (code) => {
      // 1. Əvvəlcə yazının daxilində tam və düzgün bir <h1>...</h1> teqinin olub-olmadığını Regex ilə yoxlayırıq
      // bu regex mütləq şəkildə açılış elementini və qarşısında "/" olan bağlanış teqini tələb edir.
      const hasValidH1Structure = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.test(code);
      if (!hasValidH1Structure) return false;

      // 2. Əgər struktur düzgündürsə, daxili mətni yoxlamaq üçün mövcud parser məntiqinə ötürürük
      const p = parseBody(code);
      if (!p) return false;
      
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      
      const txt = h1.textContent.trim();
      return /^salam,\s*dünya!$/i.test(txt);
    },
  },

  // ── LESSON 3 — <p> ────────────────────────────────────────────────────────
  3: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '3.', title: 'Paraqraf &lt;p&gt;',
    difficulty: 'ASAN', urlPath: 'ders-3',
   explanationHtml: `
      <p>Evin divarında sadəcə bir böyük giriş lövhəsi (başlıq) olmur. Evdəki rəflərdə kitablar, albomlar və uzun hekayələr də olur. HTML-də bu cür adi və geniş mətnlər üçün <span class="code-chip">&lt;p&gt;</span> teqindən istifadə edirik. "P" hərfi ingiliscə <span class="hl-purple">paragraph (paraqraf)</span> sözündən götürülüb.</p>
      <p><span class="code-chip">&lt;h1&gt;</span> bir səhifədə adətən <span class="hl-yellow">bir dəfə</span> (kitabın adı kimi) yazılır, amma <span class="code-chip">&lt;p&gt;</span> teqindən istədiyin qədər istifadə edə bilərsən. Hər yeni fikir və ya abzas üçün ayrı bir paraqraf açılır.</p>
      <p><span class="hl-red">Unutma:</span> Necə ki kitabı oxuyub qurtaranda qapağını bağlayırsan, hər bir <span class="code-chip">&lt;p&gt;</span> teqi də öz cütü ilə bağlanmalıdır: <span class="code-chip">&lt;/p&gt;</span>.</p>
    `,
   diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Xəbər Strukturu</span></div>
        <p class="diagram-text">&lt;h1&gt; diqqətçəkən böyük manşetdir, &lt;p&gt; isə onun altındakı adi xəbər abzasdır.</p>
        
        <pre style="line-height: 1.5;"><span style="font-size: 20px; font-weight: bold; color: #fff;">&lt;h1&gt;Marsda Həyat Tapıldı!&lt;/h1&gt;</span>  ← Əsas Başlıq (Böyük)\n<span style="font-size: 13px; color: #ccc;">&lt;p&gt;Qırmızı planetdə qəribə izlər aşkar edildi...&lt;/p&gt;</span>  ← Adi Mətn (Kiçik)\n ↑                                              ↑\nAçılış teqi                                 Bağlanış teqi</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə <span class="code-chip">&lt;p&gt;</span> teqi ilə özün haqqında <strong>ən azı 3 sözlük</strong> bir cümlə yaz.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'body içində düzgün bağlanmış <p> olmalı və içində ən azı 3 söz olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      return para.textContent.trim().split(/\s+/).filter(Boolean).length >= 3;
    },
  },

  // ── LESSON 4 — <strong> & <em> ───────────────────────────────────────────
  4: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '4.', title: 'Qalın &amp; Maili &lt;strong&gt; &lt;em&gt;',
    difficulty: 'ASAN', urlPath: 'ders-4',
    explanationHtml: `
      <p>Kitab oxuyanda və ya qəzet vərəqləyəndə bəzi sözlərin digərlərindən daha fərqli yazıldığını görürük. HTML-də mətnin içindəki vacib sözləri önə çıxarmaq üçün iki əsas alətimiz var: <span class="code-chip">&lt;strong&gt;</span> mətni <span class="hl-purple">qalın (bold)</span> edir, <span class="code-chip">&lt;em&gt;</span> isə <i><span class="hl-purple">maili (italik)</span></i> edərək sözü vurğulayır.</p>
      <p>Bu teqlər adətən paraqrafın <span class="hl-yellow">içinə</span> yazılır. Məsələn, bir <span class="code-chip">&lt;p&gt;</span> daxilindəki bir sözü qalın etmək istəyirsənsə, həmin sözü <span class="code-chip">&lt;strong&gt;</span> qutusuna qoyursan.</p>
      <p><span class="hl-red">Unutma:</span> Bu teqlər də cütlükdür, yəni mütləq açılıb-bağlanmalıdırlar: <span class="code-chip">&lt;strong&gt;...&lt;/strong&gt;</span> və <span class="code-chip">&lt;em&gt;...&lt;/em&gt;</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Mətni Vurğulamaq</span></div>
        <p class="diagram-text">&lt;strong&gt; sözü qalınlaşdırıb onun vacibliyini göstərir, &lt;em&gt; isə sözü əyərək yazıya xüsusi səs tonu (vurğu) qatır.</p>
        
        <pre style="line-height: 1.6;"><span style="font-size: 14px; color: #fff;">Bu söz <strong style="color: #FFE066; font-size: 16px;">&lt;strong&gt;vacibdir&lt;/strong&gt;</strong>.</span>  ← Qalın və diqqətçəkən\n<span style="font-size: 14px; color: #fff;">Bu söz <em style="color: #a78bfa; font-size: 15px; font-style: italic;">&lt;em&gt;xüsusidir&lt;/em&gt;</em>.</span>    ← Maili və vurğulanmış</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz, içində ən azı bir söz <span class="code-chip">&lt;strong&gt;</span> ilə, bir söz isə <span class="code-chip">&lt;em&gt;</span> ilə işarələnsin.</p>`,
    starter: '<body>\n  <p>\n\n  </p>\n</body>',
    errorMsg: 'p içində həm <strong>, həm də <em> olmalı və hər ikisi düzgün bağlanmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('strong') || !p.balanced('em')) return false;
      const strong = p.body.querySelector('strong');
      const em = p.body.querySelector('em');
      return !!(strong?.textContent.trim() && em?.textContent.trim());
    },
  },

  // ── LESSON 5 — <a> ───────────────────────────────────────────────────────
  5: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '5.', title: 'Keçidlər &lt;a&gt;',
    difficulty: 'ORTA', urlPath: 'ders-5',
    explanationHtml: `
      <p>İnternet milyardlarla fərqli səhifənin birləşdiyi nəhəng bir rəqəmsal dünyadır. Bəs bu səhifələr arasında necə səyahət edirik? Əlbəttə ki, <span class="hl-purple">linklərin</span> köməyi ilə. HTML-də bizi bir kliklə tamamilə başqa bir səhifəyə aparan bu "sehrli qapının" adı <span class="code-chip">&lt;a&gt;</span> (Anchor - Lövbər) teqidir.</p>
      
      <p>Lakin təkcə <span class="code-chip">&lt;a&gt;</span> yazmaq kifayət etmir. Brauzer <span class="code-chip">&lt;a&gt;</span> vasitəsilə "keçid yaratmaq istədiyini" anlayır, amma <i>"hara gedəcəyini"</i> bilmir. HTML teqlərinə əlavə tənzimləmələr və ya əmrlər vermək üçün <strong>atributlardan (özəlliklərdən)</strong> istifadə olunur. Atribut teqin daxilinə yazılan xüsusi bir ipucudur.</p>
      
      <p>Bizim keçid teqinin ən vacib atributu <span class="code-chip">href</span>-dir. O, brauzerə teleportasiya olacağı dəqiq koordinatı pıçıldayır. Kod üzərində baxsaq, atribut həmişə açılış teqinin tam daxilinə, bərabərlik işarəsi və dırnaqlarla yazılır: <span class="code-chip">&lt;a href="https://google.com"&gt;Google-a get&lt;/a&gt;</span>. Burada <span class="hl-purple">https://google.com</span> href atributudur və dırnaq içində olmalıdır.</p>
      
      <p><span class="hl-red">Unutma:</span> <span class="code-chip">href</span> dırnaqlarının daxilindəki ünvan mütləq tam və real şəbəkə protokolu ilə başlamalıdır: <span class="code-chip">https://</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🌀 ANALOGİYA</span><span class="diagram-title">Teleport Stansiyası</span></div>
        <p class="diagram-text">&lt;a&gt; kliklənə bilən düymədirsə, href onun arxa fonda gizlətdiyi hədəf koordinatıdır (kosmik ünvanıdır).</p>
        
        <pre style="line-height: 1.6;">&lt;a <span style="color: #FFE066; font-weight: bold;">href="https://google.com"</span>&gt;<span style="color: #00D4AA; font-weight: bold;">Google</span>&lt;/a&gt;\n     ↑                          ↑\nArxa fondakı hədəf        Ekranda görünən\n   ünvan (href)              mavi mətn</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə bir <span class="code-chip">&lt;a&gt;</span> teqi ilə istənilən real veb sayta keçid yarat.</p><ul><li><span class="code-chip">href</span> atributu dırnaq içində, <span class="code-chip">https://</span> ilə başlamalıdır</li><li>Ekranda görünən mətn ən azı 1 sözdən ibarət olsun</li></ul>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'a teqi düzgün bağlanmalı, href="https://..." dırnaq içində olmalı və üzərində mətn olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('a')) return false;
      if (!p.hasAttr('href')) return false;
      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return false;
      return a.textContent.trim().length > 0;
    },
  },

  // ── LESSON 6 — <ul> <li> ─────────────────────────────────────────────────
  6: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '6.', title: 'Siyahılar &lt;ul&gt; &lt;li&gt;',
    difficulty: 'ORTA', urlPath: 'ders-6',
    explanationHtml: `
      <p>Mağazaya və ya bazara gedəndə unutmamaq üçün çox vaxt bir siyahı hazırlayırıq: çörək, süd, alma... HTML-də belə maddə-maddə düzülən siyahılar yaratmaq üçün iki teq əl-ələ verib birlikdə işləyir: <span class="code-chip">&lt;ul&gt;</span> bütöv bir <span class="hl-purple">siyahı vərəqi</span> rolunu oynayır, <span class="code-chip">&lt;li&gt;</span> isə həmin vərəqdəki <span class="hl-yellow">hər bir maddədir</span>.</p>
      <p>"UL" sözü ingiliscə <i>unordered list</i> (sırasız, yəni nömrələnməmiş siyahı) ifadəsindən götürülüb. Siyahıdakı hər bir bənd öz xüsusi <span class="code-chip">&lt;li&gt;...&lt;/li&gt;</span> qutusunda yazılır və bütün bu maddələr mütləq ana vərəqin, yəni <span class="code-chip">&lt;ul&gt;</span> teqinin <span class="hl-yellow">içində</span> yerləşməlidir.</p>
      <p><span class="hl-red">Unutma:</span> <span class="code-chip">&lt;li&gt;</span> teqi təkbaşına yaşaya bilməz. O mütləq hansısa bir siyahı vərəqinin (<span class="code-chip">&lt;ul&gt;</span>) daxilində olmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📝 VİZUAL</span><span class="diagram-title">Siyahı Strukturu</span></div>
        <p class="diagram-text">&lt;ul&gt; ana vərəqdir, daxilindəki &lt;li&gt; teqləri isə nöqtə ilə ayrılan bəndlərdir:</p>
        
        <div style="background: #25262b; border: 1px solid #373a40; border-radius: 8px; padding: 15px; font-family: monospace; line-height: 1.6;">
          <div style="color: #868e96; margin-bottom: 10px; border-bottom: 1px dashed #373a40; padding-bottom: 8px;">💻 YAZILAN KOD:</div>
          <div style="color: #ffe066; font-size: 16px; font-weight: bold;">&lt;h1&gt;<span style="color: #fff;">Bazar Siyahısı</span>&lt;/h1&gt;</div>
          <div style="color: #ffe066; margin-top: 5px;">&lt;ul&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Çörək</span>&lt;/li&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Süd</span>&lt;/li&gt;</div>
          <div style="padding-left: 20px; color: #a78bfa;">&lt;li&gt;<span style="color: #fff; font-weight: bold;">Şokolad</span>&lt;/li&gt;</div>
          <div style="color: #ffe066;">&lt;/ul&gt;</div>
          
          <div style="color: #868e96; margin-top: 15px; margin-bottom: 5px; border-top: 1px dashed #373a40; padding-top: 12px;">🌐 BRAUZERDƏ GÖRÜNÜŞÜ:</div>
          <div style="background: #fff9e6; border-left: 4px solid #fcc419; padding: 12px 20px; border-radius: 4px; color: #212529; font-family: sans-serif;">
            <h1 style="margin: 0 0 10px 0; font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f1f3f5; padding-bottom: 5px;">Bazar Siyahısı</h1>
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
              <li style="margin-bottom: 4px; font-weight: 500;">Çörək</li>
              <li style="margin-bottom: 4px; font-weight: 500;">Süd</li>
              <li style="margin: 0; font-weight: 500;">Şokolad</li>
            </ul>
          </div>
        </div>
      </div>
    `,
        
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;ul&gt;</span> yarat, içində ən azı <strong>3</strong> <span class="code-chip">&lt;li&gt;</span> olsun.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'ul düzgün bağlanmalı və içində ən azı 3 li elementi olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('ul') || !p.balanced('li')) return false;
      const ul = p.body.querySelector('ul');
      if (!ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
  },

  // ── LESSON 7 — <img> ─────────────────────────────────────────────────────
  7: {
    module: 1, tag: 'HTML Əsasları', indexLabel: '7.', title: 'Şəkillər &lt;img&gt;',
    difficulty: 'ORTA', urlPath: 'ders-7',
    explanationHtml: `
      <p>Yalnız mətnlərdən ibarət olan bir veb səhifə çox cansıxıcı görünərdi. Saytı canlandırmaq və vizual olaraq gözəlləşdirmək üçün şəkillərdən istifadə edirik. HTML-də səhifəyə şəkil yerləşdirmək üçün <span class="code-chip">&lt;img&gt;</span> (Image) teqi işlədilir.</p>
      
      <p><span class="code-chip">&lt;img&gt;</span> teqinin çox xüsusi bir qaydası var: onun <span class="hl-yellow">bağlanış teqi yoxdur</span> (yəni &lt;/img&gt; yazılmır). Çünki onun içinə mətn qoymuruq, şəkli yükləmək üçün teqin daxilinə iki önəmli atribut əlavə edirik: <span class="code-chip">src</span> (Source - şəklin internetdəki ünvanı) və <span class="code-chip">alt</span> (Alternative text - şəkil haqqında qısa izahat).</p>
      
      <p><span class="hl-red">Niyə ALT vacibdir?</span> Əgər istifadəçinin interneti zəif olsa və şəkil yüklənməsə, brauzer boşluq qalmamaq üçün <span class="code-chip">alt</span> daxilinə yazdığın mətni göstərir. Həmçinin görmə məhdudiyyətli insanlar üçün xüsusi proqramlar bu mətni səsli oxuyur. Ona görə də bu atributu yazmaq mütləqdir!</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📰 ANALOGİYA</span><span class="diagram-title">Qəzet Maketi</span></div>
        <p class="diagram-text">Bütün öyrəndiyimiz teqlər iyerarxiya ilə birləşəndə qəzet strukturunu formalaşdırır:</p>
        
        <div style="background: #25262b; border: 1px solid #373a40; border-radius: 8px; padding: 15px; font-family: monospace; line-height: 1.5;">
          <div style="margin-bottom: 15px; font-size: 14px;">
            <div style="color: #ffe066; font-weight: bold;">&lt;h1&gt;<span style="color: #fff;">Koder Qəzeti</span>&lt;/h1&gt;</div>
            <div style="color: #ffe066; font-weight: bold; margin-top: 4px;">&lt;h2&gt;<span style="color: #fff;">Marsda Həyat Tapıldı!</span>&lt;/h2&gt;</div>
            <div style="color: #ffe066; margin: 4px 0;">&lt;p&gt;<span style="color: #fff;">Qırmızı planetdə qəribə izlər aşkar edildi...</span>&lt;/p&gt;</div>
            <div style="color: #ffe066; font-weight: bold;">&lt;img <span style="color: #a78bfa;">src="<span style="color: #fff;">rover.jpg</span>"</span> <span style="color: #a78bfa;">alt="<span style="color: #00D4AA;">Mars robotu</span>"</span>&gt;</div>
          </div>
          
          <div style="background: #f4f1ea; border: 1px solid #c8c3bc; padding: 15px; border-radius: 4px; font-family: 'Times New Roman', Times, serif; color: #1a1a1a;">
            
            <div style="font-size: 22px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #1a1a1a; text-align: center; margin-bottom: 12px; padding-bottom: 3px; letter-spacing: 1px;">
              Koder Qəzeti
            </div>
            
            <div style="display: flex; gap: 15px; align-items: flex-start;">
              
              <div style="flex: 1; color: #222;">
                <h2 style="margin: 0 0 6px 0; font-size: 16px; font-family: sans-serif; font-weight: bold; color: #000; line-height: 1.2;">
                  Marsda Həyat Tapıldı!
                </h2>
                <p style="margin: 0; font-size: 13px; line-height: 1.4; text-align: justify;">
                  Qırmızı planetdə qəribə izlər aşkar edildi...
                </p>
              </div>
              
              <div style="width: 120px; background: #fff; border: 1px solid #b5b0a8; padding: 5px; text-align: center; box-shadow: 1px 1px 3px rgba(0,0,0,0.05); flex-shrink: 0;">
                <div style="background: #dcd7cd; height: 70px; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid #9c968d;">
                  🤖
                </div>
                <div style="font-size: 12px; font-weight: bold; color: #00876c; font-family: sans-serif; line-height: 1.2; margin-top: 5px; border-top: 1px dashed #b5b0a8; padding-top: 4px;">
                  Mars robotu
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilinə bir <span class="code-chip">&lt;img&gt;</span> teqi yaz.</p><ul><li><span class="code-chip">src</span> atributu dolu olmalıdır</li><li><span class="code-chip">alt</span> atributu dolu olmalıdır</li></ul>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'img teqinin src="..." və alt="..." atributları dırnaq içində və dolu olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.hasAttr('src') || !p.hasAttr('alt')) return false;
      const img = p.body.querySelector('img');
      if (!img) return false;
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      return src.trim().length > 0 && alt.trim().length > 0;
    },
  },
  // ── LESSON 8 — CSS Nədir? ────────────────────────────────────────────────
  8: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '1.', title: 'CSS Nədir?',
    difficulty: 'ASAN', urlPath: 'ders-8',
    explanationHtml: `
      <p>Yadındadırmı, HTML ilə evin təmiz daşlardan ibarət olan <span class="hl-purple">skeletini (bünövrəsini)</span> qurmuşduq? İndi ise həmin evi <span class="hl-yellow">bəzəmək</span> vaxtıdır: divarları rəngləmək və pəncərələrin ölçüsünü təyin etmək. Bunu edən dil <strong>CSS</strong>-dir.</p>
      <p>HTML səhifədə <span class="hl-purple">nəyin var olduğunu</span> deyir (başlıq, paraqraf, şəkil), CSS isə onların brauzerdə <span class="hl-yellow">necə göründüyünü</span> müəyyən edir (rəngi, ölçüsü, yerləşməsi).</p>
      <p>CSS qaydalarını tətbiq etməyin ilkin yolu <span class="code-chip">style</span> atributudur. İstənilən teqin daxilinə <span class="code-chip">style="..."</span> yazıb, içində dizayn əmrləri qoyursan.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🎨 ANALOGİYA</span><span class="diagram-title">Skelet və Bəzək</span></div>
        <p class="diagram-text">CSS olmadan mətn standart qara və sadə olur. Style atributu əlavə edildikdə isə görünüş tamamilə dəyişir:</p>
        
        <div style="margin-bottom: 20px;">
          <div style="font-family: monospace; font-size: 14px; margin-bottom: 8px; color: #fff; font-weight: bold; letter-spacing: 0.5px;">
            &lt;h1&gt;<span style="color: #fff;">Mənim Evim</span>&lt;/h1&gt; <span style="color: #868e96; font-size: 12px; font-family: sans-serif; font-weight: normal; margin-left: 10px;">(Stilsiz halı)</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e3e6e8; padding: 15px; border-radius: 4px;">
            <h1 style="margin: 0; font-family: sans-serif; font-size: 16px; color: #000000; font-weight: bold;">
              Mənim Evim
            </h1>
          </div>
        </div>

        <div>
          <div style="font-family: monospace; font-size: 14px; margin-bottom: 8px; color: #fff; font-weight: bold; letter-spacing: 0.5px;">
            &lt;h1 <span style="color: #a78bfa;">style="<span style="color: #ff8787;">color</span>: <span style="color: #4dadf7;">blue</span>; <span style="color: #ff8787;">font-size</span>: <span style="color: #4dadf7;">24px</span>;"</span>&gt;Mənim Evim&lt;/h1&gt; <span style="color: #00D4AA; font-size: 12px; font-family: sans-serif; font-weight: normal; margin-left: 10px;">(Dizayn edilmiş halı)</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e3e6e8; padding: 15px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h1 style="margin: 0; font-family: sans-serif; font-size: 24px; color: blue; font-weight: bold;">
              Mənim Evim
            </h1>
          </div>
        </div>

      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style</span> atributundan istifadə edərək ona ya mətn rəngi (<span class="code-chip">color: blue;</span>), ya da şrift ölçüsü (<span class="code-chip">font-size: 24px;</span>) təyin et.</p>`,
    starter: '<body>\n  \n</body>',
    errorMsg: 'h1 teqinin style atributu daxilində düzgün CSS xüsusiyyəti (color və ya font-size) yazılmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      
      // color: sözündən sonra yalnız keçərli əsas rənglərin (red, blue, green, yellow, purple) gəlməsini tələb edirik
      const hasValidColor = /color:(red|blue|green|yellow|purple)(;|$)/.test(style);
      
      // font-size: sözündən sonra rəqəm və px vahidinin gəlməsini tələb edirik
      const hasValidFontSize = /font-size:\d+px(;|$)/.test(style);
      
      return hasValidColor || hasValidFontSize;
    },
  },

  // ── LESSON 9 — color ─────────────────────────────────────────────────────
  9: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '2.', title: 'Rənglər color',
    difficulty: 'ASAN', urlPath: 'ders-9',
    explanationHtml: `
      <p>Evin divarlarını rəngləmək istəyirsən? CSS-də mətnin rəngini dəyişmək üçün xüsusi olaraq <span class="code-chip">color</span> xüsusiyyəti istifadə olunur.</p>
      <p>Yazılışı olduqca sadədir: <span class="code-chip">style="color: red;"</span> — bu əmr həmin teqin daxilindəki <span class="hl-yellow">mətn rəngini</span> qırmızı edir. Rənglərin adlarını ingilis dilində daxil edirik: <span class="hl-purple">red</span>, <span class="hl-purple">blue</span>, <span class="hl-purple">green</span>, <span class="hl-purple">yellow</span>, <span class="hl-purple">purple</span> və s.</p>
      <p><span class="hl-red">Vacib Qayda:</span> Xüsusiyyət adından (color) sonra mütləq <span class="code-chip">:</span> (iki nöqtə), dəyərdən (rəngin adı) sonra isə <span class="code-chip">;</span> (nöqtəli vergül) yazılmalıdır.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏠 ANALOGİYA</span><span class="diagram-title">Eyni Ev, Fərqli Rəng</span></div>
        <p class="diagram-text">Eyni memarlıq strukturu (HTML), sadəcə CSS vasitəsilə fərqli rəng çalarlarına boyanır:</p>
        ${SVG.paintHouses}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style="color: ..."</span> ilə mətni <strong>qırmızı (red)</strong> et.</p>`,
    starter: '<body>\n  <h1 style="">Mənim Başlığım</h1>\n</body>',
    errorMsg: 'h1 düzgün bağlanmalı, style="color: red" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /color:red/.test(style);
    },
  },
  // ── LESSON 10 — font-size ────────────────────────────────────────────────
  10: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '3.', title: 'Şrift Ölçüsü font-size',
    difficulty: 'ASAN', urlPath: 'ders-10',
    explanationHtml: `
      <p>Evdəki lövhə yazıları eyni ölçüdə olmur — qapı zənginin yanındakı yazı kiçikdir, evin nömrəsi isə böyük. CSS-də mətnin ölçüsünü <span class="code-chip">font-size</span> ilə idarə edirik.</p>
      <p>Ölçünü ən çox <span class="hl-yellow">piksel (px)</span> ilə yazırıq: <span class="code-chip">style="font-size: 30px;"</span> — rəqəm nə qədər böyükdürsə, mətn bir o qədər böyük görünür.</p>
      <p><span class="hl-red">Unutma:</span> rəqəmdən sonra <span class="code-chip">px</span> yazmağı unutma — yoxsa brauzer xüsusiyyəti başa düşməyəcək.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📏 ANALOGİYA</span><span class="diagram-title">Kiçikdən Böyüyə</span></div>
        <p class="diagram-text">Eyni söz, fərqli font-size dəyəri ilə fərqli böyüklükdə görünür.</p>
        ${SVG.sizeSteps}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="font-size: ..."</span> ilə mətnin ölçüsünü <strong>30px-dən böyük</strong> et.</p>`,
    starter: '<body>\n  <p style="">Salam!</p>\n</body>',
    errorMsg: 'p düzgün bağlanmalı, style="font-size: ...px" olmalı və 30px-dən böyük olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      const m = style.match(/font-size:(\d+)px/);
      return !!m && Number(m[1]) > 30;
    },
  },

  // ── LESSON 11 — text-align ───────────────────────────────────────────────
  11: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '4.', title: 'Mərkəzləşdirmə text-align',
    difficulty: 'ASAN', urlPath: 'ders-11',
    explanationHtml: `
      <p>Bir lövhəni divara asanda onu sola, sağa, yaxud düz <span class="hl-yellow">ortaya</span> qoya bilərsən. Mətn üçün eyni şey <span class="code-chip">text-align</span> xüsusiyyəti ilə olur.</p>
      <p>Üç əsas dəyəri var: <span class="code-chip">left</span> (sol — standart), <span class="code-chip">center</span> (mərkəz), <span class="code-chip">right</span> (sağ).</p>
      <p>Məsələn: <span class="code-chip">style="text-align: center;"</span> mətni öz qabının ortasına gətirir.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">↔️ ANALOGİYA</span><span class="diagram-title">Lövhənin Yeri</span></div>
        <p class="diagram-text">Mətn öz qabı daxilində sola, ortaya, ya da sağa "yapışdırıla" bilər.</p>
        <pre>[Salam              ]   ← left\n[      Salam        ]   ← center\n[              Salam]   ← right</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yaz və <span class="code-chip">style="text-align: center;"</span> ilə onu ortaya gətir.</p>`,
    starter: '<body>\n  <h1 style="">Mənim Başlığım</h1>\n</body>',
    errorMsg: 'h1 düzgün bağlanmalı, style="text-align: center" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /text-align:center/.test(style);
    },
  },

  // ── LESSON 12 — padding & margin (box model) ────────────────────────────
  12: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '5.', title: 'Qutu Modeli padding &amp; margin',
    difficulty: 'ORTA', urlPath: 'ders-12',
    explanationHtml: `
      <p>Hər HTML elementini görünməz bir <span class="hl-yellow">qutu</span> içində təsəvvür et. Qutunun içində iki növ boşluq var: <span class="code-chip">padding</span> — qutunun <span class="hl-purple">içindəki</span> boşluq (mətnlə qutunun kənarı arası), və <span class="code-chip">margin</span> — qutunun <span class="hl-purple">çölündəki</span> boşluq (qutu ilə digər elementlər arası).</p>
      <p>Analogiya: bir şəkli çərçivəyə salanda, şəkillə çərçivə arasındakı boşluq <span class="hl-yellow">padding</span>-dir, çərçivə ilə divar arasındakı boşluq isə <span class="hl-yellow">margin</span>-dir.</p>
      <p>Hər ikisi piksellə yazılır: <span class="code-chip">style="padding: 20px; margin: 10px;"</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">📦 ANALOGİYA</span><span class="diagram-title">Qutu Modeli</span></div>
        <p class="diagram-text">content → padding → border → margin: hər element bu qatlardan ibarətdir.</p>
        ${SVG.boxModel}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz, <span class="code-chip">style</span> ilə həm <span class="code-chip">padding</span>, həm də <span class="code-chip">margin</span> əlavə et (hər ikisi 0-dan böyük olsun).</p>`,
    starter: '<body>\n  <p style="">Mətnim</p>\n</body>',
    errorMsg: 'p düzgün bağlanmalı, style içində həm padding, həm margin 0-dan böyük dəyərlə yazılmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      const padM = style.match(/(?:^|;)padding:(\d+)px/);
      const marM = style.match(/(?:^|;)margin:(\d+)px/);
      return !!padM && !!marM && Number(padM[1]) > 0 && Number(marM[1]) > 0;
    },
  },

  // ── LESSON 13 — border ───────────────────────────────────────────────────
  13: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '6.', title: 'Haşiyə border',
    difficulty: 'ASAN', urlPath: 'ders-13',
    explanationHtml: `
      <p>Şəklin ətrafına çərçivə taxmaq kimi, HTML elementinin ətrafına da xətt çəkmək olar — buna <span class="code-chip">border</span> deyilir.</p>
      <p>Border üç hissədən ibarətdir, hamısı bir sətirdə yazılır: <span class="hl-yellow">qalınlıq</span> (məs. <span class="code-chip">2px</span>), <span class="hl-yellow">növ</span> (məs. <span class="code-chip">solid</span> — düz xətt), <span class="hl-yellow">rəng</span> (məs. <span class="code-chip">black</span>).</p>
      <p>Tam yazılışı: <span class="code-chip">style="border: 2px solid black;"</span>.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🖼️ ANALOGİYA</span><span class="diagram-title">Şəkil Çərçivəsi</span></div>
        <p class="diagram-text">border elementin ətrafına çəkilən görünən xəttdir.</p>
        ${SVG.borderBox}
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;p&gt;</span> yaz və <span class="code-chip">style="border: ...px solid ...;"</span> ilə ona haşiyə əlavə et.</p>`,
    starter: '<body>\n  <p style="">Mətnim</p>\n</body>',
    errorMsg: 'p düzgün bağlanmalı, style="border: Npx solid rəng;" formasında olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      const style = (para.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      return /border:\d+pxsolid[a-z]+/.test(style);
    },
  },

  // ── LESSON 14 — class & CSS selectors ───────────────────────────────────
  14: {
    module: 2, tag: 'CSS Əsasları', indexLabel: '7.', title: 'Siniflər class &amp; CSS Seçicilər',
    difficulty: 'ÇƏTİN', urlPath: 'ders-14',
    explanationHtml: `
      <p>İndiyə qədər hər elementə ayrı-ayrı <span class="code-chip">style</span> yazırdıq. Bəs eyni rəngi <span class="hl-yellow">bir neçə</span> elementə bir anda vermək istəsən? Buna görə <span class="code-chip">class</span> atributu var.</p>
      <p>Elementə bir "etiket" yapışdırırsan: <span class="code-chip">&lt;p class="qirmizi"&gt;</span>. Sonra <span class="code-chip">&lt;head&gt;</span> içində <span class="code-chip">&lt;style&gt;</span> teqi ilə bu etiketə aid qayda yazırsan: <span class="code-chip">.qirmizi { color: red; }</span> — nöqtə <span class="hl-purple">class adı</span> deməkdir.</p>
      <p>Bu, eyni stili dəfələrlə təkrar yazmaq əvəzinə, <span class="hl-yellow">bir dəfə</span> təyin edib hər yerdə işlətməyə imkan verir — kərpic zavodunun eyni qəlibdən kərpic istehsal etməsi kimi.</p>
    `,
    diagramHtml: `
      <div class="diagram-card">
        <div class="diagram-badge-row"><span class="diagram-badge">🏷️ ANALOGİYA</span><span class="diagram-title">Etiket və Qəlib</span></div>
        <p class="diagram-text">class bir etiketdir, CSS seçicisi isə həmin etiketli bütün elementlərə baxan qaydadır.</p>
        <pre>&lt;style&gt;\n  .qirmizi { color: red; }\n&lt;/style&gt;\n\n&lt;p class="qirmizi"&gt;Bu qırmızıdır&lt;/p&gt;\n&lt;p class="qirmizi"&gt;Bu da qırmızıdır&lt;/p&gt;</pre>
      </div>
    `,
    taskHtml: `<p><span class="code-chip">&lt;head&gt;</span> daxilində <span class="code-chip">&lt;style&gt;</span> teqi ilə <span class="code-chip">.boyuk</span> adlı bir class yarat (məs. <span class="code-chip">font-size: 40px;</span> versin). Sonra <span class="code-chip">&lt;body&gt;</span> daxilində bir <span class="code-chip">&lt;h1&gt;</span> yarat və ona <span class="code-chip">class="boyuk"</span> əlavə et.</p>`,
    starter: '<html>\n<head>\n  <style>\n\n  </style>\n</head>\n<body>\n  <h1>Salam!</h1>\n</body>\n</html>',
    errorMsg: '<style> içində .boyuk class-ı təyin olunmalı, h1 isə class="boyuk" daşımalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      // .boyuk must be defined somewhere in raw source as a CSS class rule
      if (!/\.boyuk\s*\{[^}]+\}/i.test(p.src)) return false;
      // h1 must carry class="boyuk" (quoted, in source) and exist in DOM
      if (!p.hasAttr('class')) return false;
      const h1 = p.body.querySelector('h1.boyuk');
      return !!h1;
    },
  },
};