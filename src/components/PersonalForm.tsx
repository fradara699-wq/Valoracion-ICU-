import React from "react";
import { Profesional } from "../types";
import { UserPlus, Trash2, Award, Clock, Users, UsersRound, HelpCircle, Copy, Plus } from "lucide-react";

interface Props {
  profesionales: Profesional[];
  onChange: (updated: Profesional[]) => void;
  filterRoleGroup?: "medicos" | "enfermeria" | "multidisciplinario";
}

const ROLES = [
  "Médico de Guardia",
  "Médico de Planta",
  "Coordinador de UTI",
  "Jefe de Servicio",
  "Kinesiólogo Intensivista",
  "Enfermero/a Profesional"
];

const ESPECIALIDADES = [
  "Terapia Intensiva (SATI)",
  "Clínica Médica",
  "Cardiología",
  "Anestesiología",
  "Nefrología",
  "Kinesiología Respiratoria",
  "Enfermería de Cuidados Críticos",
  "Medicina de Emergencias"
];

export const PersonalForm: React.FC<Props> = ({ profesionales, onChange, filterRoleGroup }) => {
  // Classification utilities
  const isMedico = (p: Profesional) => {
    const r = (p.rol || "").toLowerCase();
    return ["médico de guardia", "médico de planta", "coordinador de uti", "jefe de servicio"].includes(r) ||
           r.includes("médic") || r.includes("jefe") || r.includes("coordinador") || r.includes("director");
  };

  const isEnfermero = (p: Profesional) => {
    const r = (p.rol || "").toLowerCase();
    return r === "enfermero/a profesional" || r.includes("enfermer") || r.includes("enf");
  };

  const isMultidisciplinario = (p: Profesional) => {
    return !isMedico(p) && !isEnfermero(p);
  };

  // Filter based on the selected segment
  let filteredList = profesionales;
  if (filterRoleGroup === "medicos") {
    filteredList = profesionales.filter(isMedico);
  } else if (filterRoleGroup === "enfermeria") {
    filteredList = profesionales.filter(isEnfermero);
  } else if (filterRoleGroup === "multidisciplinario") {
    filteredList = profesionales.filter(isMultidisciplinario);
  }

  // Add direct row
  const handleAddFila = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    
    let defaultRol = "Médico de Guardia";
    let defaultEspecialidad = "Terapia Intensiva (SATI)";
    
    if (filterRoleGroup === "enfermeria") {
      defaultRol = "Enfermero/a Profesional";
      defaultEspecialidad = "Enfermería de Cuidados Críticos";
    } else if (filterRoleGroup === "multidisciplinario") {
      defaultRol = "Kinesiólogo Intensivista";
      defaultEspecialidad = "Kinesiología Respiratoria";
    }

    const newProf: Profesional = {
      id: randomId,
      nombre: "Nuevo Profesional",
      rol: defaultRol,
      especialidad: defaultEspecialidad,
      subespecialidad: "",
      horasSemanales: defaultRol.startsWith("Enfermer") ? 40 : 30,
      certificacionSati: false,
      formacion: ""
    };
    onChange([...profesionales, newProf]);
  };

  // Duplicate direct row
  const handleDuplicateFila = (p: Profesional) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const duplicatedProf: Profesional = {
      ...p,
      id: randomId,
      nombre: `${p.nombre} (Duplicado)`
    };
    onChange([...profesionales, duplicatedProf]);
  };

  // Remove direct row
  const handleRemoveFila = (id: string) => {
    onChange(profesionales.filter(p => p.id !== id));
  };

  // Cell change handler
  const handleUpdateField = (id: string, key: keyof Profesional, value: any) => {
    onChange(
      profesionales.map(p => {
        if (p.id === id) {
          return { ...p, [key]: value };
        }
        return p;
      })
    );
  };

  // Quick stats calculations
  const totalMedicos = profesionales.filter(isMedico).length;
  const totalKinesiologos = profesionales.filter(p => (p.rol || "").toLowerCase().includes("kinesiólogo") || (p.rol || "").toLowerCase().includes("kine")).length;
  const totalEnfermeros = profesionales.filter(isEnfermero).length;
  const certificadoSatiCount = profesionales.filter(p => p.certificacionSati).length;
  const totalHorasSemanales = profesionales.reduce((sum, p) => sum + (Number(p.horasSemanales) || 0), 0);

  // Segment headers mapping
  const contentMap = {
    medicos: {
      title: "Staff de Médicos UTI",
      desc: "Gestión directa del plantel de médicos jefes, coordinadores y profesionales de planta y guardia activa para la terapia intensiva.",
      labelCount: "médicos registrados"
    },
    enfermeria: {
      title: "Staff de Enfermería UTI",
      desc: "Gestión directa del plantel de enfermeros, enfermeras de cuidados críticos, y la cobertura de horas de atención directa asignadas.",
      labelCount: "enfermeros registrados"
    },
    multidisciplinario: {
      title: "Equipo Multidisciplinario y de Apoyo UTI",
      desc: "Gestión del personal especializado adicional: kinesiólogos intensivistas, residentes, bioquímicos, psicólogos y farmacéuticos dedicados.",
      labelCount: "profesionales especializados registrados"
    },
    default: {
      title: "Plantel de Coordinación, Personal y Horas UTI",
      desc: "Planilla de carga libre para médicos, kinesiólogos, enfermeros y personal de apoyo. Carga y edita directamente sus datos de manera fluida.",
      labelCount: "filas cargadas"
    }
  }[filterRoleGroup || "default"];

  return (
    <div id="personal-section-container" className="space-y-6">
      
      {/* Introduction Dashboard Banner */}
      <div className="bg-white rounded-2xl border border-slate-205 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Users id="icon-staff" className="w-6 h-6" />
            </div>
            <div>
              <h2 id="title-staff" className="text-xl font-bold text-slate-900 tracking-tight font-sans uppercase">
                {contentMap.title}
              </h2>
              <p id="desc-staff" className="text-sm text-slate-505 dark:text-slate-450 mt-1">
                {contentMap.desc}
              </p>
            </div>
          </div>
          <button
            id="btn-agregar-personal-top"
            type="button"
            onClick={handleAddFila}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Profesional</span>
          </button>
        </div>

        {/* Quick Metrics Dashboard Bar */}
        <div id="quick-indicators-row" className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" /> Médicos
            </span>
            <span id="indicator-medicos" className="text-lg font-extrabold text-slate-800">{totalMedicos}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <UsersRound className="w-3 h-3 text-amber-500" /> Kinesiología
            </span>
            <span id="indicator-kinesiologos" className="text-lg font-extrabold text-slate-800">{totalKinesiologos}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <UsersRound className="w-3 h-3 text-indigo-500" /> Enfermeros
            </span>
            <span id="indicator-enfermeros" className="text-lg font-extrabold text-slate-800">{totalEnfermeros}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" /> Acred. SATI
            </span>
            <span id="indicator-certsati" className="text-lg font-extrabold text-emerald-600">{certificadoSatiCount}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" /> Horas UTI
            </span>
            <span id="indicator-total-horas" className="text-lg font-extrabold text-slate-800">{totalHorasSemanales}hs</span>
          </div>
        </div>
      </div>

      {/* Spreadsheet Editable Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planilla de Staff Clínico (Excel Style)</span>
          <span className="text-xs font-mono text-slate-400">{profesionales.length} filas cargadas</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/50 text-[11px] uppercase text-slate-500 font-extrabold border-b border-slate-200">
                <th className="px-4 py-3 w-[22%]">Nombre del Profesional</th>
                <th className="px-3 py-3 w-[18%]">Rol en UTI</th>
                <th className="px-3 py-3 w-[18%]">Especialidad</th>
                <th className="px-3 py-3 w-[12%]">Subespecialidad</th>
                <th className="px-3 py-3 w-[9%] text-center">Horas Sem.</th>
                <th className="px-3 py-3 w-[12%]">Formación</th>
                <th className="px-3 py-3 w-[4%] text-center">SATI?</th>
                <th className="px-4 py-3 w-[12%] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profesionales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                    No hay profesionales registrados. Haga click en el botón <strong>"+ Agregar fila"</strong> para comenzar a cargar.
                  </td>
                </tr>
              ) : (
                profesionales.map((p) => {
                  const hasCustomRol = p.rol && !ROLES.includes(p.rol);
                  const hasCustomEsp = p.especialidad && !ESPECIALIDADES.includes(p.especialidad);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Nombre */}
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={p.nombre}
                          onChange={(e) => handleUpdateField(p.id, "nombre", e.target.value)}
                          placeholder="Ej. Dr. Bernardo Houssay"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </td>

                      {/* Rol */}
                      <td className="px-3 py-2 space-y-1">
                        <select
                          value={hasCustomRol ? "Otro" : p.rol}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Otro") {
                              handleUpdateField(p.id, "rol", "Otro");
                            } else {
                              handleUpdateField(p.id, "rol", val);
                            }
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        >
                          <option value="">Seleccione...</option>
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                          <option value="Otro">Otro</option>
                        </select>
                        {(hasCustomRol || p.rol === "Otro") && (
                          <input
                            type="text"
                            value={p.rol === "Otro" ? "" : p.rol}
                            onChange={(e) => handleUpdateField(p.id, "rol", e.target.value)}
                            placeholder="Especificar rol..."
                            className="w-full px-2.5 py-1 border border-blue-300 rounded-lg text-xs font-sans text-blue-900 bg-blue-50/20 focus:bg-white outline-none"
                          />
                        )}
                      </td>

                      {/* Especialidad */}
                      <td className="px-3 py-2 space-y-1">
                        <select
                          value={hasCustomEsp ? "Otro" : p.especialidad}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Otro") {
                              handleUpdateField(p.id, "especialidad", "Otro");
                            } else {
                              handleUpdateField(p.id, "especialidad", val);
                            }
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        >
                          <option value="">Seleccione...</option>
                          {ESPECIALIDADES.map(e => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                          <option value="Otro">Otro</option>
                        </select>
                        {(hasCustomEsp || p.especialidad === "Otro") && (
                          <input
                            type="text"
                            value={p.especialidad === "Otro" ? "" : p.especialidad}
                            onChange={(e) => handleUpdateField(p.id, "especialidad", e.target.value)}
                            placeholder="Especificar especialidad..."
                            className="w-full px-2.5 py-1 border border-blue-300 rounded-lg text-xs font-sans text-blue-900 bg-blue-50/20 focus:bg-white outline-none"
                          />
                        )}
                      </td>

                      {/* Subespecialidad */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={p.subespecialidad || ""}
                          onChange={(e) => handleUpdateField(p.id, "subespecialidad", e.target.value)}
                          placeholder="Ej. Cardio / Neuro"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </td>

                      {/* Horas Semanales */}
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          value={p.horasSemanales}
                          step="any"
                          min="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateField(p.id, "horasSemanales", val === "" ? 0 : Number(val));
                          }}
                          className="w-20 mx-auto px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-800 focus:bg-white focus:border-blue-500"
                        />
                      </td>

                      {/* Formación */}
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={p.formacion || ""}
                          onChange={(e) => handleUpdateField(p.id, "formacion", e.target.value)}
                          placeholder="Ej. Residencia / Fellowship"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-sans text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                        />
                      </td>

                      {/* Certificación SATI (Checkbox) */}
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={p.certificacionSati}
                          onChange={(e) => handleUpdateField(p.id, "certificacionSati", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateFila(p)}
                            className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Duplicar esta fila"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplicar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFila(p.id)}
                            className="p-1 px-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-red-200"
                            title="Eliminar esta fila"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Add Row */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button
            id="btn-agregar-personal-bottom"
            type="button"
            onClick={handleAddFila}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>+ Agregar Fila</span>
          </button>
        </div>
      </div>

      {/* Warnings checks block */}
      {profesionales.length > 0 && (
        <div id="compliance-warnings-div" className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/60 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed">
            <strong>Autochequeo Normativa SATI:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              {profesionales.filter(p => ["Jefe de Servicio", "Coordinador de UTI"].includes(p.rol)).length === 0 ? (
                <li className="text-amber-800 font-medium">⚠️ No se cargaron Jefes de Servicio o Coordinadores clínicos para coordinar la unidad de terapia intensiva.</li>
              ) : (
                <li>✅ Coordinación reglamentaria identificada en el equipo clínico ({profesionales.filter(p => ["Jefe de Servicio", "Coordinador de UTI"].includes(p.rol)).map(p => p.nombre).join(", ")}).</li>
              )}
              {totalKinesiologos === 0 ? (
                <li className="text-amber-800 font-medium">⚠️ La Resolución 748/2014 determina obligatoria la presencia de un Kinesiólogo para soporte respiratorio diurno o de guardia.</li>
              ) : (
                <li>✅ Soporte kinésico intensivista activo programado.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
