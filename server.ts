import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Curated Guidelines and regulatory reference material from SATI and Ministerio de Salud de la Nación (Res 748/2014)
const GUIDELINES_REFERENCE = {
  titulo: "Directrices de Organización y Funcionamiento de las UCIs en Argentina",
  fuente: "SATI (Sociedad Argentina de Terapia Intensiva) & Res. 748/2014 Ministerio de Salud de la Nación",
  complejidades: {
    nivel1: {
      nombre: "Nivel I (Complejidad Alta)",
      descripcion: "Destinada a pacientes con disfunción multiorgánica compleja y grave. Requiere soporte vital integral continuo.",
      medicos: "1 médico especialista cada 8 camas (Guardia activa 24hs). Jefe de UTI especialista acreditado.",
      enfermeria: "Relación enfermero:paciente de 1:2 o 1:1 en casos de alta inestabilidad.",
      kinesiologia: "Kinesiólogo especialista en terapia intensiva disponible 24hs (mínimo 1 cada 8 camas).",
      equipamiento: "100% de las camas con asistencia respiratoria mecánica (ARM) de alta gama, monitoreo multiparamétrico continuo, gases medicinales redundantes y central de monitoreo."
    },
    nivel2: {
      nombre: "Nivel II (Complejidad Media)",
      descripcion: "Destinada a pacientes con disfunción monoparental o monitoreo estricto sin inestabilidad crítica multisistémica.",
      medicos: "1 médico especialista cada 8-10 camas. Especialista en guardia activa y pasiva coordinada.",
      enfermeria: "Relación enfermero:paciente de 1:3 o 1:4.",
      kinesiologia: "Kinesiólogo de guardia diária (mínimo 12 horas presenciales, guardia pasiva de noche).",
      equipamiento: "Mínimo 50% de las camas con capacidad de respirador mecánico (ARM) y monitores multiparamétricos en el resto."
    },
    nivel3: {
      nombre: "Nivel III (Complejidad Básica / Unidad de Cuidados Intermedios)",
      descripcion: "Destinada a pacientes estables pero que requieren monitoreo hemodinámico general u oxigenoterapia avanzada previa al alta.",
      medicos: "Médico clínico de guardia con apoyo de interconsulta permanente con UTI de mayor nivel.",
      enfermeria: "Relación enfermero:paciente de 1:4 o 1:5.",
      kinesiologia: "Kinesiólogo general a demanda o diurno regular (mínimo 4-6hs).",
      equipamiento: "Soporte no-invasivo, monitoreo electrocardiográfico básico, carro de paro y desfibrilador de fácil acceso."
    }
  },
  requisitosEstructuraClave: [
    { item: "Central de gases medicinales", nivelRequerido: "Todos (Oxígeno, Vacío y Aire Comprimido)" },
    { item: "Grupo electrógeno automático de transferencia rápida", nivelRequerido: "Todos" },
    { item: "Laboratorio de gases en sangre y electrolitos diurno/nocturno", nivelRequerido: "Nivel I (máx. 15 minutos de respuesta)" },
    { item: "Acceso a diagnóstico por imágenes móvil (Rayos X y Eco-Doppler de cabecera)", nivelRequerido: "Nivel I y II" },
    { item: "Comité de Control de Infecciones Asociadas al Cuidado de la Salud (IACS)", nivelRequerido: "Nivel I y II (Obligatorio por ley)" }
  ],
  sugestionRelacionHoras: {
    explicacion: "SATI sugiere un mínimo de 24 horas médicas de planta semanales por cada 4-6 camas, y presencia de coordinadores especializados con al menos 30 horas semanales para garantizar continuidad médica."
  },
  enlacesRelevantes: [
    { titulo: "SATI - Sociedad Argentina de Terapia Intensiva", url: "https://www.sati.org.ar" },
    { titulo: "Ministerio de Salud - Programas de Calidad de Atención Médica", url: "https://www.argentina.gob.ar/salud/calidad" },
    { titulo: "Directrices de Categorización de Unidades de Críticos (Boletín Oficial)", url: "https://www.boletinoficial.gob.ar" }
  ]
};

// API Route to provide static guidelines data
app.get("/api/config-data", (req, res) => {
  res.json(GUIDELINES_REFERENCE);
});

