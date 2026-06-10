import React from "react";
import { ReporteValoracion } from "../types";
import { Sparkles, CheckCircle2, AlertTriangle, Printer, Copy, RefreshCw, Star, HeartHandshake, ShieldCheck } from "lucide-react";

interface Props {
  reporte: ReporteValoracion | null;
  loading: boolean;
  onRunAudit: () => void;
  institucionNombre: string;
}

// Simple but beautiful Markdown parser to avoid package-compatibility issues in React 19
const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, index) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <div key={index} className="h-2" />;

    // Headers
    if (cleanLine.startsWith("###")) {
      return (
        <h4 key={index} className="text-base font-bold text-slate-800 tracking-tight mt-5 mb-2 border-b border-slate-100 pb-1">
          {cleanLine.replace("###", "").trim()}
        </h4>
      );
    }
    if (cleanLine.startsWith("##")) {
      return (
        <h3 key={index} className="text-lg font-black text-blue-950 tracking-tight mt-6 mb-3">
          {cleanLine.replace("##", "").trim()}
        </h3>
      );
    }
    if (cleanLine.startsWith("#")) {
      return (
        <h2 key={index} className="text-xl font-black text-slate-900 tracking-tight mt-6 mb-4">
          {cleanLine.replace("#", "").trim()}
        </h2>
      );
    }

    // List items
    if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
      const content = cleanLine.substring(1).trim();
      return (
        <ul key={index} className="list-disc pl-5 my-1.5 text-xs text-slate-600 space-y-1">
          <li>{parseBoldText(content)}</li>
        </ul>
      );
    }

    // Numbered lists
    if (/^\d+\./.test(cleanLine)) {
      const parts = cleanLine.split(".");
      const num = parts[0];
      const content = parts.slice(1).join(".").trim();
      return (
        <ol key={index} className="list-decimal pl-5 my-1.5 text-slate-600 text-xs">
          <li><strong>{num}. </strong>{parseBoldText(content)}</li>
        </ol>
      );
    }

    // Normal paragraph
    return (
      <p key={index} className="text-xs text-slate-600 leading-relaxed my-1.5">
        {parseBoldText(cleanLine)}
      </p>
    );
  });
};

const parseBoldText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
    }
    return part;
  });
};

export const AuditoriaResultado: React.FC<Props> = ({ reporte, loading, onRunAudit, institucionNombre }) => {

  const handleCopyText = () => {
    if (!reporte) return;
    const fullText = `REPORTÉ DE VALORACIÓN CLÍNICA: ${institucionNombre}\n\n` +
      `PUNTAJE: ${reporte.score}/100\n` +
      `CATEGORÍA SUGERIDA: ${reporte.categoriaSugerida}\n\n` +
      `Puntos Fuertes:\n${reporte.puntosFuertes.map(p => `- ${p}`).join("\n")}\n\n` +
      `Oportunidades de Mejora:\n${reporte.oportunidadesMejora.map(o => `- ${o}`).join("\n")}\n\n` +
      `Análisis Detallado:\n${reporte.analisisDetallado}\n\n` +
      `Recomendaciones Clínicas Dr. Rafael Avila:\n${reporte.recomendacionesDrAvila}`;

    navigator.clipboard.writeText(fullText);
    alert("Copiado al portapapeles con éxito.");
  };

  const handlePrint = () => {
    window.print();
  };

  // Score color determinations
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (score >= 55) return { stroke: "stroke-amber-500", text: "text-amber-600", bg: "bg-amber-50 text-amber-800 border-amber-200" };
    return { stroke: "stroke-red-500", text: "text-red-600", bg: "bg-red-50 text-red-800 border-red-200" };
  };

  const scoreMeta = reporte ? getScoreColorClass(reporte.score) : { stroke: "stroke-slate-200", text: "text-slate-400", bg: "bg-slate-50 text-slate-500" };

  return (
    <div id="auditoria-master-container" className="space-y-6">
      {/* Run Auditor trigger empty block OR showing state */}
      {!reporte ? (
        <div id="no-report-state" className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center py-16 max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">¿Listo para auditar la Unidad?</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Una vez ingresados los datos del hospital, la lista de profesionales y chequeado la estructura física, presione el siguiente botón. El sistema correrá recomendaciones basadas en la SATI.
          </p>

          <button
            id="btn-run-initial-audit"
            type="button"
            onClick={onRunAudit}
            disabled={loading}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" /> Analizando UTI con IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" /> Procesar Valoración Inteligente
              </>
            )}
          </button>
        </div>
      ) : (
        <div id="report-active-state" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Visual score and lists of highlights */}
          <div className="space-y-6">
            {/* Core Circular Score Card */}
            <div id="card-radial-score" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Puntaje de Conformidad</span>

              {/* Radial SVGs */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    className="stroke-slate-100"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    className={`${scoreMeta.stroke} transition-all duration-1000`}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - reporte.score / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div id="radial-score-number" className="absolute text-3xl font-black font-sans tracking-tight text-slate-800">
                  {reporte.score}<span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>

              {/* Suggestions badge representation */}
              <div id="sugestion-badge" className={`mt-5 px-3 py-1.5 rounded-xl text-xs font-bold border ${scoreMeta.bg}`}>
                {reporte.categoriaSugerida}
              </div>

              {/* Actions row: Copy and print */}
              <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-slate-100">
                <button
                  id="btn-action-copy"
                  type="button"
                  onClick={handleCopyText}
                  className="py-2 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Reporte
                </button>
                <button
                  id="btn-action-print"
                  type="button"
                  onClick={handlePrint}
                  className="py-2 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir Ficha
                </button>
              </div>

              {/* Refresh audit trigger button */}
              <button
                id="btn-action-recalc"
                type="button"
                onClick={onRunAudit}
                disabled={loading}
                className="w-full mt-3 py-2.5 bg-slate-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs hover:bg-slate-800 transition-all shadow-sm"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Actualizar Auditoría con IA
              </button>
            </div>

            {/* Visual Lists: Strengths */}
            <div id="card-puntos-fuertes" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-emerald-50 pb-3 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Puntos Fuertes Identificados
              </h4>
              <ul className="space-y-3">
                {reporte.puntosFuertes.map((str, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 leading-normal">
                    <Star className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Lists: Improvement opportunities */}
            <div id="card-vulnerabilidades" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-amber-50 pb-3 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Áreas Críticas a Mejorar
              </h4>
              <ul className="space-y-3">
                {reporte.oportunidadesMejora.map((opp, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 leading-normal">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Expert Analysis text blocks (Dr. Rafael Avila POV) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed audit prose */}
            <div id="prose-detailed-analysis" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-2.5">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Disertación y Diagnóstico de la UTI
                </h3>
              </div>
              <div className="prose max-w-none text-slate-700 select-text">
                {renderMarkdown(reporte.analisisDetallado)}
              </div>
            </div>

            {/* Counselings and strategic steps (Dr. Avila advice block) */}
            <div id="prose-avila-counsels" className="bg-gradient-to-br from-blue-50/60 to-slate-50 border border-blue-100 p-6 rounded-2xl relative shadow-sm">
              <div className="absolute right-4 top-4 opacity-5">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-2 border-b border-blue-100 pb-3 mb-4">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <span className="text-xs font-black tracking-tight">Dr. R.A</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase">
                    Consigna y Consejos del Dr. Rafael Avila
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">Sugerencia clínica formativa y estratégica</span>
                </div>
              </div>
              <div className="prose max-w-none text-slate-800 text-xs italic space-y-3 leading-relaxed select-text">
                {renderMarkdown(reporte.recomendacionesDrAvila)}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
