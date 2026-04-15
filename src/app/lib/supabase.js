import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vzxwpjjdziizkzjtqggn.supabase.co";
const supabaseKey = "sb_publishable_nWMPpX6wyv-im1UMADzPmA_J2Ej30UB";

export const supabase = createClient(supabaseUrl, supabaseKey);