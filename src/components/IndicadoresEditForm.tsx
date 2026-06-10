import React, { useState } from "react";
import { IndicadorClave } from "./ExportacionGlobalForm";
import { TrendingUp, Plus, Trash2, Copy, Percent, Star, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  indicadores: IndicadorClave[];
  onChange: (updated: IndicadorClave[]) => void;
}

export const IndicadoresEditForm: React.FC<Props> = ({ indicadores, onChange }) => {
  const handleUpdate = (id: string, key: keyof IndicadorClave, value: any) => {
    onChange(
      indicadores.map(ind => (ind.id === id ? { ...ind, [key]: value } : ind))
    );
  };

  const handleAdd = () => {
    const randomId = `ind-custom-${Math.random().toString(36).substring(2, 9)}`;
    const newInd: IndicadorClave = {
      id: randomId,
      nombre: "Nuevo Indicador de Calidad Clínica",
      valorActual: "",
      metaNacional: "< 5.0%",
      estado: "Bajo Control"
    };
    onChange([...indicadores, newInd]);
  };

  const handleDuplicate = (ind: IndicadorClave) => {
    const randomId = `ind-custom-${Math.random().toString(36).substring(2, 9)}`;
    const duplicated: IndicadorClave = {
      ...ind,
      id: randomId,
      nombre: `${ind.nombre} (Duplicado)`
    };
    onChange([...indicadores, duplicated]);
  };

  const handleRemove = (id: string) => {
    onChange(indicadores.filter(ind => ind.id !== id));
  };

  return (
    <div id="indicadores-section-container" className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-650 rounded-lg shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight font-sans uppercase">
                Indicadores Clínicos de la Terapia Intensiva
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Evalué y actualice las tazas e indicadores críticos en su ICU basados en el SATI-Q framework nacional.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Indicador</span>
          </button>
        </div>

        {/* Quick legend about indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-black text-emerald-800 tracking-wider">Bajo Control</span>
              <span className="text-xs text-emerald-700 font-medium">Métricas dentro de la variabilidad o meta del plan nacional.</span>
            </div>
          </div>
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-150 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-black text-amber-800 tracking-wider">Atención</span>
              <span className="text-xs text-amber-750 font-medium">Desviaciones leves que requieren monitoreo directivo regular.</span>
            </div>
          </div>
          <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-150 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-black text-rose-800 tracking-wider">Crítico</span>
              <span className="text-xs text-rose-700 font-medium">Supera límites recomendados; amerita incidentes y plan corrector prioritario.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Indicators Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Matriz de métricas SATI-Q</span>
          <span className="text-xs font-mono font-bold text-slate-400">{indicadores.length} cargados</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/50 text-[11px] uppercase text-slate-505 font-bold border-b border-slate-200">
                <th className="px-4 py-3.5 w-[40%]">Nombre de la Métrica Clínica</th>
                <th className="px-3 py-3 w-[18%]">Valor Factible / Actual</th>
                <th className="px-3 py-3 w-[15%]">Meta Nacional Recomendada</th>
                <th className="px-3 py-3 w-[15%] text-center">Riesgo / Estado</th>
                <th className="px-4 py-3 w-[12%] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {indicadores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    No hay indicadores clínicos registrados. Haga click en <strong>"+ Agregar indicador"</strong> para registrar.
                  </td>
                </tr>
              ) : (
                indicadores.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Nombre */}
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={ind.nombre}
                        onChange={(e) => handleUpdate(ind.id, "nombre", e.target.value)}
                        placeholder="Ej. Infección del Tracto Urinario asociada a Sonda (ITU/1000 d)"
                        className="w-full px-2.5 py-1.5 border-0 bg-transparent rounded-lg text-xs font-sans font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-105 outline-none"
                      />
                    </td>

                    {/* Valor Actual */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={ind.valorActual}
                        onChange={(e) => handleUpdate(ind.id, "valorActual", e.target.value)}
                        placeholder="Ej. 1.8‰ / 5.2%"
                        className="w-full px-2.5 py-1.5 border border-slate-200 bg-slate-50/50 rounded-lg text-xs font-mono font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-rose-400 outline-none"
                      />
                    </td>

                    {/* Meta Recomendada */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={ind.metaNacional}
                        onChange={(e) => handleUpdate(ind.id, "metaNacional", e.target.value)}
                        placeholder="Ej. < 2.0%"
                        className="w-full px-2.5 py-1.5 border-0 bg-transparent rounded-lg text-xs font-sans font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-105 outline-none"
                      />
                    </td>

                    {/* Estado / Riesgo */}
                    <td className="px-3 py-2 text-center">
                      <select
                        value={ind.estado}
                        onChange={(e) => handleUpdate(ind.id, "estado", e.target.value)}
                        className={`w-36 mx-auto px-2 py-1.5 rounded-lg text-xs font-semibold uppercase border ${
                          ind.estado === "Bajo Control"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-250"
                            : ind.estado === "Atención"
                            ? "bg-amber-50 text-amber-80 *0 border-amber-250 font-bold"
                            : "bg-rose-50 text-rose-800 border-rose-250 font-bold"
                        } outline-none cursor-pointer`}
                      >
                        <option value="Bajo Control">🟢 Bajo Control</option>
                        <option value="Atención">🟡 Atención</option>
                        <option value="Crítico">🔴 Crítico</option>
                      </select>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(ind)}
                          className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="Duplicar indicador"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplicar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(ind.id)}
                          className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-red-200"
                          title="Eliminar este indicador"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom add indicator row */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={handleAdd}
            className="px-5 py-2 bg-rose-650 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Indicador Clínico</span>
          </button>
        </div>
      </div>

    </div>
  );
};