// API Route to request assessment using Gemini
app.post("/api/evaluar", async (req, res) => {
  const { institucion, profesionales, estructura, equipos = [] } = req.body;

  if (!institucion || !profesionales || !estructura) {
    return res.status(400).json({ error: "Faltan datos requeridos para la valoración (institucion, profesionales, estructura)." });
  }

  if (!ai) {
    // Graceful fallback if no API key is set
    return res.json({
      score: 65,
      categoriaSugerida: `${institucion.complejidad} - Estimación Local (Sin API Key)`,
      puntosFuertes: [
        "Se registraron los datos de la institución: " + (institucion.nombre || "Sin nombre"),
        "Se cargaron " + profesionales.length + " profesionales de salud",
        "Estructura ingresada con éxito"
      ],
      oportunidadesMejora: [
        "Configure la clave GEMINI_API_KEY para recibir una auditoría médica experta del Dr. Rafael Avila.",
        "Monitorear las horas ingresadas de kinesiología y medicina de planta para validar la norma SATI."
      ],
      analisisDetallado: `### Análisis Preliminar (Modo Desconectado)

El sistema está funcionando temporalmente con estimación estática de autoevaluación ya que la API Key de Gemini no está configurada o inyectada en el servidor.

Para el **${institucion.nombre}** en la provincia de **${institucion.provincia}**:
- Nivel declarado: *${institucion.complejidad}*
- Camas operativas: **${institucion.camasTotales}** total / **${institucion.camasAisladas}** aisladas.

## Evaluación de tecnología crítica y equipamiento biomédico

### Tabla de Estado Operativo de Equipamiento Crítico
| Equipo | Total | Operativo | Fuera de Servicio | Backup | Calibración | Riesgo |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
${equipos.map((e: any) => `| ${e.nombre} | ${e.cantidadTotal} | ${e.cantidadOperativa} | ${e.cantidadFueraServicio} | ${e.backupDisponible ? 'Sí' : 'No'} | ${e.calibracionVigente} | ${e.riesgoCritico} |`).join('\n')}

Se han inventariado **${equipos.length}** tipos de tecnologías de soporte vital y monitoreo. El software calcula que para **${institucion.camasTotales} camas totales**, se cuenta con equipamiento operativo clave. Configure la clave de API para activar el bot de Inteligencia Clínica y recibir un puntaje fino ponderado paso a paso con el estándar reglamentario de la República Argentina y un Plan completo de Renovación Tecnológica personalizado.`,
      recomendacionesDrAvila: "### Recomendaciones Generales\n\n1. **Dotación de Personal**: Respete las relaciones de personal recomendadas en la Resolución 748/2014 (1 enfermero cada 2 camas críticas en Alta Complejidad).\n2. **Acreditación SATI**: Promueva que el personal de guardia y de planta realice la certificación de especialista diurno.\n3. **Monitoreo Continuo**: Asegure que cada cama crítica cuente con un monitor multiparamétrico de al menos 5 canales y alarmas visibles desde el exterior de la unidad."
    });
  }

  try {
    // Build a structured prompt in Spanish to assess the ICU in detail
    const prompt = `Actúa como el prestigioso Dr. Rafael Avila (ex-presidente o referente emblemático de la Sociedad Argentina de Terapia Intensiva - SATI), un auditor clínico riguroso pero mentor constructivo de las Unidades de Cuidados Intensivos (UCIs/UTIs) en Argentina.
Evalúa minuciosamente los siguientes parámetros de una Unidad de Terapia Intensiva de la República Argentina, confrontándolos con la Resolución 748/2014 del Ministerio de Salud de la Nación y el estándar ideal de la SATI.

DATOS DE LA INSTITUCIÓN:
- Nombre: ${institucion.nombre}
- Provincia: ${institucion.provincia}
- Localidad: ${institucion.localidad}
- Sector: ${institucion.sector} (Público, Privado o Seguridad Social)
- Complejidad Declarada por la Institución: ${institucion.complejidad}
- Total de camas operativas: ${institucion.camasTotales}
- Camas con capacidad de aislamiento: ${institucion.camasAisladas}

LISTADO DE PERSONAL MÉDICO, COORDINADORES Y CON EL QUE CUENTAN:
${JSON.stringify(profesionales, null, 2)}

ITEMS VALORADOS DE ESTRUCTURA Y SEGURIDAD (Chequeados por la institución):
${JSON.stringify(estructura, null, 2)}

TECNOLOGÍA Y EQUIPAMIENTO CRÍTICO CARGADOS EN LA UTI (Inventariado):
${JSON.stringify(equipos, null, 2)}

Tu tarea es:
1. Calcular un Score global de 0 a 100 representativo de su conformidad con las normativas SATI.
2. Formular una "Categoría Sugerida" real basada en su desempeño (por ej. 'Nivel I (Complejidad Alta) - Acreditación Sólida', 'Nivel II con brechas moderadas', o 'Subcategorizado a Nivel III temporalmente').
3. Identificar 3 a 5 Puntos Fuertes específicos del personal, equipamientos o la estructura física cargados.
4. Identificar 3 o más Oportunidades de Mejora claves basándote en la relación de camas/médicos/horas de coordinación/kinesiología, o estructura de gases/apoyo cargados, o estado operativo de tecnologías críticas.
5. Elaborar un "Análisis Detallado" clínico con prosa formal, analizando la dotación de horas semanales de coordinadores (SATI pide jefes con al menos 30hs semanales y médicos especialistas de planta dedicados) y la disponibilidad de guardia activa. 

   DENTRO del "Análisis Detallado", es un REQUISITO MANDATORIO y CRÍTICO que incluyas una sección titulada exactamente "## Evaluación de tecnología crítica y equipamiento biomédico" (con tamaño de título h2 inmutable) que contenga de forma detallada:
   - Una tabla de Markdown resumida con los principales equipos, su disponibilidad y su relación operativa (Total vs Operativo).
   - Diagnóstico detallado del estado operativo de los equipos biomédicos.
   - Identificación de faltantes críticos o equipos que no cumplen con las directrices SATI para el nivel ${institucion.complejidad} (por ejemplo, carecer de respiradores para el 100% de las camas en Nivel I, falta de capnografía, etc.).
   - Riesgos identificados por falta de backup disponible, calibración vencida o mantenimiento vencido.
   - Recomendaciones estratégicas de ingeniería clínica y bioseguridad para mitigar los riesgos.
   - Un plan de renovación tecnológica estructurado a 5 años para amortizar y sustituir equipos obsoletos (por antigüedad).

6. Redactar "Recomendaciones del Dr. Rafael Avila" con tono de consejero sabio, brindando 3 o 4 directivas estratégicas, prácticas y logísticas para la mejora de la terapia. Use markdown.

Devuelve de manera MANDATORIA y EXCLUSIVA un objeto JSON bien formateado que respete fielmente el siguiente esquema:
{
  "score": number,
  "categoriaSugerida": "string",
  "puntosFuertes": ["string", "string", ...],
  "oportunidadesMejora": ["string", "string", ...],
  "analisisDetallado": "string (en markdown, español)",
  "recomendacionesDrAvila": "string (en markdown, español)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Puntaje de 0 a 100 ponderando la conformidad general con SATI." },
            categoriaSugerida: { type: Type.STRING, description: "Nivel recomendado o acreditación idónea según el análisis argentino." },
            puntosFuertes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de puntos altos identificados." },
            oportunidadesMejora: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Aspectos vulnerables a subsanar urgentemente." },
            analisisDetallado: { type: Type.STRING, description: "Disertación analítica profunda en markdown." },
            recomendacionesDrAvila: { type: Type.STRING, description: "Recomendaciones clínicas personalizadas en markdown con formato formal." }
          },
          required: ["score", "categoriaSugerida", "puntosFuertes", "oportunidadesMejora", "analisisDetallado", "recomendacionesDrAvila"]
        }
      }
    });

    const dataText = response.text || "";
    const parsedResult = JSON.parse(dataText.trim());
    res.json(parsedResult);
  } catch (err: any) {
    console.error("Error al evaluar con Gemini:", err);
    res.status(500).json({
      error: "Error interno en el procesamiento de la valoración por IA.",
      details: err.message
    });
  }
});

// Vite server integration or Production Static serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UCI Assessment API] Ready on http://localhost:${PORT}`);
  });
};

startServer();
