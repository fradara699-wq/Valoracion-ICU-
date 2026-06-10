import { useState, useEffect } from "react";
import { InformacionInstitucion, Profesional, ItemValoracionEstructura, ReporteValoracion, EquipoCritico } from "./types";
import { DEFAULT_ESTRUCTURA_ITEMS } from "./data/estructuraItems";
import { IdentificacionInstitucionalHeader } from "./components/IdentificacionInstitucionalHeader";
import { InformacionInstitucionForm } from "./components/InformacionInstitucionForm";
import { PersonalForm } from "./components/PersonalForm";
import { EstructuraValoracion } from "./components/EstructuraValoracion";
import { ReferenciaNormas } from "./components/ReferenciaNormas";
import { AuditoriaResultado } from "./components/AuditoriaResultado";
import { BenchmarkingExport } from "./components/BenchmarkingExport";
import { TecnologiaCriticaForm } from "./components/TecnologiaCriticaForm";
import { ExportacionGlobalForm } from "./components/ExportacionGlobalForm";
import { DEFAULT_EQUIPOS_CRITICOS } from "./data/equiposCriticos";
import { ChecklistGenericoEditable } from "./components/ChecklistGenericoEditable";
import { IndicadoresEditForm } from "./components/IndicadoresEditForm";
import { TeamworkItem, TeleIcuItem, DocenciaItem, SatiItem, IndicadorClave } from "./components/ExportacionGlobalForm";
import { 
  Activity, 
  ChevronRight, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  Heart, 
  ClipboardCheck, 
  TrendingUp, 
  Building, 
  UsersRound, 
  BookOpenText, 
  FileCheck,
  Cpu,
  Download,
  RotateCcw,
  FilePlus2,
  AlertTriangle,
  Stethoscope,
  Users,
  ShieldCheck,
  Tv,
  GraduationCap,
  Award,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [scriptUrl, setScriptUrl] = useState(() => {
    return localStorage.getItem("uti_google_script_url") || "https://script.google.com/macros/s/AKfycbyXXXXX_YYYYY_ZZZZZ/exec";
  });
  // 1. Core States - Multiple Loaded Institutions for Benchmarking
  const [instituciones, setInstituciones] = useState<InformacionInstitucion[]>([]);

  const [activeInstId, setActiveInstId] = useState<string>("");

  // Derive active institucion
  const institucion = instituciones.find(i => i.id === activeInstId) || {
    id: "",
    nombre: "",
    nombreCorto: "",
    ciudad: "",
    provincia: "",
    localidad: "",
    sector: "Público",
    tipoInstitucion: "Pública",
    complejidad: "",
    camasTotales: 10,
    camasAisladas: 2,
    fechaEvaluacion: new Date().toISOString().split("T")[0],
    evaluadorResponsable: "",
    logoInstitucional: "🏥"
  };

  // Backward compatible setter so legacy components continue operating perfectly
  const setInstitucion = (updated: InformacionInstitucion | ((prev: InformacionInstitucion) => InformacionInstitucion)) => {
    const nextValue = typeof updated === "function" ? updated(institucion) : updated;
    
    // Auto generate ID if not existing
    if (!nextValue.id) {
      nextValue.id = `INST-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    setInstituciones(prev => {
      const exists = prev.some(inst => inst.id === nextValue.id);
      if (exists) {
        return prev.map(inst => inst.id === nextValue.id ? nextValue : inst);
      } else {
        return [...prev, nextValue];
      }
    });
    setActiveInstId(nextValue.id);
  };

  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  const [estructuraItems, setEstructuraItems] = useState<ItemValoracionEstructura[]>(() =>
    DEFAULT_ESTRUCTURA_ITEMS.map(item => ({ ...item, cumple: false }))
  );
  const [equipos, setEquipos] = useState<EquipoCritico[]>(() => DEFAULT_EQUIPOS_CRITICOS);
  const [reporte, setReporte] = useState<ReporteValoracion | null>(null);

  // Lifted States for checklists and indicators
  const [teamworkChecklist, setTeamworkChecklist] = useState<TeamworkItem[]>([
    { id: "tw-1", label: "Pases de guardia estructurados según protocolo SBAR", cumple: false, peso: 8 },
    { id: "tw-2", label: "Rondas matutinas multidisciplinarias diarias (Médico, Enf, Kine, Farm, Nutri)", cumple: false, peso: 10 },
    { id: "tw-3", label: "Briefings de seguridad al inicio de cada turno de enfermería", cumple: false, peso: 6 },
    { id: "tw-4", label: "Protocolo formal de soporte de salud mental y debriefing para el personal", cumple: false, peso: 7 },
    { id: "tw-5", label: "Asignación de roles claros durante escenarios de reanimación (CRM)", cumple: false, peso: 9 }
  ]);

  const [teleIcuChecklist, setTeleIcuChecklist] = useState<TeleIcuItem[]>([
    { id: "tele-1", label: "Terminal para tele-interconsulta equipada con audio y video HD", cumple: false, peso: 8 },
    { id: "tele-2", label: "Seguimiento remoto o soporte por tele-expertos para decisiones complejas", cumple: false, peso: 10 },
    { id: "tele-3", label: "Protocolos de seguridad y confidencialidad encriptados para tele-ICU", cumple: false, peso: 8 },
    { id: "tele-4", label: "Acceso remotos de familiares con mediación médica protocolizada", cumple: false, peso: 6 }
  ]);

  const [docenciaChecklist, setDocenciaChecklist] = useState<DocenciaItem[]>([
    { id: "doc-1", label: "Residencia médica acreditada en Terapia Intensiva", cumple: false, peso: 10 },
    { id: "doc-2", label: "Enfermeros tutores e instructores dedicados a la capacitación continua", cumple: false, peso: 8 },
    { id: "doc-3", label: "Ateneo clínico-bibliográfico semanal activo con actas de firmas", cumple: false, peso: 7 },
    { id: "doc-4", label: "Participación en proyectos multicéntricos o registros nacionales de investigación", cumple: false, peso: 6 }
  ]);

  const [satiChecklist, setSatiChecklist] = useState<SatiItem[]>([
    { id: "sati-1", label: "Director o Jefe de Servicio acreditado como Miembro Especialista SATI", cumple: false, peso: 12 },
    { id: "sati-2", label: "Médicos de guardia activa con curso FCCS o reválida certificada", cumple: false, peso: 10 },
    { id: "sati-3", label: "Kinesiología intensiva integral y con presencia las 24 horas", cumple: false, peso: 12 },
    { id: "sati-4", label: "Manual de Normas de Procedimientos de Organización y Funcionamiento SATI", cumple: false, peso: 8 }
  ]);

  const [indicadores, setIndicadores] = useState<IndicadorClave[]>([
    { id: "ind-1", nombre: "Mortalidad General Observada en UTI", valorActual: "", metaNacional: "< 25.0%", estado: "Bajo Control" },
    { id: "ind-2", nombre: "Días Promedio de Estadía (ALOS)", valorActual: "", metaNacional: "< 6.5 días", estado: "Atención" },
    { id: "ind-3", nombre: "Infecciones Asociadas a Catéter (IACS/1000 d)", valorActual: "", metaNacional: "< 2.5‰", estado: "Atención" },
    { id: "ind-4", nombre: "Neumonías Asociadas a ARM (NAV/1005 d)", valorActual: "", metaNacional: "< 10.0‰", estado: "Crítico" },
    { id: "ind-5", nombre: "Tasa de Extubación Fallida a 48 hs", valorActual: "", metaNacional: "< 5.0%", estado: "Bajo Control" }
  ]);
  
  // 2. Navigation State (Toggles between 15 active sections)
  const [activeTab, setActiveTab] = useState<string>("institucion");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Recovery overlay states
  const [showRecoverPrompt, setShowRecoverPrompt] = useState<boolean>(false);
  const [backupData, setBackupData] = useState<any>(null);

  // 3. API Guidelines State
  const [configData, setConfigData] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Load baseline rules on mount and inspect potential backup
  useEffect(() => {
    // A. Fetch config guidance values list
    fetch("/api/config-data")
      .then((res) => res.json())
      .then((data) => {
        setConfigData(data);
        setLoadingConfig(false);
      })
      .catch((err) => {
        console.error("Error al cargar guías de referencia:", err);
        setLoadingConfig(false);
      });

    // B. Guard checks for previous data to recover
    const rawBackup = localStorage.getItem("uti_evaluation_backup");
    if (rawBackup) {
      try {
        const parsed = JSON.parse(rawBackup);
        if (
          parsed &&
          (parsed.instituciones?.length > 0 ||
            parsed.profesionales?.length > 0 ||
            parsed.equipos?.length > 0 ||
            parsed.estructuraItems?.some((item: any) => item.cumple))
        ) {
          setBackupData(parsed);
          setShowRecoverPrompt(true);
        }
      } catch (err) {
        console.error("Error parsing backup data to recover:", err);
      }
    }
  }, []);

  // Sync current data to LocalStorage backup
  useEffect(() => {
    if (instituciones.length > 0 || profesionales.length > 0 || equipos.length > 0) {
      const backup = {
        instituciones,
        activeInstId,
        profesionales,
        estructuraItems,
        equipos,
        reporte,
        scriptUrl,
        teamworkChecklist,
        teleIcuChecklist,
        docenciaChecklist,
        satiChecklist,
        indicadores
      };
      localStorage.setItem("uti_evaluation_backup", JSON.stringify(backup));
    }
  }, [instituciones, activeInstId, profesionales, estructuraItems, equipos, reporte, scriptUrl, teamworkChecklist, teleIcuChecklist, docenciaChecklist, satiChecklist, indicadores]);

  // Clean-up reset handler
  const handleResetEverything = (skipConfirmation = false) => {
    if (!skipConfirmation) {
      const confirmReset = window.confirm("¿Está seguro de que desea reiniciar la evaluación? Se perderán todos los datos actuales.");
      if (!confirmReset) return;
    }

    setInstituciones([]);
    setActiveInstId("");
    setProfesionales([]);
    setEstructuraItems(prev => prev.map(item => ({ ...item, cumple: false })));
    setEquipos([]);
    setReporte(null);
    setErrorBanner(null);
    setTeamworkChecklist([
      { id: "tw-1", label: "Pases de guardia estructurados según protocolo SBAR", cumple: false, peso: 8 },
      { id: "tw-2", label: "Rondas matutinas multidisciplinarias diarias (Médico, Enf, Kine, Farm, Nutri)", cumple: false, peso: 10 },
      { id: "tw-3", label: "Briefings de seguridad al inicio de cada turno de enfermería", cumple: false, peso: 6 },
      { id: "tw-4", label: "Protocolo formal de soporte de salud mental y debriefing para el personal", cumple: false, peso: 7 },
      { id: "tw-5", label: "Asignación de roles claros durante escenarios de reanimación (CRM)", cumple: false, peso: 9 }
    ]);
    setTeleIcuChecklist([
      { id: "tele-1", label: "Terminal para tele-interconsulta equipada con audio y video HD", cumple: false, peso: 8 },
      { id: "tele-2", label: "Seguimiento remoto o soporte por tele-expertos para decisiones complejas", cumple: false, peso: 10 },
      { id: "tele-3", label: "Protocolos de seguridad y confidencialidad encriptados para tele-ICU", cumple: false, peso: 8 },
      { id: "tele-4", label: "Acceso remotos de familiares con mediación médica protocolizada", cumple: false, peso: 6 }
    ]);
    setDocenciaChecklist([
      { id: "doc-1", label: "Residencia médica acreditada en Terapia Intensiva", cumple: false, peso: 10 },
      { id: "doc-2", label: "Enfermeros tutores e instructores dedicados a la capacitación continua", cumple: false, peso: 8 },
      { id: "doc-3", label: "Ateneo clínico-bibliográfico semanal activo con actas de firmas", cumple: false, peso: 7 },
      { id: "doc-4", label: "Participación en proyectos multicéntricos o registros nacionales de investigación", cumple: false, peso: 6 }
    ]);
    setSatiChecklist([
      { id: "sati-1", label: "Director o Jefe de Servicio acreditado como Miembro Especialista SATI", cumple: false, peso: 12 },
      { id: "sati-2", label: "Médicos de guardia activa con curso FCCS o reválida certificada", cumple: false, peso: 10 },
      { id: "sati-3", label: "Kinesiología intensiva integral y con presencia las 24 horas", cumple: false, peso: 12 },
      { id: "sati-4", label: "Manual de Normas de Procedimientos de Organización y Funcionamiento SATI", cumple: false, peso: 8 }
    ]);
    setIndicadores([
      { id: "ind-1", nombre: "Mortalidad General Observada en UTI", valorActual: "", metaNacional: "< 25.0%", estado: "Bajo Control" },
      { id: "ind-2", nombre: "Días Promedio de Estadía (ALOS)", valorActual: "", metaNacional: "< 6.5 días", estado: "Atención" },
      { id: "ind-3", nombre: "Infecciones Asociadas a Catéter (IACS/1000 d)", valorActual: "", metaNacional: "< 2.5‰", estado: "Atención" },
      { id: "ind-4", nombre: "Neumonías Asociadas a ARM (NAV/1005 d)", valorActual: "", metaNacional: "< 10.0‰", estado: "Crítico" },
      { id: "ind-5", nombre: "Tasa de Extubación Fallida a 48 hs", valorActual: "", metaNacional: "< 5.0%", estado: "Bajo Control" }
    ]);
    localStorage.removeItem("uti_evaluation_backup");
    sessionStorage.clear();
    setActiveTab("institucion");
  };

  const handleApplyRecoveredData = () => {
    if (!backupData) return;
    if (backupData.instituciones) setInstituciones(backupData.instituciones);
    if (backupData.activeInstId) setActiveInstId(backupData.activeInstId);
    if (backupData.profesionales) setProfesionales(backupData.profesionales);
    if (backupData.estructuraItems) setEstructuraItems(backupData.estructuraItems);
    if (backupData.equipos) setEquipos(backupData.equipos);
    if (backupData.reporte) setReporte(backupData.reporte);
    if (backupData.scriptUrl) setScriptUrl(backupData.scriptUrl);
    if (backupData.teamworkChecklist) setTeamworkChecklist(backupData.teamworkChecklist);
    if (backupData.teleIcuChecklist) setTeleIcuChecklist(backupData.teleIcuChecklist);
    if (backupData.docenciaChecklist) setDocenciaChecklist(backupData.docenciaChecklist);
    if (backupData.satiChecklist) setSatiChecklist(backupData.satiChecklist);
    if (backupData.indicadores) setIndicadores(backupData.indicadores);
    setShowRecoverPrompt(false);
  };

  // 4. Input Toggle handlers
  const handleToggleEstructura = (id: string) => {
    setEstructuraItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, cumple: !item.cumple } : item
      )
    );
  };

  const handleAddProfesional = (prof: Profesional) => {
    setProfesionales((prev) => [...prev, prof]);
  };

  const handleRemoveProfesional = (id: string) => {
    setProfesionales((prev) => prev.filter((p) => p.id !== id));
  };

  // Multiple institutions CRUD hooks
  const handleSaveInstitucion = (updated: InformacionInstitucion) => {
    setInstituciones(prev => prev.map(inst => inst.id === updated.id ? updated : inst));
  };

  const handleAddInstitucion = (newInst: InformacionInstitucion) => {
    setInstituciones(prev => [...prev, newInst]);
    setActiveInstId(newInst.id);
  };

  const handleDuplicateInstitucion = (id: string) => {
    const target = instituciones.find(i => i.id === id);
    if (!target) return;

    const newCode = `INST-${Math.floor(1000 + Math.random() * 9000)}`;
    const copy: InformacionInstitucion = {
      ...target,
      id: newCode,
      nombre: `${target.nombre} (Duplicado)`,
      nombreCorto: `${target.nombreCorto || "UTI"}-DUP`,
      fechaEvaluacion: new Date().toISOString().split('T')[0]
    };

    setInstituciones(prev => [...prev, copy]);
    setActiveInstId(newCode);
  };

  // 5. Submit Audit to Gemini on the server side
  const handleRunAudit = async () => {
    setLoadingAudit(true);
    setErrorBanner(null);
    setActiveTab("auditoria"); // Focus onto audit page to see loader or results

    try {
      const response = await fetch("/api/evaluar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institucion,
          profesionales,
          estructura: estructuraItems,
          equipos
        })
      });

      if (!response.ok) {
        throw new Error("Respuesta no satisfactoria del servidor de auditoría.");
      }

      const data = await response.json();
      setReporte(data);
    } catch (err: any) {
      console.error("Error corriendo auditoría:", err);
      setErrorBanner("No se pudo obtener la auditoría con Inteligencia Artificial. Por favor compruebe la conexión del servidor o intente de nuevo.");
    } finally {
      setLoadingAudit(false);
    }
  };

  // Sections translation map
  const SECTIONS_METADATA = [
    { id: "institucion", label: "1. Identificación de la institución", icon: Building },
    { id: "staff-medico", label: "2. Staff médico", icon: Stethoscope },
    { id: "enfermeria", label: "3. Enfermería", icon: Heart },
    { id: "equipo-multidisciplinario", label: "4. Equipo multidisciplinario", icon: Users },
    { id: "infraestructura", label: "5. Infraestructura", icon: Building },
    { id: "tecnologia", label: "6. Tecnología y equipamiento", icon: Cpu },
    { id: "seguridad", label: "7. Seguridad del paciente", icon: ShieldCheck },
    { id: "indicadores", label: "8. Indicadores ICU", icon: TrendingUp },
    { id: "teamwork", label: "9. Teamwork", icon: UsersRound },
    { id: "tele-icu", label: "10. Tele-ICU", icon: Tv },
    { id: "docencia", label: "11. Docencia e investigación", icon: GraduationCap },
    { id: "sati", label: "12. SATI", icon: Award },
    { id: "scores", label: "13. Scores", icon: ClipboardCheck },
    { id: "reportes", label: "14. Reportes", icon: FileCheck },
    { id: "exportacion", label: "15. Exportaciones", icon: Download }
  ];

  return (
    <>
      <div id="app-root-container" className="min-h-screen bg-[#f8fafc] pb-16 font-sans antialiased text-slate-800">
      
      {/* Upper Navigation / Decorative Banner */}
      <header id="app-header" className="bg-[#0f172a] text-white border-b border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          
          {/* Logo and App Title */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shrink-0">
              <Activity id="main-heart-icon" className="w-6.5 h-6.5 animate-pulse" />
            </div>
            <div>
              <h1 id="main-app-title" className="text-lg sm:text-xl font-extrabold text-blue-50 tracking-tight uppercase leading-tight">
                Sistema de Valoración de UCIs <span className="text-blue-400 font-black">Dr Rafael Avila</span>
              </h1>
              <p id="main-subtitle" className="text-xs text-slate-400 leading-normal font-medium mt-0.5">
                Plataforma de evaluación, categorización y auditoría clínica para Terapias Intensivas de la República Argentina (SATI)
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Active Institution Name is PERMANENTLY visible here on the header */}
            <div id="header-active-inst-badge" className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
              <span className="text-2xl select-none">{institucion.logoInstitucional || "🏥"}</span>
              <div className="text-left">
                <span className="text-[9px] uppercase text-blue-400 font-black tracking-widest block">UTI BAJO EVALUACIÓN</span>
                <span className="text-xs font-extrabold text-slate-100 block truncate max-w-[180px]">{institucion.nombre || "Sin nombre establecido"}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ID: {institucion.id || "---"} • {institucion.complejidad ? institucion.complejidad.split(" ")[0] : "S/N"}</span>
              </div>
            </div>

            {/* Global button: "Nueva evaluación" */}
            <button
              id="global-btn-nueva-evaluacion"
              type="button"
              onClick={() => handleResetEverything(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-650 hover:bg-rose-700 cursor-pointer text-white text-xs font-black uppercase rounded-xl transition-all shadow-md shadow-rose-900/20 active:scale-95 border border-rose-550 shrink-0"
              title="Limpiar todo el estado e iniciar una nueva evaluación vacía"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nueva evaluación</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Global Error Banner */}
        {errorBanner && (
          <div id="global-error-banner" className="mb-6 p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Error de Auditoría:</span> {errorBanner}
            </div>
          </div>
        )}

        {/* Mobile responsive selector: visible only under lg breakpoint */}
        <div className="lg:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Módulo:</span>
            <select
              id="mobile-tab-select"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-105"
            >
              {SECTIONS_METADATA.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>
          
          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 py-1.5 px-2.5 rounded-full font-bold uppercase shrink-0">
            Paso {SECTIONS_METADATA.findIndex(t => t.id === activeTab) + 1} de 15
          </span>
        </div>

        {/* Desktop & Mobile Grid containing Left Sidebar and Right active views */}
        <div id="dashboard-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Responsive Sticky Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-2 sticky top-6 shadow-sm">
            <div className="px-3 py-2 border-b border-slate-100 mb-3">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">Módulos Auditables</span>
              <span className="text-xs text-slate-500 mt-1 block">UCI Dr Rafael Avila</span>
            </div>
            
            <nav className="flex flex-col gap-1">
              {SECTIONS_METADATA.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`sidebar-tab-${tab.id}`}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right main panel display */}
          <div className="lg:col-span-9 space-y-6">
            
            {activeTab === "institucion" && (
              <div id="panel-institucion" className="space-y-6">
                {/* Identificación de la institución header rendered ONLY here */}
                <IdentificacionInstitucionalHeader 
                  instituciones={instituciones}
                  activeId={activeInstId}
                  onSelect={setActiveInstId}
                  onSave={handleSaveInstitucion}
                  onAdd={handleAddInstitucion}
                  onDuplicate={handleDuplicateInstitucion}
                />
                <InformacionInstitucionForm 
                  data={institucion} 
                  onChange={setInstitucion} 
                />
                <div className="flex justify-end pt-2">
                  <button
                    id="goto-next-tab"
                    type="button"
                    onClick={() => setActiveTab("staff-medico")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    Siguiente: Staff Médico <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "staff-medico" && (
              <div id="panel-staff-medico" className="space-y-6">
                <PersonalForm 
                  profesionales={profesionales} 
                  onChange={setProfesionales} 
                  filterRoleGroup="medicos"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("institucion")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Institución
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enfermeria")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Enfermería <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "enfermeria" && (
              <div id="panel-enfermeria" className="space-y-6">
                <PersonalForm 
                  profesionales={profesionales} 
                  onChange={setProfesionales} 
                  filterRoleGroup="enfermeria"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("staff-medico")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Staff Médico
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("equipo-multidisciplinario")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Multidisciplinario <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "equipo-multidisciplinario" && (
              <div id="panel-equipo-multidisciplinario" className="space-y-6">
                <PersonalForm 
                  profesionales={profesionales} 
                  onChange={setProfesionales} 
                  filterRoleGroup="multidisciplinario"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("enfermeria")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Enfermería
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("infraestructura")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Infraestructura <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "infraestructura" && (
              <div id="panel-infraestructura" className="space-y-6">
                <EstructuraValoracion 
                  items={estructuraItems} 
                  onToggle={handleToggleEstructura} 
                  filterGroup="infraestructura"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("equipo-multidisciplinario")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Multidisciplinario
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tecnologia")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Tecnología <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "tecnologia" && (
              <div id="panel-tecnologia" className="space-y-6">
                <TecnologiaCriticaForm 
                  equipos={equipos} 
                  onChange={setEquipos} 
                  camasTotales={institucion.camasTotales}
                />
                
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Requisitos de Equipamiento (SATI)</h3>
                    <p className="text-xs text-slate-400">Verifique las directrices de equipamiento tecnológico crítico a continuación:</p>
                  </div>
                  <EstructuraValoracion 
                    items={estructuraItems} 
                    onToggle={handleToggleEstructura} 
                    filterGroup="tecnologia"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("infraestructura")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Infraestructura
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("seguridad")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Seguridad <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "seguridad" && (
              <div id="panel-seguridad" className="space-y-6">
                <EstructuraValoracion 
                  items={estructuraItems} 
                  onToggle={handleToggleEstructura} 
                  filterGroup="seguridad"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tecnologia")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Tecnología
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("indicadores")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Indicadores <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "indicadores" && (
              <div id="panel-indicadores" className="space-y-6">
                <IndicadoresEditForm 
                  indicadores={indicadores} 
                  onChange={setIndicadores} 
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("seguridad")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Seguridad
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("teamwork")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Teamwork <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "teamwork" && (
              <div id="panel-teamwork" className="space-y-6">
                <ChecklistGenericoEditable 
                  items={teamworkChecklist} 
                  onChange={setTeamworkChecklist} 
                  title="Puntos de Trabajo en Equipo y Teamwork UTI"
                  subtitle="Gestión y tildaduras de pases estructurados (SBAR), debates clínicos interactivos y soporte continuo al factor humano."
                  icon={Users}
                  accentColor="indigo"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("indicadores")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Indicadores
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tele-icu")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Tele-ICU <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "tele-icu" && (
              <div id="panel-tele-icu" className="space-y-6">
                <ChecklistGenericoEditable 
                  items={teleIcuChecklist} 
                  onChange={setTeleIcuChecklist} 
                  title="Aspectos de Ecosistema Digital y Tele-ICU"
                  subtitle="Plataforma de soporte consultivo, equipamientos telemétricos HD y monitorización a distancia autorizada de los pacientes de cuidados críticos."
                  icon={Tv}
                  accentColor="blue"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("teamwork")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Teamwork
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("docencia")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Docencia <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "docencia" && (
              <div id="panel-docencia" className="space-y-6">
                <ChecklistGenericoEditable 
                  items={docenciaChecklist} 
                  onChange={setDocenciaChecklist} 
                  title="Soporte de Docencia e Investigación Médica"
                  subtitle="Residencias médicas homologadas por el Ministerio, ateneos bibliográficos activos y participación activa en redes analíticas de SATI."
                  icon={GraduationCap}
                  accentColor="emerald"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tele-icu")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Tele-ICU
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("sati")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: SATI <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "sati" && (
              <div id="panel-sati" className="space-y-6">
                <ChecklistGenericoEditable 
                  items={satiChecklist} 
                  onChange={setSatiChecklist} 
                  title="Acreditación Institucional y Normativa SATI"
                  subtitle="Adherencia a los manuales organizacionales de la Sociedad Argentina de Terapia Intensiva y presencia kine/médica avalada."
                  icon={Award}
                  accentColor="teal"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("docencia")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: Docencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("scores")}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    Siguiente: Scores <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "scores" && (
              <div id="panel-scores" className="space-y-6">
                <BenchmarkingExport 
                  activeInst={institucion}
                  allInstituciones={instituciones}
                  onSelect={setActiveInstId}
                  profesionalesCount={profesionales.length}
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sati")}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Atrás: SATI
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleRunAudit}
                      disabled={loadingAudit}
                      className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/10"
                    >
                      <Sparkles className="w-4 h-4" /> Correr Auditoría Dr. Avila
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reportes" && (
              <div id="panel-reportes" className="space-y-6">
                <AuditoriaResultado 
                  reporte={reporte} 
                  loading={loadingAudit} 
                  onRunAudit={handleRunAudit}
                  institucionNombre={institucion.nombre}
                />
                {reporte && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("exportacion")}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex items-center gap-1.5"
                    >
                      Ir a Exportaciones <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "exportacion" && (
              <div id="panel-exportacion" className="space-y-6">
                <ExportacionGlobalForm 
                  institucion={institucion}
                  profesionales={profesionales}
                  estructuraItems={estructuraItems}
                  equipos={equipos}
                  reporte={reporte}
                  allInstituciones={instituciones}
                  onSelectInstitucion={setActiveInstId}
                  googleScriptUrl={scriptUrl}
                  setGoogleScriptUrl={setScriptUrl}
                  teamworkChecklist={teamworkChecklist}
                  setTeamworkChecklist={setTeamworkChecklist}
                  teleIcuChecklist={teleIcuChecklist}
                  setTeleIcuChecklist={setTeleIcuChecklist}
                  docenciaChecklist={docenciaChecklist}
                  setDocenciaChecklist={setDocenciaChecklist}
                  satiChecklist={satiChecklist}
                  setSatiChecklist={setSatiChecklist}
                  indicadores={indicadores}
                  setIndicadores={setIndicadores}
                />
              </div>
            )}

          </div>

        </div>

        {/* Global sticky/floating prompt indicator during loading state */}
        {loadingAudit && (
          <div id="global-loader-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
            <div id="loader-content" className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center border border-slate-100 flex flex-col items-center">
              <div className="relative mb-4 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <Sparkles className="absolute w-6 h-6 text-indigo-500 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Analizando Terapia Intensiva</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                El Dr. Rafael Avila está cotejando la dotación horaria del personal y los equipamientos de su UTI con los estándares actualizados de la SATI...
              </p>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-3 py-1 rounded-full font-mono font-bold mt-4 animate-pulse">
                Consultando a Gemini 3.5
              </span>
            </div>
          </div>
        )}

      </main>

      {/* Recover Session/Backup Prompt Modal */}
      {showRecoverPrompt && (
        <div id="recover-backup-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fadeIn">
          <div id="recover-backup-modal-content" className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col gap-5">
            
            {/* Header Icon & Title */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0">
                <RotateCcw className="w-6 h-6 animate-spin-once" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-tight">¿Desea recuperar la evaluación previa?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Hemos detectado datos guardados automáticamente de una sesión anterior en este dispositivo.
                </p>
              </div>
            </div>

            {/* Informative summary of the backup */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 text-xs space-y-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Detalles de la sesión encontrada:</span>
              <div className="grid grid-cols-2 gap-3 font-medium text-slate-700">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">Instituciones</span>
                  <span className="font-bold text-slate-900">{backupData?.instituciones?.length || 0} registradas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">Staff Médico/Enfermería</span>
                  <span className="font-bold text-slate-900">{backupData?.profesionales?.length || 0} personas</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">Dispositivos Críticos</span>
                  <span className="font-bold text-slate-900">{backupData?.equipos?.length || 0} unidades</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">Normativa checklist</span>
                  <span className="font-bold text-slate-900">
                    {backupData?.estructuraItems?.filter((item: any) => item.cumple).length || 0} tildados
                  </span>
                </div>
              </div>
            </div>

            {/* Warning about choosing 'No' */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-850 leading-tight">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Si elige una <strong>evaluación limpia</strong>, se eliminarán permanentemente los registros anteriores de la memoria.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                id="btn-confirm-clean-evaluation"
                type="button"
                onClick={() => {
                  handleResetEverything(true);
                  setShowRecoverPrompt(false);
                }}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-bold rounded-xl transition-all text-center cursor-pointer"
              >
                No, iniciar evaluación limpia
              </button>
              <button
                id="btn-confirm-recover-previous"
                type="button"
                onClick={handleApplyRecoveredData}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all text-center cursor-pointer shadow-md shadow-blue-100"
              >
                Sí, recuperar datos anteriores
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Humble Footer */}
      <footer id="app-footer" className="mt-20 border-t border-slate-200 py-8 text-center text-xs text-slate-400 bg-white">
        <p>Sistema de Valoración de UCIs Dr Rafael Avila &copy; {new Date().getFullYear()} - República Argentina.</p>
        <p className="mt-1 flex items-center justify-center gap-1">
          Inspirado en los lineamientos éticos y formativos de la <Heart className="w-3 h-3 text-red-500 fill-red-100" /> Sociedad Argentina de Terapia Intensiva.
        </p>
      </footer>

    </div>
  </>
  );
}
