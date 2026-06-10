import React, { useEffect, useState } from "react";
import { BookOpen, ExternalLink, HelpCircle, Layers, Award, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  data: any; // Holds the fetched guidelines reference
  loading: boolean;
}

export const ReferenciaNormas: React.FC<Props> = ({ data, loading }) => {
  const [activeTabComplejidad, setActiveTabComplejidad] = useState<string>("nivel1");

  if (loading || !data) {
    return (
      <div id="loading-normative" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Cargando marcos de referencia, directrices ministeriales e información relevante...</p>
      </div>
    );
  }

  const nivelesMapKeys = Object.keys(data.complejidades || {});

  return (
    <div id="ref-normas-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Comparison Accordion Card */}
      <div id="comparison-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen id="icon-book" className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 id="normas-card-title" className="text-lg font-bold text-slate-900 tracking-tight">
                Marcos Normativos y Categorización SATI
              </h3>
              <p id="normas-card-subtitle" className="text-xs text-slate-500">
                Detalle técnico según Resolución Nacional 748/2014 para la Habilitación de Terapias Intensivas.
              </p>
            </div>
          </div>

          {/* Tab buttons for complexities */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 mb-5">
            {nivelesMapKeys.map((key) => (
              <button
                key={key}
                id={`tab-complejidad-${key}`}
                type="button"
                onClick={() => setActiveTabComplejidad(key)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTabComplejidad === key
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                }`}
              >
                {data.complejidades[key].nombre.split(" ")[0] + " " + data.complejidades[key].nombre.split(" ")[1]}
              </button>
            ))}
          </div>

          {/* Complexities info visualization */}
          {activeTabComplejidad && data.complejidades[activeTabComplejidad] && (
            <div id="complexities-visualizer-box" className="bg-slate-50 border border-slate-100 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5">
                <Layers className="w-48 h-48 transform translate-x-12 -translate-y-8" />
              </div>
              <h4 id="complex-title" className="text-sm font-black text-blue-800 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4.5 h-4.5" /> {data.complejidades[activeTabComplejidad].nombre}
              </h4>
              <p id="complex-desc" className="text-xs text-slate-600 mb-4 italic leading-relaxed">
                "{data.complejidades[activeTabComplejidad].descripcion}"
              </p>

              <div className="space-y-3.5 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs border-b border-slate-200/50 pb-2.5">
                  <span className="font-bold text-slate-800 shrink-0">Dotación Médica</span>
                  <span className="sm:col-span-2 text-slate-600">{data.complejidades[activeTabComplejidad].medicos}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs border-b border-slate-200/50 pb-2.5">
                  <span className="font-bold text-slate-800 shrink-0">Dotación Enfermería</span>
                  <span className="sm:col-span-2 text-slate-600">{data.complejidades[activeTabComplejidad].enfermeria}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs border-b border-slate-200/50 pb-2.5">
                  <span className="font-bold text-slate-800 shrink-0">Soporte Kinésico</span>
                  <span className="sm:col-span-2 text-slate-600">{data.complejidades[activeTabComplejidad].kinesiologia}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs">
                  <span className="font-bold text-slate-800 shrink-0">Equipamiento Min.</span>
                  <span className="sm:col-span-2 text-slate-600">{data.complejidades[activeTabComplejidad].equipamiento}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SATI suggestion notice */}
        <div id="notice-sati-hours" className="mt-5 p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-700 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{data.sugestionRelacionHoras?.explicacion}</span>
        </div>
      </div>

      {/* 2. Structured Resources Card and Web Links */}
      <div id="resources-card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award id="icon-award" className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 id="resources-card-title" className="text-lg font-bold text-slate-900 tracking-tight">
                Requisitos de Infraestructura Clave
              </h3>
              <p id="resources-card-subtitle" className="text-xs text-slate-500">
                Puntos críticos exigidos según SATI.
              </p>
            </div>
          </div>

          {/* Checkpoints checklist representation */}
          <div className="space-y-3">
            {data.requisitosEstructuraClave?.map((reqItem: any, i: number) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs transition-all hover:bg-slate-100/50">
                <div>
                  <h4 className="font-bold text-slate-800">{reqItem.item}</h4>
                  <span className="text-[10px] text-slate-400 mt-1 block">Acreditación: {reqItem.nivelRequerido}</span>
                </div>
                <span className="bg-indigo-100 text-indigo-700 font-extrabold uppercase text-[9px] px-2 py-0.5 rounded-full">
                  Exigido
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Web relevant information links */}
        <div id="web-data-links" className="mt-6 pt-5 border-t border-slate-100">
          <h4 id="web-info-title" className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <FileText className="w-3.5 h-3.5" /> Enlaces y Fuentes Oficiales
          </h4>
          <div className="space-y-2.5">
            {data.enlacesRelevantes?.map((enlace: any, i: number) => (
              <a
                key={i}
                href={enlace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 hover:bg-slate-50/80 rounded-lg border border-transparent hover:border-slate-100 text-slate-700 hover:text-blue-600 transition-all text-xs"
              >
                <span className="font-medium truncate mr-2">{enlace.titulo}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
