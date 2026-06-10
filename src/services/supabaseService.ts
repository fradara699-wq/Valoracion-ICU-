import { supabase } from "../lib/supabaseClient";

export interface SupabaseInstitucion {
  id: string;
  nombre: string;
  ciudad: string;
  provincia: string;
  complejidad: string;
  evaluador: string;
  fecha_evaluacion: string;
  data: any; // Holds rest of active institution document
  created_at?: string;
}

// Checks if Supabase client is configured with a real key
export function isSupabaseConfigured(): boolean {
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";
  return key !== "" && key !== "PEGAR_PUBLISHABLE_KEY" && !key.includes("PEGAR_PUBLISHABLE");
}

/**
 * Saves or updates an institution record in the 'instituciones' table.
 */
export async function guardarInstitucionSupabase(supabaseData: SupabaseInstitucion) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado. Configure la clave 'VITE_SUPABASE_ANON_KEY' en el panel de secretos.");
  }

  // standard upsert matching on primary key 'id'
  const { data, error } = await supabase
    .from("instituciones")
    .upsert({
      id: supabaseData.id,
      nombre: supabaseData.nombre,
      ciudad: supabaseData.ciudad,
      provincia: supabaseData.provincia,
      complejidad: supabaseData.complejidad,
      evaluador: supabaseData.evaluador,
      fecha_evaluacion: supabaseData.fecha_evaluacion,
      data: supabaseData.data,
      created_at: supabaseData.created_at || new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) {
    console.error("Error guardando en Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Loads all stored institutions from 'instituciones' table, ordered by creation date descending.
 */
export async function cargarInstitucionesSupabase(): Promise<SupabaseInstitucion[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from("instituciones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando de Supabase:", error);
    throw new Error(error.message);
  }

  return (data as SupabaseInstitucion[]) || [];
}

/**
 * Deletes an institution from the 'instituciones' table.
 */
export async function eliminarInstitucionSupabase(id: string) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("instituciones")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminando de Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}
