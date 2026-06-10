import React, { useState } from "react";
import { InformacionInstitucion, TipoInstitucionSec, NivelComplejidad, SectorTipo } from "../types";
import { 
  Building2, 
  Search, 
  PlusCircle, 
  Copy, 
  Save, 
  Calendar, 
  User, 
  Hash, 
  Compass, 
  AlertCircle, 
  Check, 
  Image,
  Layers,
  HelpCircle
} from "lucide-react";

interface Props {
  className?: string;
  instituciones: InformacionInstitucion[];
  activeId: string;
  onSelect: (id: string) => void;
  onSave: (data: InformacionInstitucion) => void;
  onAdd: (data: InformacionInstitucion) => void;
  onDuplicate: (id: string) => void;
}

const LOGO_OPTIONS = ["🏥", "🏢", "🏛️", "🩺", "❤️", "🔬", "🛡️"];

const PROVINCIAS_ARGENTINAS = [
  "CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const TIPOS_INSTITUCION: TipoInstitucionSec[] = [
  "Pública", "Privada", "Universitaria", "Municipal", "Provincial", "Nacional"
];

const NIVELES: NivelComplejidad[] = [
  "Nivel I (Complejidad Alta)",
  "Nivel II (Complejidad Media)",
  "Nivel III (Complejidad Básica)"
];

const SECTORES: SectorTipo[] = [
  "Pública" as any, // fallback
  "Público",
  "Privado",
  "Seguridad Social / Obras Sociales"
];

