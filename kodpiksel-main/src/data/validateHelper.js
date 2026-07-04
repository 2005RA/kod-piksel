// src/data/validateHelper.js
// ─────────────────────────────────────────────────────────────────────────────
// parseBody() parses student HTML into DOM but also exposes the raw source
// so validators can check BOTH structure AND correct syntax together.
//
// Why both? DOMParser auto-corrects broken HTML — an unclosed <h1> still
// creates an h1 node in the DOM, content typed after </body> gets silently
// moved back inside <body>, and a stray "<" right before a real tag gets
// entity-escaped and ignored. So DOM alone is too lenient.
// Raw source checks catch syntax errors DOM would silently fix.
// ─────────────────────────────────────────────────────────────────────────────

export function parseBody(code) {
  // ── 1. Strict body-boundary check ─────────────────────────────────────────
  // Exactly one <body...> and one </body>, and nothing but optional
  // <!DOCTYPE>/<html>/<head>...</head> may sit before <body>, and nothing but
  // optional </html> may sit after </body>. This is what catches things like
  // "</body>fdf" or content/tags placed after the closing body tag — DOM
  // parsing alone would silently relocate that content back inside <body>.
  const bodyOpens  = (code.match(/<body[\s>]/gi)  || []).length;
  const bodyCloses = (code.match(/<\/body>/gi)    || []).length;
  if (bodyOpens !== 1 || bodyCloses !== 1) return null;

  const openMatch  = code.match(/<body[^>]*>/i);
  const closeMatch = code.match(/<\/body>/i);
  if (!openMatch || !closeMatch) return null;

  const openIdx  = openMatch.index;
  const openEnd  = openIdx + openMatch[0].length;
  const closeIdx = code.indexOf(closeMatch[0], openEnd);
  if (closeIdx === -1) return null; // </body> appears before <body>, or not after it

  const before = code.slice(0, openIdx);
  const after  = code.slice(closeIdx + closeMatch[0].length);

  const beforeOk = /^(\s|<!DOCTYPE[^>]*>|<\/?html[^>]*>|<head[^>]*>[\s\S]*?<\/head>)*$/i.test(before);
  const afterOk  = /^(\s|<\/html[^>]*>)*$/i.test(after);
  if (!beforeOk || !afterOk) return null;

  // ── 1b. Generic orphan-bracket syntax gate ────────────────────────────────
  // DOMParser is lenient by spec: stray "<" or ">" characters near a real tag
  // get silently entity-escaped or absorbed, and the DOM still comes out
  // looking valid (e.g. "<<h1>", "<</body>", a bare unescaped "<" in text).
  // Patching this pattern-by-pattern is whack-a-mole, so instead we check
  // generically: strip every well-formed tag/comment token out of the raw
  // source, and if any "<" or ">" character is left over, the source
  // contained something a real tag boundary can't explain — reject it.
  // This single rule covers "<<tag>", "<</tag>", unescaped "<"/">" in text,
  // malformed attribute quoting, and similar tricks all at once.
  const TAG_OR_COMMENT_RE =
    /<!--[\s\S]*?-->|<\/?[a-zA-Z][a-zA-Z0-9]*((\s+[a-zA-Z-]+(=("[^"]*"|'[^']*'))?)*\s*)\/?>/g;
  const tagTokens = [...code.matchAll(TAG_OR_COMMENT_RE)];
  let strippedSrc = code;
  for (let i = tagTokens.length - 1; i >= 0; i--) {
    const m = tagTokens[i];
    strippedSrc = strippedSrc.slice(0, m.index) + strippedSrc.slice(m.index + m[0].length);
  }
  if (/[<>]/.test(strippedSrc)) return null;

  // ── 2. DOM parse ──────────────────────────────────────────────────────────
  const doc  = new DOMParser().parseFromString(code, 'text/html');
  const body = doc.body;

  // Query helpers — only inside body
  const q    = (sel) => Array.from(body.querySelectorAll(sel));
  const has  = (sel) => body.querySelector(sel) !== null;
  const text = (sel) => {
    const el = body.querySelector(sel);
    return el ? (el.innerText ?? el.textContent ?? '').trim() : '';
  };

  // ── 3. Source helpers ─────────────────────────────────────────────────────
  // Check that a tag is properly opened AND closed in the raw source
  const src = code;

  /**
   * True if a "<" immediately precedes the real opening tag, e.g. "<<h1>".
   * DOMParser entity-escapes the stray "<" and still creates a valid h1
   * node, so the DOM alone would never catch this typo.
   */
  const hasStrayBracket = (tagName) =>
    new RegExp(`<<${tagName}[\\s>]`, 'i').test(src);

  /**
   * True if <tagName> is both opened and closed in source, with no stray
   * "<" directly before the opening tag.
   * e.g. closed('h1') checks /<h1>/ and /<\/h1>/, and rejects "<<h1>".
   */
  const closed = (tagName) =>
    new RegExp(`<${tagName}[\\s>]`, 'i').test(src) &&
    new RegExp(`<\\/${tagName}>`, 'i').test(src) &&
    !hasStrayBracket(tagName);

  /**
   * True if an attribute exists with a non-empty quoted value in source.
   * e.g. hasAttr('href') checks href="..." or href='...'
   */
  const hasAttr = (attrName) =>
    new RegExp(`${attrName}=["'][^"']+["']`, 'i').test(src);

  /**
   * True if there are no obviously unclosed versions of this tag, AND no
   * stray "<" directly before any opening occurrence of the tag.
   * Counts opening vs closing tags — they must match.
   */
  const balanced = (tagName) => {
    if (hasStrayBracket(tagName)) return false;
    const opens  = (src.match(new RegExp(`<${tagName}[\\s>]`, 'gi')) || []).length;
    const closes = (src.match(new RegExp(`<\\/${tagName}>`,   'gi')) || []).length;
    return opens > 0 && opens === closes;
  };

  return { body, q, has, text, src, closed, hasAttr, balanced };
}

// ─────────────────────────────────────────────────────────────────────────────
// matchesSolution() — OPTIONAL helper for content-based checking.
//
// Use this instead of (or alongside) hand-written validate() logic when you
// want to say "this task is correct if it structurally matches one of these
// reference answers" rather than writing custom querySelector logic by hand
// every time.
//
// HOW TO USE THIS FOR A NEW TASK / LESSON:
//
// 1. Write 1+ reference solutions as plain HTML strings — these are CORRECT
//    answers a student might submit. You can give more than one if multiple
//    different answers should count as correct (e.g. different attribute
//    order, optional extra tag, etc.) — fingerprinting already ignores
//    whitespace/case/quote-style differences automatically, so you usually
//    only need ONE solution string per distinct "shape" of correct answer.
//
//      const solutions = [
//        '<body><h1>Salam, Dünya!</h1></body>',
//      ];
//
// 2. Write a small fingerprint(parsed) function that extracts ONLY the facts
//    that matter for grading this task — parsed is the object returned by
//    parseBody() above (so you get .body, .closed(), .hasAttr(), etc).
//    Anything you DON'T put in the fingerprint is allowed to vary freely
//    between the student's answer and your stored solution (e.g. don't
//    include text content if any text is acceptable for that field).
//
//      const fingerprint = (p) => {
//        const h1 = p.body.querySelector('h1');
//        return {
//          closed: p.closed('h1'),
//          text: h1 ? h1.textContent.trim().toLowerCase() : null,
//        };
//      };
//
// 3. In your task's validate(code), call:
//
//      validate: (code) => matchesSolution(code, solutions, fingerprint),
//
// matchesSolution returns false automatically if parseBody(code) returns
// null (i.e. the syntax gate above already rejected the source), so you get
// the strict-syntax protection for free without writing it again.
// ─────────────────────────────────────────────────────────────────────────────
export function matchesSolution(code, solutions, fingerprint) {
  const studentParsed = parseBody(code);
  if (!studentParsed) return false;

  let studentFp;
  try {
    studentFp = JSON.stringify(fingerprint(studentParsed));
  } catch {
    return false; // fingerprint() threw (e.g. expected element missing) -> not a match
  }

  return solutions.some((solutionCode) => {
    const solutionParsed = parseBody(solutionCode);
    if (!solutionParsed) return false; // a broken stored "solution" never matches anything
    let solutionFp;
    try {
      solutionFp = JSON.stringify(fingerprint(solutionParsed));
    } catch {
      return false;
    }
    return studentFp === solutionFp;
  });
}