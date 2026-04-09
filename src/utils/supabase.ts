import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rifxyngoyxwinddmnvhq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_kAE8XhsHbXEiC5Ldphs1qQ_GgnwTR-c';

export const supabase = createClient(supabaseUrl, supabaseKey);
