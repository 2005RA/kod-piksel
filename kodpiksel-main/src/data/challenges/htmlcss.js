// src/data/challenges/htmlcss.js
import { parseBody } from '../validateHelper.js';

export const HTMLCSS_CHALLENGES = {
  1: {
    id: 1, tag: 'HTML Çalışma', title: 'Özünü Tanıt',
    difficulty: 'ASAN', urlPath: 'challenge-1',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Bir <span class="code-chip">&lt;h1&gt;</span> ilə adını, <span class="code-chip">&lt;p&gt;</span> ilə isə sevimli hobbini yaz.</p><ul><li><span class="code-chip">&lt;h1&gt;</span> içində adın olmalıdır</li><li><span class="code-chip">&lt;p&gt;</span> içində ən azı 5 söz olmalıdır</li></ul>`,
    starter: '<body>\n\n\n</body>',
    errorMsg: 'h1 düzgün bağlanmalı və ad yazılmalıdır. p içində ən azı 5 söz olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1') || !p.balanced('p')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1?.textContent.trim()) return false;
      const para = p.body.querySelector('p');
      if (!para) return false;
      return para.textContent.trim().split(/\s+/).length >= 5;
    },
  },

  2: {
    id: 2, tag: 'HTML Çalışma', title: 'Sevimli Siyahı',
    difficulty: 'ASAN', urlPath: 'challenge-2',
    chips: 2, keys: 0, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Ən çox sevdiyin <strong>3 şeyi</strong> sırasız siyahı ilə göstər.</p><ul><li><span class="code-chip">&lt;ul&gt;</span> istifadə et</li><li>Ən azı <strong>3</strong> <span class="code-chip">&lt;li&gt;</span> elementi olsun</li></ul>`,
    starter: '<body>\n\n\n</body>',
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

  3: {
    id: 3, tag: 'HTML Çalışma', title: 'Keçid Qur',
    difficulty: 'ORTA', urlPath: 'challenge-3',
    chips: 3, keys: 1, hourglasses: 0, pixels: 1,
    taskHtml: `<p><span class="code-chip">&lt;a&gt;</span> teqi ilə istənilən veb sayta keçid yarat.</p><ul><li><span class="code-chip">href</span> atributu real URL olmalıdır (<code>https://</code> ilə başlamalı)</li><li>Keçidin üzərindəki mətn ən azı 2 söz olsun</li></ul>`,
    starter: '<body>\n\n\n</body>',
    errorMsg: 'a teqi düzgün bağlanmalı, href="https://..." olmalı və üzərindəki mətn ən azı 2 söz olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('a')) return false;
      // href must be quoted in source
      if (!p.hasAttr('href')) return false;
      const a = p.body.querySelector('a[href]');
      if (!a) return false;
      const href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return false;
      return a.textContent.trim().split(/\s+/).length >= 2;
    },
  },

  4: {
    id: 4, tag: 'HTML Çalışma', title: 'Mini Profil Kartı',
    difficulty: 'ORTA', urlPath: 'challenge-4',
    chips: 4, keys: 1, hourglasses: 0, pixels: 2,
    taskHtml: `<p>Özün üçün bir <strong>profil kartı</strong> yarat:</p><ul><li><span class="code-chip">&lt;h2&gt;</span> — adın</li><li><span class="code-chip">&lt;p&gt;</span> — harada yaşadığın</li><li><span class="code-chip">&lt;ul&gt;</span> + ən azı 2 <span class="code-chip">&lt;li&gt;</span> — bacarıqların</li></ul>`,
    starter: '<body>\n\n\n\n\n</body>',
    errorMsg: 'h2, p və ən azı 2 li olan ul — hamısı düzgün bağlanmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h2') || !p.balanced('p') || !p.balanced('ul') || !p.balanced('li')) return false;
      const h2  = p.body.querySelector('h2');
      const para = p.body.querySelector('p');
      const ul  = p.body.querySelector('ul');
      if (!h2?.textContent.trim() || !para?.textContent.trim() || !ul) return false;
      return ul.querySelectorAll('li').length >= 2;
    },
  },

  5: {
    id: 5, tag: 'HTML Çalışma', title: 'Şəkil + Başlıq',
    difficulty: 'ORTA', urlPath: 'challenge-5',
    chips: 3, keys: 1, hourglasses: 0, pixels: 1,
    taskHtml: `<p>Bir <span class="code-chip">&lt;img&gt;</span> teqi ilə şəkil, altında isə <span class="code-chip">&lt;p&gt;</span> ilə şəklin açıqlaması yaz.</p><ul><li><span class="code-chip">src</span> atributu dolu olmalıdır</li><li><span class="code-chip">alt</span> atributu olmalıdır</li><li>Altında açıqlama <span class="code-chip">&lt;p&gt;</span> olmalıdır</li></ul>`,
    starter: '<body>\n\n\n</body>',
    errorMsg: 'img teqinin src="..." və alt="..." atributları olmalı, altında p teqi olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('p')) return false;
      // src and alt must be quoted attributes in source
      if (!p.hasAttr('src') || !p.hasAttr('alt')) return false;
      const img = p.body.querySelector('img');
      if (!img) return false;
      const src = img.getAttribute('src') || '';
      const para = p.body.querySelector('p');
      return src.trim().length > 0 && !!para?.textContent.trim();
    },
  },

  6: {
    id: 6, tag: 'HTML Çalışma', title: 'Rəngli Başlıq (Inline CSS)',
    difficulty: 'ÇƏTİN', urlPath: 'challenge-6',
    chips: 5, keys: 2, hourglasses: 1, pixels: 2,
    taskHtml: `<p>Inline <span class="code-chip">style</span> atributu ilə <span class="code-chip">&lt;h1&gt;</span> başlığının rəngini <strong>mavi</strong>, arxa fonunu isə <strong>sarı</strong> et.</p><ul><li><code>color: blue</code> olmalıdır</li><li><code>background-color: yellow</code> olmalıdır</li></ul>`,
    starter: '<body>\n  <h1 style="">\n    Mənim Başlığım\n  </h1>\n</body>',
    errorMsg: 'h1 düzgün bağlanmalı, style="color:blue;background-color:yellow" olmalıdır.',
    validate: (code) => {
      const p = parseBody(code);
      if (!p) return false;
      if (!p.balanced('h1')) return false;
      const h1 = p.body.querySelector('h1');
      if (!h1) return false;
      const style = (h1.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
      // Must have both properties — not just one
      return /color:blue/.test(style) && /background-color:yellow/.test(style);
    },
  },
};

export const TOTAL_CHALLENGES = Object.keys(HTMLCSS_CHALLENGES).length;

export function getChallengeRewards(id) {
  const c = HTMLCSS_CHALLENGES[id];
  if (!c) return {};
  return { chips: c.chips||0, keys: c.keys||0, hourglasses: c.hourglasses||0, pixels: c.pixels||0 };
}