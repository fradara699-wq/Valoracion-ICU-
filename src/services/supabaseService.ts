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

export interface SupabaseConfigStatus {
  configured: boolean;
  missingUrl: boolean;
  missingKey: boolean;
  url: string;
  key: string;
}

// Retrieves configuration status and exact values for diagnostic reporting
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  // @ts-ignore
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  // @ts-ignore
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const isUrlValid = url.trim() !== "" && !url.includes("PEGAR_") && !url.includes("MY_APP_");
  const isKeyValid = key.trim() !== "" && key !== "PEGAR_PUBLISHABLE_KEY" && !key.includes("PEGAR_PUBLISHABLE") && !key.includes("PEGAR_");

  return {
    configured: isUrlValid && isKeyValid,
    missingUrl: !isUrlValid,
    missingKey: !isKeyValid,
    url,
    key
  };
}

// Checks if Supabase client is configured with a real key
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfigStatus().configured;
}

/**
 * Test the connection to Supabase database by attempting to query one ID from the 'instituciones' table.
 */
export async function probarConexionSupabase(): Promise<{ success: boolean; message: string }> {
  const status = getSupabaseConfigStatus();
  if (!status.configured) {
    let missingInfo = "";
    if (status.missingUrl && status.missingKey) {
      missingInfo = "Faltan configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.";
    } else if (status.missingUrl) {
      missingInfo = "Falta configurar la variable de entorno VITE_SUPABASE_URL.";
    } else {
      missingInfo = "Falta configurar la de entorno VITE_SUPABASE_ANON_KEY.";
    }
    return { success: false, message: missingInfo };
  }

  try {
    const { error } = await supabase.from("instituciones").select("id").limit(1);
    if (error) {
      console.warn("Error en prueba de conexión con Supabase:", error);
      return { success: false, message: `Error en la base de datos: ${error.message}` };
    }
    return { success: true, message: "Supabase conectado correctamente" };
  } catch (err: any) {
    console.warn("Excepción al probar conexión con Supabase:", err);
    return { success: false, message: `Error de red o configuración: ${err.message || err}` };
  }
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
    console.warn("Error guardando en Supabase:", error);
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
    console.warn("Error cargando de Supabase:", error);
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
    console.warn("Error eliminando de Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}
