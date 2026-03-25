import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kwwldypdbzdmxwffqpzq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_cBmnGHQjiTy8KFGfYEJuJg_MDKXNOEF';

export const supabase = createClient(supabaseUrl, supabaseKey);
