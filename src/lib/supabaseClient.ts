import { createClient } from "@supabase/supabase-js";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Show exact values in console for verification
// @ts-ignore
console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
// @ts-ignore
console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK" : "MISSING");

export const supabase = createClient(
  supabaseUrl || "https://ygfbyqpitientqtuwaig.supabase.co", 
  supabaseAnonKey || "PEGAR_PUBLISHABLE_KEY"
);
