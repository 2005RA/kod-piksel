// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const SHADOW_DOMAIN = 'users.kodpiksel.internal';
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function shadowEmail(username) {
  return `${username.trim().toLowerCase()}@${SHADOW_DOMAIN}`;
}

async function callFunction(name, body) {
  const res = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Sorğu uğursuz oldu.');
  return data;
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error) setProfile(data);
  }, []);

  // ── Strip OAuth token fragment from the URL ──
  // After a Google OAuth redirect, Supabase reads the session out of the
  // `#access_token=...` URL fragment but never removes it — the token
  // then sits in the address bar and browser history indefinitely.
  const stripAuthHashFromUrl = useCallback(() => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
  }, []);

  // ── Boot: restore session ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        stripAuthHashFromUrl();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        stripAuthHashFromUrl();
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, stripAuthHashFromUrl]);

  // ── Register with username + password + 5 security answers ──
  async function registerWithUsername({ username, password, age, avatarEmoji, answers }) {
    await callFunction('register', { username, password, age, avatarEmoji, answers });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: shadowEmail(username),
      password,
    });
    if (error) throw error;
    return data;
  }

  // ── Login with username + password ──
  async function loginWithUsername({ username, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: shadowEmail(username),
      password,
    });
    if (error) throw new Error('İstifadəçi adı və ya şifrə yanlışdır.');
    return data;
  }

  // ── Login with Google ──
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  // ── Forgot password (3-step) ──
  async function requestPasswordReset(username) {
    return callFunction('request-reset', { username }); // → { questions: [{questionId, text}, ...] }
  }
  async function verifyResetAnswers(username, answers) {
    return callFunction('verify-answers', { username, answers }); // → { token }
  }
  async function resetPassword(token, newPassword) {
    return callFunction('reset-password', { token, newPassword });
  }

  // ── Change password while logged in ──
  async function changePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  // ── Logout ──
  async function logout() {
    await supabase.auth.signOut();
  }

  // ── Update profile ──
  async function updateProfile(fields) {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', user.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      registerWithUsername, loginWithUsername, loginWithGoogle, logout, updateProfile, fetchProfile,
      requestPasswordReset, verifyResetAnswers, resetPassword, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}