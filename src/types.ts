export type SectorTipo = 'Público' | 'Privado' | 'Seguridad Social / Obras Sociales' | '';
export type NivelComplejidad = 'Nivel I (Complejidad Alta)' | 'Nivel II (Complejidad Media)' | 'Nivel III (Complejidad Básica)' | '';
export type TipoInstitucionSec = 'Pública' | 'Privada' | 'Universitaria' | 'Municipal' | 'Provincial' | 'Nacional' | '';

export interface InformacionInstitucion {
  id: string;                      // Código único institucional automático (e.g. INST-XXXX)
  nombre: string;                  // Obligatorio, destacado
  nombreCorto: string;             // Nombre corto / sigla
  ciudad: string;
  provincia: string;
  localidad: string;               // Compatible con listados previos
  sector: SectorTipo;              // Compatible con listados previos
  tipoInstitucion: TipoInstitucionSec; // Pública, Privada, Universitaria, Municipal, Provincial, Nacional
  complejidad: NivelComplejidad;
  camasTotales: number;
  camasAisladas: number;
  fechaEvaluacion: string;         // Fecha de evaluación
  evaluadorResponsable: string;    // Evaluador responsable
  logoInstitucional: string;       // Clave o emoji de logo (e.g. "🏥", "🏢", "🏛️", "🩺", "❤️")
}

export interface Profesional {
  id: string;
  nombre: string;
  rol: string;
  especialidad: string;
  subespecialidad?: string;
  horasSemanales: number;
  certificacionSati: boolean;
  formacion?: string;
}

export interface ItemValoracionEstructura {
  id: string;
  grupo: 'Soporte y Planta Física' | 'Equipamiento Crítico' | 'Servicios de Apoyo (24hs)' | 'Calidad y Seguridad';
  label: string;
  descripcion: string;
  cumple: boolean;
  peso: number; // For weighting the score calculation
}

export interface ReporteValoracion {
  score: number;
  categoriaSugerida: string;
  puntosFuertes: string[];
  oportunidadesMejora: string[];
  analisisDetallado: string;
  recomendacionesDrAvila: string;
}

export type CategoriaEquipo = 'Soporte ventilatorio' | 'Monitoreo' | 'Infusión y medicación crítica' | 'Emergencia y paro' | 'Soporte extracorpóreo' | 'Tecnología digital';

export interface EquipoCritico {
  id: string;
  categoria: CategoriaEquipo;
  nombre: string;
  cantidadTotal: number;
  cantidadOperativa: number;
  cantidadFueraServicio: number;
  marca: string;
  modelo: string;
  serie?: string;
  anio: number;
  ultimoService: string;
  proximoService: string;
  mantenimientoPreventivo: boolean; // Sí / No
  calibracionVigente: 'Sí' | 'No' | 'No aplica' | string;
  backupDisponible: boolean; // Sí / No
  riesgoCritico: 'Bajo' | 'Medio' | 'Alto' | string;
  observaciones: string;
}


