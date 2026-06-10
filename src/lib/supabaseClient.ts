import { createClient } from "@supabase/supabase-js";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ygfbyqpitientqtuwaig.supabase.co";
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "PEGAR_PUBLISHABLE_KEY";

// Show exact values in console for verification
// @ts-ignore
console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
// @ts-ignore
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
