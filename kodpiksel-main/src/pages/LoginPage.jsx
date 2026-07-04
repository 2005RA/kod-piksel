// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onBack, onSwitch, onForgotPassword }) {
  const { loginWithUsername, loginWithGoogle } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithUsername({ username, password });
      onBack?.();
    } catch (err) {
      setError(err.message || 'İstifadəçi adı və ya şifrə yanlışdır.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>

        <div style={S.header}>
          <div style={S.logo}>⌨️ KodPiksel</div>
          <h1 style={S.title}>Xoş Gəldin!</h1>
          <p style={S.sub}>Davam etmək üçün daxil ol.</p>
        </div>

        {error && <div style={S.errorBox}>{error}</div>}

        <form onSubmit={handleLogin} style={S.form}>
          <label style={S.label}>İstifadəçi adı</label>
          <input
            style={S.input}
            placeholder="kodpiksel_user"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />

          <label style={S.label}>Şifrə</label>
          <input
            style={S.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <p style={{ ...S.switchText, textAlign: 'right', margin: '-4px 0 0' }}>
            <a onClick={onForgotPassword} style={{ ...S.link, cursor: 'pointer' }}>Şifrəni unutmusan?</a>
          </p>

          <button style={S.primaryBtn} type="submit" disabled={loading}>
            {loading ? 'Gözlə...' : 'Daxil Ol →'}
          </button>

          <div style={S.dividerWrap}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>və ya</span>
            <div style={S.dividerLine} />
          </div>

          <button style={S.googleBtn} type="button" onClick={loginWithGoogle}>
            <span style={S.googleG}>G</span>
            Google ilə daxil ol
          </button>

          <p style={S.switchText}>
            Hesabın yoxdur? <a onClick={onSwitch} style={{ ...S.link, cursor: 'pointer' }}>Qeydiyyatdan keç</a>
          </p>
        </form>

      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    width: '100%', maxWidth: 400, background: 'var(--navy2)', border: '2px solid var(--border-teal)',
    boxShadow: '4px 4px 0 var(--teal)', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 20,
  },
  header: { textAlign: 'center' },
  logo: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 },
  title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--white)', margin: 0 },
  sub: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)', marginTop: 6 },
  form:  { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-teal)', color: 'var(--white)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', padding: '10px 14px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  errorBox: {
    background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.4)', color: '#ec4899',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', padding: '10px 14px',
  },
  primaryBtn: {
    background: 'var(--teal)', color: '#0b0f19', fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700, fontSize: '0.82rem', padding: '12px 20px', border: 'none', cursor: 'pointer', letterSpacing: 0.5,
  },
  dividerWrap: { display: 'flex', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, background: 'var(--border-teal)' },
  dividerText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--muted)' },
  googleBtn: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--white)',
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', padding: '11px 20px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  googleG: {
    fontWeight: 700, fontSize: '1rem',
    background: 'linear-gradient(135deg,#4285F4,#EA4335,#FBBC05,#34A853)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  switchText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'center', margin: 0 },
  link: { color: 'var(--teal)', textDecoration: 'none' },
};