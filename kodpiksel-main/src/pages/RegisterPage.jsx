// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AVATARS = [
  { emoji: '🧑‍💻', label: 'Kodçu'    },
  { emoji: '🦊',   label: 'Tülkü'    },
  { emoji: '🐼',   label: 'Panda'    },
  { emoji: '🚀',   label: 'Raket'    },
  { emoji: '👾',   label: 'Oyunçu'   },
  { emoji: '🐉',   label: 'Əjdaha'  },
  { emoji: '🌸',   label: 'Çiçək'   },
  { emoji: '⚡',   label: 'Şimşək'  },
  { emoji: '🎮',   label: 'Geymər'  },
  { emoji: '🤖',   label: 'Robot'    },
  { emoji: '🐙',   label: 'Ahtapot'  },
  { emoji: '🦋',   label: 'Kəpənək' },
];

// Order/ids must match the seed rows in security_questions.
const SECURITY_QUESTIONS = [
  { id: 1, text: 'İlk ev heyvanının adı nədir?' },
  { id: 2, text: 'Ən sevimli müəllimin adı nədir?' },
  { id: 3, text: 'Anan hansı şəhərdə doğulub?' },
  { id: 4, text: 'Ən sevdiyin yeməyin adı nədir?' },
  { id: 5, text: 'Uşaqlıqda yaşadığın küçənin adı nədir?' },
];

