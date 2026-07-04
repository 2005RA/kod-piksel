import { supabase } from './supabase'; // adjust path

// ── HIGHLIGHTS ────────────────────────────────────────────────
export async function loadHighlights(userId) {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveHighlight(userId, { text, source, color }) {
  const { data, error } = await supabase
    .from('highlights')
    .insert({ user_id: userId, text, source, color })
    .select()
    .single();
  if (error) throw error;
  return data; // returns row with real uuid id
}

export async function deleteHighlight(id) {
  const { error } = await supabase.from('highlights').delete().eq('id', id);
  if (error) console.error('deleteHighlight error:', error); // don't throw — silent is worse
}

// ── NOTEBOOK FILES ────────────────────────────────────────────
export async function loadNotebookFiles(userId) {
  const { data, error } = await supabase
    .from('file_manager_notes')
    .select('file_name, drawings, nodes')
    .eq('user_id', userId);
  if (error) throw error;
  // reshape into { fileName: { drawings, nodes } }
  return Object.fromEntries(data.map(r => [r.file_name, { drawings: r.drawings, nodes: r.nodes }]));
}

export async function upsertNotebookFile(userId, fileName, { drawings, nodes }) {
  const { error } = await supabase
    .from('file_manager_notes')
    .upsert(
      { user_id: userId, file_name: fileName, drawings, nodes, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,file_name' }
    );
  if (error) throw error;
}

export async function deleteNotebookFile(userId, fileName) {
  const { error } = await supabase
    .from('file_manager_notes')
    .delete()
    .eq('user_id', userId)
    .eq('file_name', fileName);
  if (error) throw error;
}