export const IdentificacionInstitucionalHeader: React.FC<Props> = ({
  instituciones,
  activeId,
  onSelect,
  onSave,
  onAdd,
  onDuplicate
}) => {
  // Find current active institution
  const activeInst = instituciones.find(i => i.id === activeId) || instituciones[0] || {
    id: "INST-NUEVA",
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
    fechaEvaluacion: new Date().toISOString().split('T')[0],
    evaluadorResponsable: "",
    logoInstitucional: "🏥"
  };

  // Search query
  const [searchQuery, setSearchQuery] = useState("");
  // Local edit states
  const [nombre, setNombre] = useState(activeInst?.nombre || "");
  const [nombreCorto, setNombreCorto] = useState(activeInst?.nombreCorto || "");
  const [ciudad, setCiudad] = useState(activeInst?.ciudad || "");
  const [provincia, setProvincia] = useState(activeInst?.provincia || "");
  const [tipoInstitucion, setTipoInstitucion] = useState<TipoInstitucionSec>(activeInst?.tipoInstitucion || "Pública");
  const [complejidad, setComplejidad] = useState<NivelComplejidad>(activeInst?.complejidad || "Nivel I (Complejidad Alta)");
  const [fechaEvaluacion, setFechaEvaluacion] = useState(activeInst?.fechaEvaluacion || new Date().toISOString().split('T')[0]);
  const [evaluadorResponsable, setEvaluadorResponsable] = useState(activeInst?.evaluadorResponsable || "");
  const [logoInstitucional, setLogoInstitucional] = useState(activeInst?.logoInstitucional || "🏥");

  // Keep state synchronized when active institution changes
  React.useEffect(() => {
    if (activeInst) {
      setNombre(activeInst.nombre);
      setNombreCorto(activeInst.nombreCorto || "");
      setCiudad(activeInst.ciudad || "");
      setProvincia(activeInst.provincia || "");
      setTipoInstitucion(activeInst.tipoInstitucion || "Pública");
      setComplejidad(activeInst.complejidad || "Nivel I (Complejidad Alta)");
      setFechaEvaluacion(activeInst.fechaEvaluacion || new Date().toISOString().split('T')[0]);
      setEvaluadorResponsable(activeInst.evaluadorResponsable || "");
      setLogoInstitucional(activeInst.logoInstitucional || "🏥");
    }
  }, [activeId, activeInst]);

  // Form validations
  const isNombreValido = nombre.trim().length > 0;
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLocalSave = () => {
    if (!isNombreValido) return;
    
    // Auto map values to old structure keys for backwards compatibility in other views
    const mappedSector: SectorTipo = tipoInstitucion === "Privada" 
      ? "Privado" 
      : (tipoInstitucion === "Pública" ? "Público" : "Seguridad Social / Obras Sociales");

    onSave({
      ...activeInst,
      nombre: nombre.trim(),
      nombreCorto: nombreCorto.trim() || nombre.trim().substring(0, 10).toUpperCase(),
      ciudad: ciudad.trim(),
      provincia,
      localidad: ciudad.trim(), // compatible key
      sector: mappedSector, // compatible key
      tipoInstitucion,
      complejidad,
      fechaEvaluacion,
      evaluadorResponsable: evaluadorResponsable.trim(),
      logoInstitucional
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLocalCreate = () => {
    const randomCode = `INST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInst: InformacionInstitucion = {
      id: randomCode,
      nombre: "Nueva Institución Hospitalaria",
      nombreCorto: "NIH",
      ciudad: "Ciudad Autónoma de Buenos Aires",
      provincia: "CABA",
      localidad: "CABA",
      sector: "Público",
      tipoInstitucion: "Pública",
      complejidad: "Nivel I (Complejidad Alta)",
      camasTotales: 8,
      camasAisladas: 1,
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluadorResponsable: "Dr. Evaluador",
      logoInstitucional: "🏥"
    };

    onAdd(newInst);
  };

  const filteredInstituciones = instituciones.filter(inst => 
    inst.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inst.nombreCorto && inst.nombreCorto.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="identificacion-destacada-container" className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-md mb-8 relative overflow-hidden">
      
      {/* Decorative colored badge on corner */}
      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-wider select-none z-10 flex items-center gap-1">
        <Layers className="w-3.5 h-3.5" /> Módulo de Identificación Unificado
      </div>

      {/* Title & Selection Layer */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
        
        {/* Main Section Header */}
        <div className="flex items-start gap-3">
          <span className="text-3xl p-2 bg-blue-50 rounded-xl block border border-blue-100 select-none">
            {logoInstitucional}
          </span>
          <div>
            <h2 id="main-identificacion-title" className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
              IDENTIFICACIÓN DE LA INSTITUCIÓN
              <span className="text-[11px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-100 font-mono">
                {activeInst?.id}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Registre y seleccione la entidad a evaluar. La información cargada impacta automáticamente en reportes, PDFs y métricas.
            </p>
          </div>
        </div>

        {/* Search & Selector UI */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          
          {/* Quick Search Input */}
          <div className="relative w-48">
            <input
              id="inst-search-input"
              type="text"
              placeholder="Buscar institución..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Quick Switch Switcher Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="inst-select-active" className="text-[10px] uppercase font-bold text-slate-400">
              Activa:
            </label>
            <select
              id="inst-select-active"
              value={activeId}
              onChange={(e) => onSelect(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500"
            >
              {filteredInstituciones.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.logoInstitucional} {inst.nombre} ({inst.id})
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Editable Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        
        {/* Name (highlighted, required) */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            Nombre de la Institución <span className="text-red-500 font-bold">*</span>
            {!isNombreValido && (
              <span className="text-[10px] text-red-500 font-normal flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> Requerido
              </span>
            )}
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Hospital de Clínicas José de San Martín"
            className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-bold focus:bg-white focus:ring-2 transition-all ${
              isNombreValido 
                ? "border-blue-200 focus:border-blue-500 focus:ring-blue-50 text-slate-900" 
                : "border-red-300 focus:border-red-500 focus:ring-red-50 text-red-900"
            }`}
          />
        </div>

        {/* Short Name / Sigla */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Nombre Corto / Sigla</label>
          <input
            type="text"
            value={nombreCorto}
            onChange={(e) => setNombreCorto(e.target.value)}
            placeholder="Ej. HCJSM"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Logo Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Image className="w-3.5 h-3.5 text-blue-500" /> Logo Institucional
          </label>
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
            {LOGO_OPTIONS.map((logo) => (
              <button
                key={logo}
                type="button"
                onClick={() => setLogoInstitucional(logo)}
                className={`flex-1 py-1 text-center text-sm rounded-lg transition-all ${
                  logoInstitucional === logo 
                    ? "bg-white border border-slate-150 shadow-sm" 
                    : "hover:bg-white/40"
                }`}
              >
                {logo}
              </button>
            ))}
          </div>
        </div>

        {/* Ciudad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Ciudad / Localidad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ej. Recoleta, CABA"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Provincia */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Provincia</label>
          <select
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          >
            <option value="">Seleccione...</option>
            {PROVINCIAS_ARGENTINAS.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        {/* Tipo de Institución */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Tipo de Institución</label>
          <select
            value={tipoInstitucion}
            onChange={(e) => setTipoInstitucion(e.target.value as TipoInstitucionSec)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          >
            <option value="">Seleccione...</option>
            {TIPOS_INSTITUCION.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {/* Nivel de Complejidad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Complejidad Declarada</span>
          </label>
          <select
            value={complejidad}
            onChange={(e) => setComplejidad(e.target.value as NivelComplejidad)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          >
            <option value="">Seleccione...</option>
            {NIVELES.map((niv) => (
              <option key={niv} value={niv}>{niv}</option>
            ))}
          </select>
        </div>

        {/* Fecha de Evaluación */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Fecha de Evaluación
          </label>
          <input
            type="date"
            value={fechaEvaluacion}
            onChange={(e) => setFechaEvaluacion(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
          />
        </div>

        {/* Evaluador Responsable */}
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-blue-500" /> Evaluador Responsable
          </label>
          <input
            type="text"
            value={evaluadorResponsable}
            onChange={(e) => setEvaluadorResponsable(e.target.value)}
            placeholder="Dr. / Dra. con firma acreditada"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Automatic unique code indicator info label */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-slate-400" /> Código Automático
          </label>
          <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-600 select-all">
            {activeInst?.id}
          </div>
        </div>

      </div>

      {/* Primary Actions Button Group bar */}
      <div id="inst-actions-bar" className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 pt-4 border-t border-slate-100 gap-3">
        
        {/* Helper status text */}
        <div className="text-xs text-slate-400 flex items-center gap-1">
          {saveSuccess ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
              <Check className="w-4 h-4" /> ¡Identificación guardada en el sistema!
            </span>
          ) : (
            <span>Para registrar cambios permanentes haga clic en Guardar.</span>
          )}
        </div>

        {/* Right side buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* 1. Guardar institución */}
          <button
            id="btn-guardar-institucion-action"
            type="button"
            onClick={handleLocalSave}
            disabled={!isNombreValido}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-100 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Guardar Institución
          </button>

          {/* 2. Agregar nueva institución */}
          <button
            id="btn-agregar-nueva-inst-action"
            type="button"
            onClick={handleLocalCreate}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Agregar Nueva Institución
          </button>

          {/* 3. Duplicar evaluación */}
          <button
            id="btn-duplicar-evaluacion-action"
            type="button"
            onClick={() => onDuplicate(activeId)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicar Evaluación
          </button>

        </div>

      </div>

    </div>
  );
};