export default function RegisterPage({ onBack }) {
  const { registerWithUsername, loginWithGoogle } = useAuth();
  const location = useLocation();
  const cameFromLevelGate = location.state?.reason === 'level3';

  const [step, setStep] = useState(1); // 1 = credentials, 2 = security Qs, 3 = avatar
  const [form, setForm] = useState({ username: '', age: '', password: '', confirmPassword: '' });
  const [securityAnswers, setSecurityAnswers] = useState({});
  const [avatar,  setAvatar]  = useState('🧑‍💻');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setAnswer = (id, v) => setSecurityAnswers(a => ({ ...a, [id]: v }));

  function handleStep1(e) {
    e.preventDefault();
    setError('');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim())) {
      return setError('İstifadəçi adı 3-20 simvol, yalnız hərf/rəqəm/alt xətt ola bilər.');
    }
    const age = parseInt(form.age);
    if (!form.age || age < 5 || age > 99) return setError('Yaş düzgün deyil.');
    if (form.password.length < 6) return setError('Şifrə ən azı 6 simvol olmalıdır.');
    if (form.password !== form.confirmPassword) return setError('Şifrələr uyğun gəlmir.');
    setStep(2);
  }

  function handleStep2(e) {
    e.preventDefault();
    setError('');
    for (const q of SECURITY_QUESTIONS) {
      if (!(securityAnswers[q.id] || '').trim()) {
        return setError('Bütün sualları cavablandır — şifrəni bərpa etmək üçün lazımdır.');
      }
    }
    setStep(3);
  }

  async function handleRegister() {
    setError('');
    setLoading(true);
    try {
      await registerWithUsername({
        username: form.username.trim(),
        password: form.password,
        age: parseInt(form.age),
        avatarEmoji: avatar,
        answers: SECURITY_QUESTIONS.map(q => ({ questionId: q.id, answer: securityAnswers[q.id] })),
      });
      onBack?.();
    } catch (err) {
      setError(typeof err?.message === 'string' && err.message ? err.message : 'Qeydiyyat uğursuz oldu.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>

        <div style={S.header}>
          <div style={S.logo}>⌨️ KodPiksel</div>
          <h1 style={S.title}>Hesab Yarat</h1>
          <p style={S.sub}>Kodlaşmağa başla — tamamilə pulsuzdur!</p>
        </div>

        {cameFromLevelGate && (
          <div style={S.errorBox}>
            🎉 Səviyyə 3-ə çatdın! İrəliləyişini itirməmək üçün davam etməzdən əvvəl
            hesab yarat — bütün qazandıqların hesabına köçürüləcək.
          </div>
        )}

        <div style={S.steps}>
          {['Məlumatlar', 'Suallar', 'Avatar'].map((label, i) => (
            <div key={i} style={S.stepItem}>
              <div style={{ ...S.stepDot, ...(step > i + 1 ? S.stepDone : step === i + 1 ? S.stepActive : {}) }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ ...S.stepLabel, color: step === i + 1 ? 'var(--teal)' : 'var(--muted)' }}>{label}</span>
            </div>
          ))}
          <div style={S.stepLine} />
        </div>

        {error && <div style={S.errorBox}>{error}</div>}

        {/* ── STEP 1: Credentials ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} style={S.form}>
            <label style={S.label}>İstifadəçi adı</label>
            <input
              style={S.input}
              placeholder="kodpiksel_user"
              value={form.username}
              onChange={e => set('username', e.target.value)}
              autoFocus
            />

            <label style={S.label}>Yaş</label>
            <input
              style={S.input}
              type="number"
              placeholder="12"
              min={5} max={99}
              value={form.age}
              onChange={e => set('age', e.target.value)}
            />

            <label style={S.label}>Şifrə</label>
            <input
              style={S.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />

            <label style={S.label}>Şifrəni təkrarla</label>
            <input
              style={S.input}
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={e => set('confirmPassword', e.target.value)}
            />

            <button style={S.primaryBtn} type="submit">Davam et →</button>

            <div style={S.divider}><span>və ya</span></div>

            <button style={S.googleBtn} type="button" onClick={loginWithGoogle}>
              <span>G</span> Google ilə davam et
            </button>

            <p style={S.switchText}>
              Artıq hesabın var? <a onClick={onBack} style={S.link}>Daxil ol</a>
            </p>
          </form>
        )}

        {/* ── STEP 2: Security questions ── */}
        {step === 2 && (
          <form onSubmit={handleStep2} style={S.form}>
            <p style={S.avatarPrompt}>
              Bu suallar şifrəni unutsan hesabını bərpa etmək üçündür. Cavabları unutma!
            </p>
            {SECURITY_QUESTIONS.map(q => (
              <div key={q.id}>
                <label style={S.label}>{q.text}</label>
                <input
                  style={S.input}
                  value={securityAnswers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button style={S.secondaryBtn} onClick={() => setStep(1)} type="button">← Geri</button>
              <button style={{ ...S.primaryBtn, flex: 1 }} type="submit">Davam et →</button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Avatar ── */}
        {step === 3 && (
          <div style={S.form}>
            <p style={S.avatarPrompt}>Özünü təmsil edəcək avatarı seç:</p>

            <div style={S.avatarGrid}>
              {AVATARS.map(a => (
                <button
                  key={a.emoji}
                  style={{ ...S.avatarBtn, ...(avatar === a.emoji ? S.avatarSelected : {}) }}
                  onClick={() => setAvatar(a.emoji)}
                  type="button"
                >
                  <span style={{ fontSize: '2rem' }}>{a.emoji}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 2 }}>{a.label}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button style={S.secondaryBtn} onClick={() => setStep(2)} type="button">← Geri</button>
              <button style={{ ...S.primaryBtn, flex: 1 }} onClick={handleRegister} disabled={loading}>
                {loading ? 'Gözlə...' : '🎉 Hesab Yarat'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh', background: 'var(--navy)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  card: {
    width: '100%', maxWidth: 440, background: 'var(--navy2)',
    border: '2px solid var(--border-teal)', boxShadow: '4px 4px 0 var(--teal)',
    padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20,
  },
  header: { textAlign: 'center' },
  logo: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 },
  title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--white)', margin: 0 },
  sub: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', marginTop: 6 },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 },
  stepDot: {
    width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
    border: '2px solid var(--muted)', color: 'var(--muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', transition: 'all 0.2s',
  },
  stepActive: { borderColor: 'var(--teal)', color: 'var(--teal)', background: 'rgba(0,212,170,0.1)' },
  stepDone:   { borderColor: 'var(--teal)', color: 'var(--teal)', background: 'rgba(0,212,170,0.2)' },
  stepLabel:  { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' },
  stepLine: { position: 'absolute', top: 14, left: '16%', right: '16%', height: 1, background: 'var(--border-teal)', zIndex: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-teal)', color: 'var(--white)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', padding: '10px 14px',
    outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s',
  },
  errorBox: {
    background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.4)', color: '#ec4899',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', padding: '10px 14px',
  },
  primaryBtn: {
    background: 'var(--teal)', color: '#0b0f19', fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700, fontSize: '0.82rem', padding: '12px 20px', border: 'none',
    cursor: 'pointer', letterSpacing: 0.5, transition: 'opacity 0.15s',
  },
  secondaryBtn: {
    background: 'transparent', border: '1px solid var(--border-teal)', color: 'var(--muted)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', padding: '12px 16px', cursor: 'pointer',
  },
  googleBtn: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--white)',
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', padding: '11px 20px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
  },
  switchText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'center', margin: 0 },
  link: { color: 'var(--teal)', textDecoration: 'none' },
  avatarPrompt: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: 'var(--white)', margin: 0 },
  avatarGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  avatarBtn: {
    background: 'rgba(255,255,255,0.03)', border: '2px solid transparent', padding: '10px 6px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.15s',
  },
  avatarSelected: { borderColor: 'var(--teal)', background: 'rgba(0,212,170,0.1)', boxShadow: '0 0 0 1px var(--teal)' },
};