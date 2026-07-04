// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage({ onBack }) {
  const { requestPasswordReset, verifyResetAnswers, resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1 = username, 2 = questions, 3 = new password, 4 = done
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUsernameSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim()) return setError('İstifadəçi adı tələb olunur.');
    setLoading(true);
    try {
      const res = await requestPasswordReset(username.trim());
      setQuestions(res.questions);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswersSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyResetAnswers(
        username.trim(),
        questions.map(q => ({ questionId: q.questionId, answer: answers[q.questionId] || '' }))
      );
      setToken(res.token);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Cavablar yanlışdır.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Şifrə ən azı 6 simvol olmalıdır.');
    if (newPassword !== confirmPassword) return setError('Şifrələr uyğun gəlmir.');
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Şifrə yenilənmədi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.logo}>⌨️ KodPiksel</div>
          <h1 style={S.title}>Şifrəni Bərpa Et</h1>
        </div>

        {error && <div style={S.errorBox}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleUsernameSubmit} style={S.form}>
            <label style={S.label}>İstifadəçi adı</label>
            <input style={S.input} value={username} onChange={e => setUsername(e.target.value)} autoFocus />
            <button style={S.primaryBtn} type="submit" disabled={loading}>
              {loading ? 'Gözlə...' : 'Davam et →'}
            </button>
            <p style={S.switchText}><a onClick={onBack} style={{ ...S.link, cursor: 'pointer' }}>← Daxil ol səhifəsinə qayıt</a></p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleAnswersSubmit} style={S.form}>
            {questions.map(q => (
              <div key={q.questionId}>
                <label style={S.label}>{q.text}</label>
                <input
                  style={S.input}
                  value={answers[q.questionId] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.questionId]: e.target.value }))}
                />
              </div>
            ))}
            <button style={S.primaryBtn} type="submit" disabled={loading}>
              {loading ? 'Yoxlanılır...' : 'Təsdiqlə →'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} style={S.form}>
            <label style={S.label}>Yeni şifrə</label>
            <input style={S.input} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} autoFocus />
            <label style={S.label}>Yeni şifrəni təkrarla</label>
            <input style={S.input} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            <button style={S.primaryBtn} type="submit" disabled={loading}>
              {loading ? 'Gözlə...' : 'Şifrəni Yenilə →'}
            </button>
          </form>
        )}

        {step === 4 && (
          <div style={{ ...S.form, textAlign: 'center', gap: 16 }}>
            <div style={{ fontSize: '2.5rem' }}>✅</div>
            <h2 style={{ ...S.title, fontSize: '1.2rem' }}>Şifrən Yeniləndi!</h2>
            <button style={S.primaryBtn} onClick={onBack} type="button">Daxil Ol səhifəsinə qayıt →</button>
          </div>
        )}
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
  switchText: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'center', margin: 0 },
  link: { color: 'var(--teal)', textDecoration: 'none' },
};