// supabase/functions/register/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import bcrypt from 'npm:bcryptjs@2.4.3';
import { corsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const QUESTION_IDS = [1, 2, 3, 4, 5];
const SHADOW_DOMAIN = 'users.kodpiksel.internal';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { username, password, age, avatarEmoji, answers } = await req.json();

    const cleanUsername = (username || '').trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      return json({ error: 'İstifadəçi adı 3-20 simvol, yalnız hərf/rəqəm/alt xətt ola bilər.' }, 400);
    }
    if (!password || password.length < 6) {
      return json({ error: 'Şifrə ən azı 6 simvol olmalıdır.' }, 400);
    }
    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 5 || ageNum > 99) {
      return json({ error: 'Yaş düzgün deyil.' }, 400);
    }
    if (!Array.isArray(answers) || answers.length !== 5) {
      return json({ error: 'Bütün 5 sual cavablandırılmalıdır.' }, 400);
    }
    const answerMap = new Map(answers.map(a => [a.questionId, (a.answer || '').trim().toLowerCase()]));
    for (const qid of QUESTION_IDS) {
      if (!answerMap.get(qid)) return json({ error: 'Bütün 5 sual cavablandırılmalıdır.' }, 400);
    }

    // Case-insensitive uniqueness check
    const { data: existing } = await admin
      .from('profiles')
      .select('id')
      .ilike('username', cleanUsername)
      .maybeSingle();
    if (existing) return json({ error: 'Bu istifadəçi adı artıq mövcuddur.' }, 409);

    const shadowEmail = `${cleanUsername.toLowerCase()}@${SHADOW_DOMAIN}`;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: shadowEmail,
      password,
      email_confirm: true,
      user_metadata: { username: cleanUsername, age: ageNum, avatar_emoji: avatarEmoji },
    });
    if (createErr) return json({ error: createErr.message }, 400);

    const userId = created.user.id;

    // Belt-and-suspenders: make sure the profiles row has these fields
    // even if the on-signup trigger lags or doesn't read user_metadata.
    const { error: profileErr } = await admin
      .from('profiles')
      .upsert(
        { id: userId, username: cleanUsername, age: ageNum, avatar_emoji: avatarEmoji },
        { onConflict: 'id' }
      );
    if (profileErr) {
      console.error('profile upsert failed:', profileErr);
      await admin.auth.admin.deleteUser(userId).catch(() => {});
      return json({ error: 'Qeydiyyat uğursuz oldu, yenidən cəhd et.' }, 500);
    }

    const rows = await Promise.all(
      QUESTION_IDS.map(async (qid) => ({
        user_id: userId,
        question_id: qid,
         answer_hash: await bcrypt.hash(answerMap.get(qid), 10),
      }))
    );
    const { error: ansErr } = await admin.from('security_answers').insert(rows);
    if (ansErr) {
      console.error('security_answers insert failed:', ansErr);
      await admin.auth.admin.deleteUser(userId).catch(() => {});
      return json({ error: 'Qeydiyyat uğursuz oldu, yenidən cəhd et.' }, 500);
    }

    return json({ success: true });
  } catch (e) {
    console.error('register crashed:', e);
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});