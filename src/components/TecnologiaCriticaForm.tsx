import React, { useState, useMemo } from "react";
import { EquipoCritico, CategoriaEquipo } from "../types";
import { 
  Cpu, 
  Check, 
  AlertTriangle, 
  Gauge, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle, 
  Wrench, 
  Calendar, 
  Clock, 
  Plus, 
  Activity,
  Trash2,
  Copy,
  Info
} from "lucide-react";

interface Props {
  equipos: EquipoCritico[];
  onChange: (updated: EquipoCritico[]) => void;
  camasTotales: number;
}

const CATEGORIAS_METADATA: { id: CategoriaEquipo; label: string; icon: any; color: string }[] = [
  { id: "Soporte ventilatorio", label: "A. Soporte Ventilatorio", icon: Cpu, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { id: "Monitoreo", label: "B. Monitoreo", icon: Activity, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { id: "Infusión y medicación crítica", label: "C. Infusión y Medicación Crítica", icon: Gauge, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { id: "Emergencia y paro", label: "D. Emergencia y Paro", icon: ShieldCheck, color: "text-rose-600 bg-rose-50 border-rose-100" },
  { id: "Soporte extracorpóreo", label: "E. Soporte Extracorpóreo", icon: Wrench, color: "text-amber-600 bg-amber-50 border-amber-100" },
  { id: "Tecnología digital", label: "F. Tecnología Digital", icon: Settings, color: "text-purple-600 bg-purple-50 border-purple-100" }
];

export const TecnologiaCriticaForm: React.FC<Props> = ({ equipos, onChange, camasTotales }) => {
  const [activeCategory, setActiveCategory] = useState<CategoriaEquipo>("Soporte ventilatorio");
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(equipos[0]?.id || null);

  // Expanded categories state for visibility
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    "Soporte ventilatorio": true,
    "Monitoreo": true,
    "Infusión y medicación crítica": false,
    "Emergencia y paro": false,
    "Soporte extracorpóreo": false,
    "Tecnología digital": false
  });

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Currently inspected equipment
  const selectedEquipo = useMemo(() => {
    return equipos.find(e => e.id === selectedEquipoId) || equipos[0];
  }, [equipos, selectedEquipoId]);

  // Handler for deep field updates including total/operational recalculation
  const handleUpdateItem = (id: string, key: keyof EquipoCritico, value: any) => {
    const updated = equipos.map(e => {
      if (e.id === id) {
        const next = { ...e, [key]: value };
        // Recalculate fuera de servicio if total or operational changes
        if (key === "cantidadTotal" || key === "cantidadOperativa") {
          const total = key === "cantidadTotal" ? (value === "" ? 0 : Number(value)) : e.cantidadTotal;
          const operativa = key === "cantidadOperativa" ? (value === "" ? 0 : Number(value)) : e.cantidadOperativa;
          next.cantidadTotal = total;
          next.cantidadOperativa = operativa;
          next.cantidadFueraServicio = Math.max(0, total - operativa);
        }
        return next;
      }
      return e;
    });
    onChange(updated);
  };

  // Scores calculations
  const scores = useMemo(() => {
    let totalEquipamiento = 0;
    let totalOperativo = 0;
    let conMantenimiento = 0;
    let criticosTotales = 0;
    let criticosConBackup = 0;
    let obsoletos = 0;
    const currentYear = 2026;

    equipos.forEach(e => {
      totalEquipamiento += (Number(e.cantidadTotal) || 0);
      totalOperativo += (Number(e.cantidadOperativa) || 0);
      
      if (e.mantenimientoPreventivo) {
        conMantenimiento++;
      }
      if (e.riesgoCritico === "Alto") {
        criticosTotales++;
        if (e.backupDisponible) {
          criticosConBackup++;
        }
      }
      if ((currentYear - e.anio) > 10) {
        obsoletos++;
      }
    });

    const disponibilidad = totalEquipamiento > 0 
      ? Math.round((totalOperativo / totalEquipamiento) * 100) 
      : 0;

    const mantenimientoVigente = equipos.length > 0
      ? Math.round((conMantenimiento / equipos.length) * 100)
      : 0;

    const criticosBackup = criticosTotales > 0
      ? Math.round((criticosConBackup / criticosTotales) * 100)
      : 0;

    const obsolescenciaIndex = equipos.length > 0
      ? Math.round((obsoletos / equipos.length) * 100)
      : 0;

    let scoreTotal = Math.round((disponibilidad * 0.4) + (mantenimientoVigente * 0.3) + (criticosBackup * 0.3));
    
    if (obsolescenciaIndex > 40) {
      scoreTotal = Math.max(0, scoreTotal - 10);
    }

    let clasificacion: "Óptimo" | "Adecuado" | "Vulnerable" | "Crítico" = "Crítico";
    let colorClass = "text-red-700 bg-red-50 border-red-200";

    if (scoreTotal >= 85) {
      clasificacion = "Óptimo";
      colorClass = "text-emerald-800 bg-emerald-50 border-emerald-200";
    } else if (scoreTotal >= 70) {
      clasificacion = "Adecuado";
      colorClass = "text-blue-800 bg-blue-50 border-blue-200";
    } else if (scoreTotal >= 50) {
      clasificacion = "Vulnerable";
      colorClass = "text-amber-800 bg-amber-50 border-amber-200";
    }

    return {
      disponibilidad,
      mantenimientoVigente,
      criticosBackup,
      obsolescenciaIndex,
      scoreTotal,
      clasificacion,
      colorClass
    };
  }, [equipos]);

  // Automatic Alerts generation
  const alertas = useMemo(() => {
    const list: string[] = [];
    const currentYear = 2026;

    const respInvVal = equipos.find(e => e.id === "eq-resp-inv" || e.nombre.toLowerCase().includes("invasivo"));
    if (respInvVal && respInvVal.cantidadOperativa < camasTotales) {
      list.push(`Capacidad Vital: Respiradores invasivos operativos (${respInvVal.cantidadOperativa}) menores que las camas totales del servicio (${camasTotales}). Cobertura deficiente.`);
    }

    const bombasVol = equipos.find(e => e.id === "eq-bomba-vol")?.cantidadOperativa || 0;
    const bombasJer = equipos.find(e => e.id === "eq-bomba-jer")?.cantidadOperativa || 0;
    const totalBombas = bombasVol + bombasJer;
    const promedioPorCama = camasTotales > 0 ? (totalBombas / camasTotales).toFixed(1) : "0";
    if (totalBombas < (4 * camasTotales)) {
      list.push(`Drogas Críticas: Densidad de Bombas de Infusión insuficiente (${promedioPorCama}/cama operativo). La SATI requiere un mínimo de 4 por cama para garantizar goteos vasoactivos seguros.`);
    }

    const carroParo = equipos.find(e => e.id === "eq-carro-paro" || e.nombre.toLowerCase().includes("carro"));
    if (carroParo && (carroParo.cantidadOperativa < 1 || !carroParo.mantenimientoPreventivo)) {
      list.push(`Emergencia Extrema: Carro de Paro comprometido (Fuera de servicio operativo o sin control preventivo mensual vigente).`);
    }

    const desfi = equipos.find(e => e.id === "eq-desfibrilador" || e.nombre.toLowerCase().includes("desfibrilador"));
    if (desfi && (desfi.cantidadOperativa < 1 || !desfi.mantenimientoPreventivo || desfi.calibracionVigente === "No")) {
      list.push(`Seguridad Eléctrica: Desfibrilador bifásico crítico reportado con calibración vencida o mantenimiento técnico ausente.`);
    }

    equipos.forEach(e => {
      if (e.riesgoCritico === "Alto" && !e.mantenimientoPreventivo) {
        list.push(`Mantenimiento Preventivo: El dispositivo vital "${e.nombre}" de riesgo crítico no posee cobertura técnica vigente.`);
      }
    });

    const respInvBackup = equipos.find(e => e.id === "eq-resp-inv" || e.nombre.toLowerCase().includes("invasivo"));
    if (respInvBackup && !respInvBackup.backupDisponible) {
      list.push(`Falla Redundancia: No existe equipo de contingencia (Backup) para Soporte Ventilatorio Invasivo.`);
    }
    const monBackup = equipos.find(e => e.id === "eq-mon-multip" || e.nombre.toLowerCase().includes("multiparamétrico"));
    if (monBackup && !monBackup.backupDisponible) {
      list.push(`Falla Redundancia: Monitoreo Multiparamétrico continuo sin dispositivo de resguardo homologado.`);
    }

    equipos.forEach(e => {
      if ((currentYear - e.anio) > 10) {
        list.push(`Obsolescencia Tecnológica: ${e.nombre} posee una antigüedad de ${currentYear - e.anio} años (${e.anio}). Requiere plan de amortización.`);
      }
    });

    return list;
  }, [equipos, camasTotales]);

  // Handler to add a new custom equipment row to the target category
  const handleAddNewCustomUnit = (targetCat?: CategoriaEquipo) => {
    const selectedCategory = targetCat || activeCategory;
    const randomId = `eq-custom-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUnit: EquipoCritico = {
      id: randomId,
      categoria: selectedCategory,
      nombre: "Nuevo Dispositivo Médico",
      cantidadTotal: 1,
      cantidadOperativa: 1,
      cantidadFueraServicio: 0,
      marca: "Marca genérica",
      modelo: "Modelo base",
      serie: "",
      anio: 2023,
      ultimoService: new Date().toISOString().split("T")[0],
      proximoService: new Date().toISOString().split("T")[0],
      mantenimientoPreventivo: true,
      calibracionVigente: "Sí",
      backupDisponible: false,
      riesgoCritico: "Medio",
      observaciones: ""
    };
    onChange([...equipos, newUnit]);
    setSelectedEquipoId(randomId);
  };

  // Handler to duplicate a row
  const handleDuplicateUnit = (origin: EquipoCritico) => {
    const randomId = `eq-custom-${Math.floor(1000 + Math.random() * 9000)}`;
    const duplicatedUnit: EquipoCritico = {
      ...origin,
      id: randomId,
      nombre: `${origin.nombre} (Duplicado)`
    };
    onChange([...equipos, duplicatedUnit]);
    setSelectedEquipoId(randomId);
  };

  // Delete row
  const handleDeleteUnit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(equipos.filter(item => item.id !== id));
    if (selectedEquipoId === id) {
      setSelectedEquipoId(null);
    }
  };

  return (
    <div id="tecnologia-completa-wrapper" className="space-y-8">
      
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-950 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2 bg-white/10 rounded-xl leading-none select-none">
              🔬
            </span>
            <div>
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] uppercase font-black px-2.5 py-0.5 rounded border border-indigo-500/30 font-mono tracking-widest block w-max mb-1">
                GESTIÓN DE DISPOSITIVOS BIOMÉDICOS
              </span>
              <h3 className="text-lg font-bold tracking-tight text-white uppercase">
                Evaluación de Tecnología y Equipamiento Crítico
              </h3>
              <p className="text-xs text-slate-300 leading-normal max-w-3xl mt-0.5">
                Mapee y edite libremente el inventario de soporte vital. Todas las celdas de las tablas inferiores son editables en tiempo real para simular con precisión la planilla institucional.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-emerald-400 font-mono text-xs font-black border border-emerald-500/30 px-3 py-1 bg-emerald-950/40 rounded-full block text-center">
              Planilla Interactiva Activa
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Aspect: Collapsible Lists & Spreadsheet Forms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Collapsible Category Groups */}
          <div className="space-y-4">
            {CATEGORIAS_METADATA.map((catInfo) => {
              const isExpanded = expandedCats[catInfo.id];
              const categoryItems = equipos.filter(e => e.categoria === catInfo.id);
              const CatIcon = catInfo.icon;

              return (
                <div 
                  key={catInfo.id} 
                  className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
                    activeCategory === catInfo.id ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-205"
                  }`}
                  onClick={() => setActiveCategory(catInfo.id)}
                >
                  
                  {/* Category Header Bar */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryExpand(catInfo.id);
                      setActiveCategory(catInfo.id);
                    }}
                    className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-xl text-sm shrink-0 ${catInfo.color}`}>
                        <CatIcon className="w-4.5 h-4.5" />
                      </span>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-none">{catInfo.label}</h4>
                        <span className="text-[10px] font-bold text-slate-400 block mt-1.5">
                          {categoryItems.length} tipos de dispositivos registrados
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full font-mono border border-indigo-100">
                        DISP: {Math.round((categoryItems.reduce((acc, current) => acc + (Number(current.cantidadOperativa) || 0), 0) / Math.max(1, categoryItems.reduce((acc, current) => acc + (Number(current.cantidadTotal) || 0), 0))) * 100)}%
                      </span>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Category Items List (Fully editable spreadsheet rows inside) */}
                  {isExpanded && (
                    <div className="p-4 overflow-x-auto w-full">
                      <table className="w-full text-left font-sans text-xs border-collapse min-w-[800px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500 font-extrabold bg-slate-100/50">
                            <th className="px-3 py-2 w-[22%]">Equipo / Dispositivo</th>
                            <th className="px-2 py-2 w-[11%]">Marca</th>
                            <th className="px-2 py-2 w-[11%]">Modelo</th>
                            <th className="px-2 py-2 w-[9%]">Serie</th>
                            <th className="px-2 py-2 w-[7%] text-center">Total</th>
                            <th className="px-2 py-2 w-[7%] text-center">Oper.</th>
                            <th className="px-2 py-2 w-[7%] text-center text-red-600">Fuera</th>
                            <th className="px-2 py-2 w-[11%]">Mtto.</th>
                            <th className="px-2 py-2 w-[12%]">Obs.</th>
                            <th className="px-3 py-2 w-[11%] text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {categoryItems.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="text-center py-10 text-slate-400 font-medium">
                                No hay dispositivos en esta categoría. Haga click en <strong>"+ Agregar Equipo"</strong> para comenzar a cargar.
                              </td>
                            </tr>
                          ) : (
                            categoryItems.map((item) => {
                              const isSelected = item.id === selectedEquipoId;
                              
                              return (
                                <tr 
                                  key={item.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEquipoId(item.id);
                                  }}
                                  className={`group cursor-pointer hover:bg-slate-50/70 transition-all ${
                                    isSelected ? "bg-blue-50/40 border-l-4 border-l-blue-600" : ""
                                  }`}
                                >
                                  {/* Nombre */}
                                  <td className="px-3 py-2">
                                    <input
                                      type="text"
                                      value={item.nombre}
                                      onChange={(e) => handleUpdateItem(item.id, "nombre", e.target.value)}
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900 font-bold focus:bg-white focus:border-blue-500 outline-none"
                                    />
                                  </td>

                                  {/* Marca */}
                                  <td className="px-2 py-2">
                                    <input
                                      type="text"
                                      value={item.marca || ""}
                                      onChange={(e) => handleUpdateItem(item.id, "marca", e.target.value)}
                                      placeholder="Ej. Dräger"
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                                    />
                                  </td>

                                  {/* Modelo */}
                                  <td className="px-2 py-2">
                                    <input
                                      type="text"
                                      value={item.modelo || ""}
                                      onChange={(e) => handleUpdateItem(item.id, "modelo", e.target.value)}
                                      placeholder="Ej. Evita V300"
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                                    />
                                  </td>

                                  {/* Serie */}
                                  <td className="px-2 py-2">
                                    <input
                                      type="text"
                                      value={item.serie || ""}
                                      onChange={(e) => handleUpdateItem(item.id, "serie", e.target.value)}
                                      placeholder="S/N..."
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-800 font-mono focus:bg-white focus:border-blue-500 outline-none"
                                    />
                                  </td>

                                  {/* Cantidad Total */}
                                  <td className="px-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="number" 
                                      value={item.cantidadTotal}
                                      min={0}
                                      step="any"
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        handleUpdateItem(item.id, "cantidadTotal", v === "" ? 0 : Number(v));
                                      }}
                                      className="w-12 text-center py-1 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500"
                                    />
                                  </td>

                                  {/* Cantidad Operativa */}
                                  <td className="px-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="number" 
                                      value={item.cantidadOperativa}
                                      min={0}
                                      step="any"
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        handleUpdateItem(item.id, "cantidadOperativa", v === "" ? 0 : Number(v));
                                      }}
                                      className="w-12 text-center py-1 border border-slate-200 rounded font-mono text-xs font-bold text-slate-800 focus:bg-white focus:border-blue-500"
                                    />
                                  </td>

                                  {/* Fuera de Servicio */}
                                  <td className={`px-2 py-2 text-center font-mono font-black ${item.cantidadFueraServicio > 0 ? "text-red-650 bg-red-50" : "text-slate-400"}`}>
                                    {item.cantidadFueraServicio}
                                  </td>

                                  {/* Mantenimiento preventivo check dropdown */}
                                  <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                                    <select
                                      value={item.mantenimientoPreventivo ? "Si" : "No"}
                                      onChange={(e) => handleUpdateItem(item.id, "mantenimientoPreventivo", e.target.value === "Si")}
                                      className={`w-full px-1.5 py-1 border rounded text-[10px] font-bold outline-none ${
                                        item.mantenimientoPreventivo ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
                                      }`}
                                    >
                                      <option value="Si">Vigente</option>
                                      <option value="No">Vencido</option>
                                    </select>
                                  </td>

                                  {/* Observaciones */}
                                  <td className="px-2 py-2">
                                    <input
                                      type="text"
                                      value={item.observaciones || ""}
                                      onChange={(e) => handleUpdateItem(item.id, "observaciones", e.target.value)}
                                      placeholder="Obs..."
                                      className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] text-slate-700 placeholder-slate-300 focus:bg-white focus:border-blue-500 outline-none"
                                    />
                                  </td>

                                  {/* Acciones */}
                                  <td className="px-3 py-2">
                                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        onClick={() => handleDuplicateUnit(item)}
                                        className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                                        title="Duplicar Equipo"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteUnit(item.id, e)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200"
                                        title="Eliminar Equipo"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>

                      {/* Add button inside expanded category */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleAddNewCustomUnit(catInfo.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Agregar fila en {selectedCategoryLabel(catInfo.id)}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Aspect: Score Gauge, Technical Inspector Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Automatic Tech Risk Score Gauge */}
          <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4.5 h-4.5 text-blue-600" /> Score Tecnológico UTI
              </span>
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md border ${scores.colorClass}`}>
                {scores.clasificacion}
              </span>
            </div>

            {/* Simulated Speedometer Chart */}
            <div className="text-center py-2 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke={scores.clasificacion === "Óptimo" ? "#10b981" : (scores.clasificacion === "Adecuado" ? "#3b82f6" : (scores.clasificacion === "Vulnerable" ? "#f59e0b" : "#ef4444"))}
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * scores.scoreTotal) / 100}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-slate-900 block tracking-tight">{scores.scoreTotal}%</span>
                  <span className="text-[8px] text-slate-400 font-bold block uppercase font-sans">Estándar SATI</span>
                </div>
              </div>
            </div>

            {/* Breakdown Indicators list */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-semibold">% Disponibilidad general:</span>
                <span className="font-mono font-bold text-slate-800">{scores.disponibilidad}%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-semibold">% Mtto. Preventivo:</span>
                <span className="font-mono font-bold text-slate-800">{scores.mantenimientoVigente}%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-semibold">% Críticos con Backup:</span>
                <span className="font-mono font-bold text-slate-800">{scores.criticosBackup}%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-500 font-semibold">Índice obsolescencia (&gt;10a):</span>
                <span className={`font-mono font-bold ${scores.obsolescenciaIndex > 30 ? "text-amber-600" : "text-slate-805"}`}>
                  {scores.obsolescenciaIndex}%
                </span>
              </div>
            </div>
          </div>

          {/* Automatic Clinical Alerts Box */}
          <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm space-y-3.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-600" /> Alertas Estructurales ({alertas.length})
            </span>

            {alertas.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 font-semibold rounded-xl text-xs flex items-center gap-2 border border-emerald-150">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Todo el equipamiento crítico cumple los ratios mínimos de la SATI.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {alertas.map((warn, i) => (
                  <div key={i} className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] leading-tight text-rose-800 font-semibold flex items-start gap-1.5 animate-fade-in">
                    <span className="text-xs select-none mt-0.5">⚠️</span>
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinica Biomedical details inspector panel (Secondary details Form) */}
          {selectedEquipo && (
            <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[9px] bg-blue-50 text-blue-700 font-black tracking-widest uppercase block px-1.5 py-0.5 rounded w-max mb-1">
                    INSPECTOR BIOMÉDICO
                  </span>
                  <h4 className="font-extrabold text-slate-950 text-xs leading-tight">{selectedEquipo.nombre}</h4>
                </div>
                <Wrench className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Year of Installation */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Año Compra</label>
                    <input 
                      type="number" 
                      value={selectedEquipo.anio} 
                      onChange={(e) => handleUpdateItem(selectedEquipo.id, "anio", Number(e.target.value))}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-blue-500 font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Antigüedad</label>
                    <div className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                      {2026 - selectedEquipo.anio} Años
                    </div>
                  </div>
                </div>

                {/* Service Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> Último Service
                    </label>
                    <input 
                      type="text" 
                      value={selectedEquipo.ultimoService} 
                      onChange={(e) => handleUpdateItem(selectedEquipo.id, "ultimoService", e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white font-mono focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" /> Próximo Service
                    </label>
                    <input 
                      type="text" 
                      value={selectedEquipo.proximoService} 
                      onChange={(e) => handleUpdateItem(selectedEquipo.id, "proximoService", e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white font-mono focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Sub-form specifications toggles */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">Calibración Certificada:</span>
                    <select
                      value={selectedEquipo.calibracionVigente}
                      onChange={(e) => handleUpdateItem(selectedEquipo.id, "calibracionVigente", e.target.value)}
                      className="px-1 py-0.5 bg-white border border-slate-200 text-[10px] rounded font-bold"
                    >
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                      <option value="No aplica">No aplica</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600" title="Dispone de equipo secundario de resguardo">¿Dispone de Backup?</span>
                    <div className="flex bg-slate-200 p-0.5 rounded text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(selectedEquipo.id, "backupDisponible", true)}
                        className={`px-2 py-0.5 rounded transition-all ${selectedEquipo.backupDisponible ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500"}`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(selectedEquipo.id, "backupDisponible", false)}
                        className={`px-2 py-0.5 rounded transition-all ${!selectedEquipo.backupDisponible ? "bg-white text-red-800 shadow-xs" : "text-slate-500"}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600">Riesgo Clínico Vital:</span>
                    <select
                      value={selectedEquipo.riesgoCritico}
                      onChange={(e) => handleUpdateItem(selectedEquipo.id, "riesgoCritico", e.target.value)}
                      className="px-1 py-0.5 bg-white border border-slate-200 text-[10px] rounded font-bold"
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="text-[9px] text-slate-400 leading-tight flex items-start gap-1">
                <Info className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                <span>Modifique cualquier celda de la tabla superior o este inspector para ajustar las métricas.</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// Helper function
function selectedCategoryLabel(id: CategoriaEquipo): string {
  switch (id) {
    case "Soporte ventilatorio": return "Soporte Ventilatorio";
    case "Monitoreo": return "Monitoreo";
    case "Infusión y medicación crítica": return "Infusión";
    case "Emergencia y paro": return "Emergencia";
    case "Soporte extracorpóreo": return "Soporte Extracorpóreo";
    case "Tecnología digital": return "Tecnología Digital";
    default: return "Soporte Ventilatorio";
  }
}
