import React, { useState } from "react";
import { InformacionInstitucion } from "../types";
import { 
  FileText, 
  Grid, 
  Download, 
  TrendingUp, 
  Printer, 
  CheckCircle, 
  Share2, 
  Layers, 
  Award,
  Users,
  Compass,
  CornerDownRight
} from "lucide-react";

interface Props {
  activeInst: InformacionInstitucion;
  allInstituciones: InformacionInstitucion[];
  onSelect: (id: string) => void;
  profesionalesCount: number;
}

export const BenchmarkingExport: React.FC<Props> = ({ 
  activeInst, 
  allInstituciones, 
  onSelect,
  profesionalesCount
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedSheetTab, setSelectedSheetTab] = useState<"database" | "benchmark">("database");

  // Handle empty state gracefully
  if (!allInstituciones || allInstituciones.length === 0) {
    return (
      <div id="benchmarking-empty-state" className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 mt-6 shadow-sm">
        <TrendingUp className="w-16 h-16 text-slate-300 stroke-[1.5] mb-4" />
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Sin datos cargados</h3>
        <p className="text-xs text-slate-400 text-center mt-1.5 max-w-xs leading-relaxed">
          No existen registros de instituciones para comparar o certificar. Por favor inicie cargando una institución en la pestaña <strong>"1. Institución y Complejidad"</strong>.
        </p>
      </div>
    );
  }

  const activeInstName = activeInst?.nombre || "Sin institución cargada";
  const activeInstLogo = activeInst?.logoInstitucional || "🏥";
  const activeInstIdVal = activeInst?.id || "---";
  const activeInstShort = activeInst?.nombreCorto || "---";
  const activeInstCiudad = activeInst?.ciudad || "---";
  const activeInstProvincia = activeInst?.provincia || "---";
  const activeInstTipo = activeInst?.tipoInstitucion || "---";
  const activeInstComplejidad = activeInst?.complejidad || "---";
  const activeInstCamas = activeInst?.camasTotales || 0;
  const activeInstAisladas = activeInst?.camasAisladas || 0;
  const activeInstResponsable = activeInst?.evaluadorResponsable || "---";
  const activeInstFecha = activeInst?.fechaEvaluacion || "---";

  // Mock scores for benchmarking of other loaded institutions
  // If we have calculated reports, we can use their actual scores or default ones
  const getMockScoreForInst = (instId: string) => {
    switch (instId) {
      case "INST-TUC-99": return 85;
      case "INST-ARG-12": return 64;
      case "INST-TRI-45": return 92;
      default: return 75;
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Codigo,Institucion,Sigla,Provincia,Complejidad,Tipo,Camas,Evaluador,Puntaje_SATI\n";
    
    allInstituciones.forEach(inst => {
      const row = [
        inst.id,
        `"${inst.nombre}"`,
        inst.nombreCorto || "",
        inst.provincia,
        inst.complejidad,
        inst.tipoInstitucion,
        inst.camasTotales,
        inst.evaluadorResponsable || "No asignado",
        getMockScoreForInst(inst.id)
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `benchmarking_uti_argentina_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="benchmarking-export-master" className="space-y-8 mt-6">
      
      {/* 2x2 Bento Box Grid containing the features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Oficial PDF Audit Certificate Preview */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> 1. Certificado / Reporte PDF Oficial
              </h3>
              <span className="text-[10px] bg-red-50 text-red-700 font-extrabold px-2 py-0.5 rounded-full border border-red-100 uppercase">
                Vista de Impresión
              </span>
            </div>

            {/* Simulated Paper Document */}
            <div id="pdf-paper-preview" className="bg-slate-50 border border-slate-250 rounded-xl p-6 font-serif text-slate-900 shadow-inner relative max-w-lg mx-auto overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700" />
              
              {/* Seal */}
              <div className="absolute top-8 right-6 w-14 h-14 border-4 border-dashed border-blue-900/10 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
                <span className="text-[8px] font-sans font-black text-blue-900/20 text-center tracking-tighter uppercase leading-none">
                  SATI<br />QC PASSED
                </span>
              </div>

              {/* Document Header */}
              <div className="text-center font-sans tracking-tight mb-6">
                <div className="text-xl font-black text-slate-950 flex items-center justify-center gap-1">
                  <span>{activeInstLogo}</span>
                  <span>{activeInstName}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Acta de Auditoría Estructural de UTI
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  ID: {activeInstIdVal} • HASH: {activeInstIdVal}-{(activeInstShort).toUpperCase()}
                </div>
              </div>

              {/* Metadata content */}
              <div className="space-y-3.5 text-[11px] leading-relaxed border-t border-b border-dotted border-slate-300 py-4 mb-4">
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-550">Sigla:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{activeInstShort}</span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-550">Ubicación:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{activeInstCiudad}, Prov. de {activeInstProvincia}</span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-555">Administrativo:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">Tipo de Gestión: <strong className="font-bold text-blue-900">{activeInstTipo}</strong></span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-555">Complejidad:</span>
                  <span className="col-span-2 text-slate-800 font-bold text-blue-900">{activeInstComplejidad}</span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-555">Camas Totales:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{activeInstCamas} Camas ({activeInstAisladas} Aisladas)</span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-555">Responsable:</span>
                  <span className="col-span-2 text-slate-800 font-bold text-slate-950 italic">{activeInstResponsable}</span>
                </div>
                <div className="grid grid-cols-3 text-slate-600 font-sans">
                  <span className="font-bold text-slate-555">Fecha Acta:</span>
                  <span className="col-span-2 text-slate-800 font-mono font-bold">{activeInstFecha}</span>
                </div>
              </div>

              {/* Verdict sign off */}
              <div className="flex justify-between items-end font-sans mt-6">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-black">Certifica</div>
                  <div className="text-xs font-bold text-slate-800">Cátedra Dr. Rafael Avila</div>
                  <div className="text-[8px] text-slate-400">Estándar SATI Res 748</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-black text-emerald-700">Conforme SATI</div>
                  <div className="text-[8px] text-slate-400">Puntaje Estimado: ~{getMockScoreForInst(activeInstIdVal)}/100</div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              id="btn-print-form"
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir / Exportar PDF de {activeInstShort || activeInstName}
            </button>
            <button
              id="btn-share-report"
              onClick={handleShare}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> {copiedLink ? "Link Copiado" : "Compartir Ficha"}
            </button>
          </div>
        </div>

        {/* Right Card: Google Sheets Live Sync Representation & Benchmarking */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            
            {/* Tab Toggles for Spreadsheet vs Bar Charts */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-600" /> 2. Conexión Google Sheets y Benchmarking
              </h3>
              
              <div className="flex bg-slate-100 rounded-lg p-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedSheetTab("database")}
                  className={`px-2.5 py-1 rounded-md transition-all ${selectedSheetTab === "database" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500"}`}
                >
                  Planilla Real (Google Sheets)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSheetTab("benchmark")}
                  className={`px-3 py-1 rounded-md transition-all ${selectedSheetTab === "benchmark" ? "bg-white text-blue-800 shadow-xs" : "text-slate-500"}`}
                >
                  Benchmarking Comparativo
                </button>
              </div>
            </div>

            {selectedSheetTab === "database" ? (
              <div id="google-sheets-sim" className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  Los registros de sus múltiples instituciones se sincronizan automáticamente en la siguiente tabla emulando una integración directa en la nube de <strong>Google Workspace (Sheets)</strong>:
                </p>

                {/* Simulated Google Sheets View */}
                <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-sm max-h-[220px] overflow-y-auto bg-slate-50 scrollbar-thin">
                  <table className="w-full text-left font-sans text-[11px] border-collapse bg-white">
                    <thead className="bg-[#e2f0d9] text-[#385723] font-bold border-b border-slate-300">
                      <tr>
                        <th className="px-3 py-2 text-center border-r border-slate-300 w-8 bg-[#c5e0b4]"></th>
                        <th className="px-3 py-1.5 border-r border-slate-300">A (CÓDIGO)</th>
                        <th className="px-3 py-1.5 border-r border-slate-300">B (INSTITUCIÓN)</th>
                        <th className="px-3 py-1.5 border-r border-slate-300">C (PROVINCIA)</th>
                        <th className="px-3 py-1.5 border-r border-slate-300">D (TIPO)</th>
                        <th className="px-3 py-1.5 border-r border-slate-300">E (SCORE SATI)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {allInstituciones.map((inst, idx) => {
                        const isSelected = inst.id === activeInst.id;
                        return (
                          <tr 
                            key={inst.id} 
                            onClick={() => onSelect(inst.id)}
                            className={`hover:bg-[#f1f3f4] cursor-pointer transition-colors ${isSelected ? "bg-emerald-50/70 font-bold" : ""}`}
                          >
                            <td className="px-2 py-1.5 text-center border-r border-slate-200 bg-slate-100 font-mono text-slate-400 text-[10px]">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 font-mono text-emerald-800">
                              {inst.id}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 text-slate-900 truncate max-w-[130px] flex items-center gap-1">
                              <span>{inst.logoInstitucional}</span>
                              <span className="truncate">{inst.nombre}</span>
                              {isSelected && <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">Activo</span>}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200">
                              {inst.provincia}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 uppercase text-[9px] font-bold text-slate-500">
                              {inst.tipoInstitucion}
                            </td>
                            <td className="px-3 py-1.5 border-r border-slate-200 font-bold text-right text-slate-800 pr-5">
                              {getMockScoreForInst(inst.id)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg border border-slate-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] text-slate-600 font-bold">Base de Datos de Benchmarking de Terapia Intensiva en Línea</span>
                  </div>
                  <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                    API V4 Sync: OK
                  </span>
                </div>

              </div>
            ) : (
              <div id="analytics-benchmark-charts text-slate-800" className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  Comparación del desempeño general (Puntaje de Estándares de Planta y Planteles UTI) entre las instituciones dadas de alta en el sistema:
                </p>

                {/* Dynamic benchmark visual bar charts */}
                <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[190px] overflow-y-auto">
                  {allInstituciones.map((inst) => {
                    const score = getMockScoreForInst(inst.id);
                    const isActive = inst.id === activeInst.id;
                    return (
                      <div 
                        key={inst.id} 
                        onClick={() => onSelect(inst.id)}
                        className={`space-y-1.5 cursor-pointer p-1.5 rounded-lg transition-all ${isActive ? "bg-white shadow-xs border border-blue-100" : "hover:bg-slate-100"}`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1 text-slate-800">
                            <span>{inst.logoInstitucional}</span>
                            <span className="truncate max-w-[140px]">{inst.nombre}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-normal">({inst.id})</span>
                          </span>
                          <span className="font-mono text-blue-700 font-black">{score}% Cop.</span>
                        </div>
                        {/* Custom visual bar indicator */}
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${score}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isActive 
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xs" 
                                : "bg-slate-400"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          <div className="mt-6">
            <button
              id="btn-download-csv"
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all w-full"
            >
              <Download className="w-3.5 h-3.5" /> Descargar CSV Unificado de Benchmarking Institucional
            </button>
          </div>
        </div>

      </div>

      {/* Floating helpful box explaining how automatic fields work */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
        
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Encabezados Permanentes</span>
            <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
              El nombre completo <strong>"{activeInst.nombre}"</strong> aparece dinámicamente en el encabezado superior y en el selector principal.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Reportes de Auditoría</span>
            <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
              La IA Dr. Rafael Avila incorpora este nombre en la ponderación ética, el dictamen final, y en los descargables que genere de la evaluación.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-800 block">Benchmarking Comparativo</span>
            <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
              Al cargar múltiples instituciones, compare de inmediato sus métricas de camas, personal acreditado SATI, y planta física en un solo tablero.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
