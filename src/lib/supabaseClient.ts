import { createClient } from "@supabase/supabase-js";

// We read from Vite's environment variables. 
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "https://ygfbyqpitientqtuwaig.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "PEGAR_PUBLISHABLE_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
