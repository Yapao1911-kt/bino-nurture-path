import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://akgrbwyrlqvxhzgoykpt.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_HmZ1YfIHkXCG8u_U1VZysg_pt-GsXGF";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
