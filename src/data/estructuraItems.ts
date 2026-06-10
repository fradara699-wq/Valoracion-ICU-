import { ItemValoracionEstructura } from "../types";

export const DEFAULT_ESTRUCTURA_ITEMS: ItemValoracionEstructura[] = [
  // Soporte y Planta Física
  {
    id: "gases_centrales",
    grupo: "Soporte y Planta Física",
    label: "Gases Medicinales Centrales",
    descripcion: "Disponibilidad de Oxígeno, Aire Comprimido y Aspiración centralizada segura en el 100% de las bocas de cama.",
    cumple: false,
    peso: 10
  },
  {
    id: "grupo_electrogeno",
    grupo: "Soporte y Planta Física",
    label: "Grupo Electrógeno Automático",
    descripcion: "Generador de transferencia automática (< 10 segundos) con autonomía suficiente para la UTI, respiradores y monitoreo.",
    cumple: false,
    peso: 10
  },
  {
    id: "climatizacion_filtro",
    grupo: "Soporte y Planta Física",
    label: "Climatización con Presión y Filtro HEPA",
    descripcion: "Unidad con control de temperatura, humedad y renovación de aire. Al menos un box de aislamiento con presión negativa/positiva.",
    cumple: false,
    peso: 6
  },
  {
    id: "espacio_camas",
    grupo: "Soporte y Planta Física",
    label: "Espacio Físico Adecuado por Cama",
    descripcion: "Distancia mínima de 2.5 metros entre camas y espacio suficiente para libre circulación de personal y equipos de emergencia.",
    cumple: false,
    peso: 5
  },

  // Equipamiento Crítico
  {
    id: "arm_por_cama",
    grupo: "Equipamiento Crítico",
    label: "Asistencia Respiratoria Mecánica por Cama",
    descripcion: "Disponibilidad de un respirador microprocesado de alta gama por cada cama de la unidad (Relación 1 Res: 1 Cama).",
    cumple: false,
    peso: 12
  },
  {
    id: "monitores_multiparametricos",
    grupo: "Equipamiento Crítico",
    label: "Monitoreo Multiparamétrico Continuo",
    descripcion: "Monitor dedicado por cama con trazado ECG, saturación de O2, presión no invasiva (y capacidad de invasiva), y frecuencia respiratoria.",
    cumple: false,
    peso: 12
  },
  {
    id: "desfibriladores_uti",
    grupo: "Equipamiento Crítico",
    label: "Desfibrilador / Cardioversor Sincrónico",
    descripcion: "Al menos un desfibrilador bifásico con paletas pediátricas/adulto en el servicio (o uno cada 6-8 camas), verificado diariamente.",
    cumple: false,
    peso: 8
  },
  {
    id: "bombas_infusion",
    grupo: "Equipamiento Crítico",
    label: "Bombas de Infusión Contínua Jeringa/Volumen",
    descripcion: "Promedio de 4 o más bombas por cama para garantizar infusión precisa de drogas vasoactivas, sedación y nutrición enteral.",
    cumple: false,
    peso: 7
  },

  // Servicios de Apoyo (24hs)
  {
    id: "laboratorio_gases_rapido",
    grupo: "Servicios de Apoyo (24hs)",
    label: "Laboratorio de Gases y Medio Interno Crítico",
    descripcion: "Servicio propio o central de farmacia/laboratorio capaz de procesar estado ácido-base, electrolíticos y lactato en un lapso < 15 minutos.",
    cumple: false,
    peso: 8
  },
  {
    id: "imagenes_cabecera",
    grupo: "Servicios de Apoyo (24hs)",
    label: "Diagnóstico por Imágenes de Cabecera",
    descripcion: "Disponibilidad permanente de equipo portátil de Rayos X de alta resolución y Ecógrafo doppler avanzado en la unidad.",
    cumple: false,
    peso: 6
  },
  {
    id: "hemoterapia_rapida",
    grupo: "Servicios de Apoyo (24hs)",
    label: "Servicio de Hemoterapia las 24 Horas",
    descripcion: "Provisión inmediata de glóbulos rojos, plasma y plaquetas con protocolo establecido para transfusión masiva.",
    cumple: false,
    peso: 5
  },

  // Calidad y Seguridad
  {
    id: "comite_infecciones_activo",
    grupo: "Calidad y Seguridad",
    label: "Comité de Control de Infecciones (IACS)",
    descripcion: "Participación activa en el monitoreo de neumonías asociadas a ARM, infecciones de catéter, lavado de manos y uso de antibióticos.",
    cumple: false,
    peso: 8
  },
  {
    id: "registro_satiq",
    grupo: "Calidad y Seguridad",
    label: "Inscripción/Registro de datos en SATI-Q",
    descripcion: "Carga periódica de indicadores de calidad, mortalidad observada vs esperada (APAChE II / SAPS II), y días de ARM en SATI-Q.",
    cumple: false,
    peso: 5
  },
  {
    id: "protocolos_sedacion_weaning",
    grupo: "Calidad y Seguridad",
    label: "Protocolos Clínicos Escritos y Difundidos",
    descripcion: "Guías impresas o digitales del servicio para Weaning (destete), Sedo-analgésia guiada por escalas (RASS/CAM-ICU), y sepsis.",
    cumple: false,
    peso: 6
  },
  {
    id: "consentimiento_informado",
    grupo: "Calidad y Seguridad",
    label: "Formularios de Consentimiento Informado",
    descripcion: "Uso mandatorio de consentimiento por escrito específico del área crítica para procedimientos invasivos complejos.",
    cumple: false,
    peso: 4
  }
];
