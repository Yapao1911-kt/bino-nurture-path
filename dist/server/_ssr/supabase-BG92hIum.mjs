import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
const supabaseUrl = "https://akgrbwyrlqvxhzgoykpt.supabase.co";
const supabaseAnonKey = "sb_publishable_HmZ1YfIHkXCG8u_U1VZysg_pt-GsXGF";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {
  supabase as s
};
