import React from "react";
import { InformacionInstitucion, SectorTipo, NivelComplejidad } from "../types";
import { Landmark, Bed, Layers, HelpCircle, ShieldAlert } from "lucide-react";

interface Props {
  data: InformacionInstitucion;
  onChange: (data: InformacionInstitucion) => void;
}

const PROVINCIAS_ARGENTINAS = [
  "CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const SECTORES: SectorTipo[] = ["Público", "Privado", "Seguridad Social / Obras Sociales"];

const NIVELES: NivelComplejidad[] = [
  "Nivel I (Complejidad Alta)",
  "Nivel II (Complejidad Media)",
  "Nivel III (Complejidad Básica)"
];

export const InformacionInstitucionForm: React.FC<Props> = ({ data, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let typedValue: any = value;
    if (name === "camasTotales" || name === "camasAisladas") {
      typedValue = value === "" ? 0 : parseInt(value, 10);
    }
    onChange({
      ...data,
      [name]: typedValue
    });
  };

  return (
    <div id="institucion-container" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
          <Landmark id="icon-landmark" className="w-6 h-6" />
        </div>
        <div>
          <h2 id="title-institucion" className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Información Institucional
          </h2>
          <p id="desc-institucion" className="text-sm text-slate-500">
            Defina la locación, el sector administrativo y el nivel de complejidad declarado de la unidad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label id="lbl-nombre" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Nombre de la Institución / Sanatorio / Hospital
          </label>
          <input
            id="input-nombre"
            type="text"
            name="nombre"
            value={data.nombre}
            onChange={handleInputChange}
            placeholder="Ej. Hospital de Clínicas José de San Martín"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Provincia y Localidad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label id="lbl-provincia" className="text-sm font-medium text-slate-700">
              Provincia
            </label>
            <select
              id="select-provincia"
              name="provincia"
              value={data.provincia}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
            >
              <option value="">Seleccione Provincia...</option>
              {PROVINCIAS_ARGENTINAS.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label id="lbl-localidad" className="text-sm font-medium text-slate-700">
              Localidad
            </label>
            <input
              id="input-localidad"
              type="text"
              name="localidad"
              value={data.localidad}
              onChange={handleInputChange}
              placeholder="Ej. San Miguel de Tucumán"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Sector Administrativo */}
        <div className="flex flex-col gap-1.5">
          <label id="lbl-sector" className="text-sm font-medium text-slate-700">
            Sector Financiero / Administrativo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SECTORES.map((sec) => (
              <button
                key={sec}
                id={`btn-sector-${sec.replace(/\s+/g, '')}`}
                type="button"
                onClick={() => onChange({ ...data, sector: sec })}
                className={`py-2 px-3 text-xs md:text-sm font-medium rounded-xl border transition-all text-center ${
                  data.sector === sec
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Categoría de Complejidad */}
        <div className="flex flex-col gap-1.5">
          <label id="lbl-complejidad" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Nivel de Complejidad Requerido (SATI / Res 748)
            <span className="group relative cursor-pointer text-slate-400 hover:text-slate-600">
              <HelpCircle className="w-4 h-4" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 text-xs text-white p-3 rounded-xl hidden group-hover:block shadow-xl z-20 leading-relaxed">
                <strong>Nivel I:</strong> Soporte multiorgánico integral, especialistas 24h, kinesiología 24h. <br />
                <strong>Nivel II:</strong> Complejidad media, kinesiología 12h, terapeutas diurnos. <br />
                <strong>Nivel III:</strong> Cuidados intermedios estables.
              </div>
            </span>
          </label>
          <div className="relative">
            <select
              id="select-complejidad"
              name="complejidad"
              value={data.complejidad}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 appearance-none"
            >
              <option value="">Seleccione Complejidad...</option>
              {NIVELES.map((niv) => (
                <option key={niv} value={niv}>{niv}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Camas */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Bed className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label id="lbl-camas-totales" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Camas Operativas Totales en UTI
              </label>
              <input
                id="input-camas-totales"
                type="number"
                name="camasTotales"
                min="0"
                value={data.camasTotales}
                onChange={handleInputChange}
                className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-lg font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Bed className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label id="lbl-camas-aisladas" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Camas con Aislamiento Activo
              </label>
              <input
                id="input-camas-aisladas"
                type="number"
                name="camasAisladas"
                min="0"
                value={data.camasAisladas}
                onChange={handleInputChange}
                className="w-24 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-lg font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {data.camasAisladas > data.camasTotales && (
        <div id="camas-warning-div" className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200 text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Las camas con aislamiento no pueden exceder las camas totales de la unidad. Por favor, revise el número.</span>
        </div>
      )}
    </div>
  );
};
