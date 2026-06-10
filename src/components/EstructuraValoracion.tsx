import React, { useState } from "react";
import { ItemValoracionEstructura } from "../types";
import { CheckSquare, Square, ThumbsUp, GraduationCap, Percent, CircleAlert } from "lucide-react";

interface Props {
  items: ItemValoracionEstructura[];
  onToggle: (id: string) => void;
  filterGroup?: "infraestructura" | "tecnologia" | "seguridad" | "all";
}

type CategoriasFiltro = "Todos" | "Soporte y Planta Física" | "Equipamiento Crítico" | "Servicios de Apoyo (24hs)" | "Calidad y Seguridad";

export const EstructuraValoracion: React.FC<Props> = ({ items, onToggle, filterGroup }) => {
  const [activeGroup, setActiveGroup] = useState<CategoriasFiltro>("Todos");

  // Filter based on filterGroup segment
  const getSubitems = () => {
    if (filterGroup === "infraestructura") {
      return items.filter(item => item.grupo === "Soporte y Planta Física" || item.grupo === "Servicios de Apoyo (24hs)");
    }
    if (filterGroup === "tecnologia") {
      return items.filter(item => item.grupo === "Equipamiento Crítico");
    }
    if (filterGroup === "seguridad") {
      return items.filter(item => item.grupo === "Calidad y Seguridad");
    }
    return activeGroup === "Todos" 
      ? items 
      : items.filter(item => item.grupo === activeGroup);
  };

  const filteredItems = getSubitems();

  // Compute stats
  const totalWeight = items.reduce((sum, item) => sum + item.peso, 0);
  const metWeight = items.reduce((sum, item) => sum + (item.cumple ? item.peso : 0), 0);
  const percentMet = totalWeight > 0 ? Math.round((metWeight / totalWeight) * 100) : 0;

  // Active group metrics
  const activeTotalWeight = filteredItems.reduce((sum, item) => sum + item.peso, 0);
  const activeMetWeight = filteredItems.reduce((sum, item) => sum + (item.cumple ? item.peso : 0), 0);
  const activePercent = activeTotalWeight > 0 ? Math.round((activeMetWeight / activeTotalWeight) * 100) : 0;

  // Header texts
  const headerTitle = {
    infraestructura: "Valoración de Infraestructura y Planta Física",
    tecnologia: "Valoración de Equipamiento Tecnológico Crítico",
    seguridad: "Valoración de Normativas de Calidad y Seguridad",
    all: "Todos los Aspectos de Estructura",
    default: activeGroup === "Todos" ? "Todos los Aspectos de Estructura" : activeGroup
  }[filterGroup || "default"];

  const hasSidebar = !filterGroup || filterGroup === "all";

  return (
    <div id="estructura-comp-container" className={hasSidebar ? "grid grid-cols-1 lg:grid-cols-4 gap-6" : "w-full"}>
      {/* Sidebar navigation & stats card */}
      {hasSidebar && (
        <div id="stats-nav-sidebar" className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 id="sidebar-title" className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Métricas de Estructura
            </h3>

            {/* Core Score/Completion Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 mb-5 shadow-inner text-center relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Percent className="w-24 h-24 transform translate-x-4 translate-y-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest block mb-1">
                Cumplimiento Ponderado
              </span>
              <div id="progress-percent" className="text-4xl font-black font-mono tracking-tight my-2 text-blue-400">
                {percentMet}%
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Coeficiente basado en la importancia reglamentaria de los ítems.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 mb-1.5 px-0.5">Filtrar por Área Química o Física:</label>
              {(["Todos", "Soporte y Planta Física", "Equipamiento Crítico", "Servicios de Apoyo (24hs)", "Calidad y Seguridad"] as CategoriasFiltro[]).map((grupo) => (
                <button
                  key={grupo}
                  id={`btn-grupo-filter-${grupo.replace(/[^a-zA-Z0-9]/g, '')}`}
                  type="button"
                  onClick={() => setActiveGroup(grupo)}
                  className={`w-full py-2.5 px-3 text-left rounded-xl transition-all text-xs font-semibold flex items-center justify-between ${
                    activeGroup === grupo
                      ? "bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600"
                      : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <span>{grupo}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-full">
                    {grupo === "Todos" 
                      ? items.length 
                      : items.filter(i => i.grupo === grupo).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Info footer */}
          <div id="sidebar-foot" className="pt-4 border-t border-slate-100 mt-4 text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <CircleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>La valoración de estructura es ponderada según las guías vigentes de la SATI y los requerimientos del Ministerio de Salud.</span>
          </div>
        </div>
      )}

      {/* Main checklist box */}
      <div id="checklist-main-box" className={hasSidebar ? "lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" : "w-full bg-white p-6 rounded-2xl border border-slate-205 shadow-sm"}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-5 gap-3">
          <div>
            <h3 id="chk-title" className="text-lg font-bold text-slate-900 tracking-tight uppercase">
              {headerTitle}
            </h3>
            <p id="chk-subtitle" className="text-xs text-slate-500">
              Marque si su institución cuenta con la infraestructura o proceso homologado correspondiente.
            </p>
          </div>

          <div id="subpercent-indicator" className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-705 rounded-xl px-3 py-1.5 text-xs font-semibold">
            <span>Cumplimiento Ponderado:</span>
            <span className="text-blue-600 font-mono font-black text-sm">{activePercent}%</span>
          </div>
        </div>

        {/* Item iteration list */}
        <div id="check-list-items" className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`item-card-${item.id}`}
              onClick={() => onToggle(item.id)}
              className={`p-4 border rounded-xl flex items-start gap-4 cursor-pointer transition-all ${
                item.cumple
                  ? "bg-emerald-50/20 border-emerald-200/60 hover:bg-emerald-50/40"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              {/* Checkbox Representation */}
              <button
                id={`btn-toggle-chk-${item.id}`}
                type="button"
                className={`mt-0.5 shrink-0 ${item.cumple ? "text-emerald-600" : "text-slate-400"}`}
              >
                {item.cumple ? (
                  <CheckSquare className="w-5.5 h-5.5" />
                ) : (
                  <Square className="w-5.5 h-5.5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span id={`item-label-${item.id}`} className={`text-sm font-bold ${item.cumple ? "text-slate-900" : "text-slate-700"}`}>
                    {item.label}
                  </span>
                  <span id={`item-badge-weight-${item.id}`} className="bg-slate-100 text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-extrabold select-none">
                    Ponderación: {item.peso} pts
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-semibold">
                    {item.grupo}
                  </span>
                </div>
                <p id={`item-desc-${item.id}`} className="text-xs text-slate-500 mt-1 leading-normal">
                  {item.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
