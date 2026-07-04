// supabase/functions/reset-password/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword || newPassword.length < 6) {
      return json({ error: 'Yanlış sorğu.' }, 400);
    }

    const { data: row } = await admin
      .from('password_reset_tokens')
      .select('token, user_id, expires_at, used')
      .eq('token', token)
      .maybeSingle();

    if (!row || row.used || new Date(row.expires_at) < new Date()) {
      return json({ error: 'Token etibarsız və ya vaxtı bitib.' }, 400);
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(row.user_id, { password: newPassword });
    if (updErr) return json({ error: updErr.message }, 500);

    await admin.from('password_reset_tokens').update({ used: true }).eq('token', token);
    return json({ success: true });
  } catch {
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});