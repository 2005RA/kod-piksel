// src/data/races.js
import { parseBody } from './validateHelper.js';

export const RACES = [
  {
    id: 1,   icon: '🏁', title: 'HTML Sürət Yarışı #14',
    course: 'htmlcss', label: 'HTML / CSS',
   status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-04T17:08:00', // YYYY-MM-DDTHH:MM:SS, your local time
sub: '32 iştirakçı · Canlı', prize: '50 Çip',
    type: 'timed', timeLimit: 180, maxHourglasses: 2,
    chips: 10, keys: 1, pixels: 1,
    taskHtml: `<p>3 dəqiqə ərzində yaz:</p><ul><li><span class="code-chip">&lt;h1&gt;</span> başlıq</li><li><span class="code-chip">&lt;p&gt;</span> paraqraf</li><li><span class="code-chip">&lt;ul&gt;</span> 3 maddəli siyahı</li></ul>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'body içində h1, p və ən azı 3 li olan ul olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const ul = p.body.querySelector('ul');
      if (!h1?.textContent.trim() || !para?.textContent.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
    chest: { cost: 2, hint: 'ul teqinin içinə li elementləri yaz.', code: '<ul>\n  <li>Maddə 1</li>\n</ul>' },
  },

  {
    id: 2,   icon: '⚡', title: 'Python Sprint #07',
    course: 'python', label: 'Python',
status: 'live', date: '2026-07-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-02T15:40:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Başlanğıc: 20:00 · Bu gün', prize: '80 Çip',
    type: 'speed', timeLimit: 300, maxHourglasses: 1,
    chips: 15, keys: 2, pixels: 1,
    taskHtml: `<p>Mümkün qədər tez bitir — sürətin sıralamana təsir edir!</p><p><span class="code-chip">&lt;h2&gt;</span> ilə "Salam Python" yaz.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'body içindəki h2-nin içi "Salam Python" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h2 = p.body.querySelector('h2');
      return h2 ? /^salam\s+python$/i.test(h2.textContent.trim()) : false;
    },
    chest: null,
  },

  {
    id: 3,   icon: '🏆', title: 'CSS Turniri #3',
    course: 'htmlcss', label: 'HTML / CSS',
status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-06-30T20:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Qalib: ayse_dev · Dünən', prize: '120 Çip',
    type: 'timed', timeLimit: 240, maxHourglasses: 2,
    chips: 20, keys: 2, pixels: 2,
    taskHtml: `<p>Bitmiş yarış.</p>`,
    starter: '<body>\n\n</body>',
    validate: () => false, chest: null,
  },

  {
    id: 4, icon: '⛳', title: 'HTML Golf #01',
    course: 'htmlcss', label: 'HTML / CSS',
 status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-03T13:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Ən qısa kod qazanır!', prize: '60 Çip',
    type: 'golf', charLimit: 60,
    chips: 12, keys: 1, pixels: 1,
    taskHtml: `<p>Ən az simvolla <strong>"Salam!"</strong> yazılmış başlıq yarat.</p><p>Hədəf: <strong>60 simvoldan az</strong></p>`,
    starter: '',
    errorMsg: 'body içindəki h1–h6 başlığının mətni "Salam!" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const heading = p.body.querySelector('h1,h2,h3,h4,h5,h6');
      return heading ? /^salam!$/i.test(heading.textContent.trim()) : false;
    },
    chest: { cost: 1, hint: 'Ən qısa teq h1-dir. Atributlar simvol artırır!', code: null },
  },

  {
    id: 5,   icon: '🐛', title: 'Bug Hunt #03',
    course: 'htmlcss', label: 'HTML / CSS',
status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-01T15:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Kodda 3 səhv var — tap və düzəlt!', prize: '90 Çip',
    type: 'bughunt', timeLimit: 240, maxHourglasses: 2,
    chips: 18, keys: 2, pixels: 2,
    taskHtml: `<p>Aşağıdakı kodda <strong>3 səhv</strong> var. Hamısını tap və düzəlt!</p><ul><li>Bağlanmamış teq</li><li>Yazı səhvi (imge)</li><li>Dırnaqsız href</li></ul>`,
    starter: '<body>\n  <h1>Salam Dünya\n  <imge src="foto.jpg" alt="şəkil">\n  <a href=https://google.com>Google</a>\n</body>',
    errorMsg: 'Hələ də səhvlər var: h1 bağlanmalı, "imge" → "img", href dırnaq içində olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const closedH1 = p.closed('h1') && h1 && h1.textContent.trim().length > 0;
      const hasImg   = !!p.body.querySelector('img');
      const noImge   = !/<imge/i.test(code);
      const a = p.body.querySelector('a');
      const fixedHref = a && /^https?:\/\//i.test(a.getAttribute('href') || '');
      return closedH1 && hasImg && noImge && fixedHref;
    },
    chest: { cost: 3, hint: 'İpucu: h1 bağlanmayıb, "imge" yanlışdır, href dırnaq içində olmalıdır.', code: null },
  },

  {
    id: 6,   icon: '🙈', title: 'Kor Kod #01',
    course: 'htmlcss', label: 'HTML / CSS',
 status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-03T09:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Nəticəni görməyərək yaz!', prize: '100 Çip',
    type: 'blind', timeLimit: 300, maxHourglasses: 3,
    chips: 20, keys: 2, pixels: 2,
    taskHtml: `<p>Yalnız koda bax — nəticəni görmədən yaz!</p><p>"Cavabımı Yoxla" düyməsinə basana kimi monitor qapalı qalır.</p><p>Bir <span class="code-chip">&lt;h1&gt;</span>, bir <span class="code-chip">&lt;p&gt;</span> və bir <span class="code-chip">&lt;a&gt;</span> yaz.</p>`,
    starter: '<body>\n\n</body>',
    errorMsg: 'body içində h1, p və href-li a teqləri olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const a = p.body.querySelector('a[href]');
      return !!(h1?.textContent.trim() && para?.textContent.trim() && a);
    },
    chest: null,
  },

  {
    id: 7,   icon: '🔍', title: 'Tərsinə Mühəndis #01',
    course: 'htmlcss', label: 'HTML / CSS',
    status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-05T18:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Nəticəni gör, kodu yaz!', prize: '110 Çip',
    type: 'reverse', timeLimit: 360, maxHourglasses: 2,
    chips: 22, keys: 2, pixels: 2,
    taskHtml: `<p>Sağdakı <strong>hədəf nəticəni</strong> kodla yenidən yarat.</p>`,
    starter: '<body>\n\n</body>',
    targetHtml: `<body style="font-family:sans-serif;padding:20px;background:#fff;"><h1 style="color:#e44d26;">HTML öyrənirəm!</h1><p>Bu mənim <strong>ilk</strong> veb səhifəmdir.</p><ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul></body>`,
    errorMsg: 'body içində h1, p və 3 li olan ul olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      const h1 = p.body.querySelector('h1');
      const para = p.body.querySelector('p');
      const ul = p.body.querySelector('ul');
      if (!h1?.textContent.trim() || !para?.textContent.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 3;
    },
    chest: { cost: 3, hint: 'h1 qırmızıdır (color:#e44d26). ul içində 3 li var.', code: null },
  },

  {
    id: 8,   icon: '🚀', title: 'Python Marafonu #02',
    course: 'python', label: 'Python',
status: 'live', date: '2025-01-15', dateLabel: 'Bu gün, 18:00',
endsAt: '2026-07-07T20:00:00', // YYYY-MM-DDTHH:MM:SS, your local time
    sub: 'Qalib: code_master · 2 gün əvvəl', prize: '200 Çip',
    type: 'speed', timeLimit: 300, maxHourglasses: 1,
    chips: 30, keys: 3, pixels: 2,
    taskHtml: `<p>Bitmiş yarış.</p>`,
    starter: '<body>\n\n</body>',
    validate: () => false, chest: null,
  },
];