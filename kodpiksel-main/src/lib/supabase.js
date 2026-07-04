import { createClient } from '@supabase/supabase-js';

// We point to the variable NAMES from your .env file, not the raw keys!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);