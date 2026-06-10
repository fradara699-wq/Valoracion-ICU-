import React, { useState } from "react";
import { CheckSquare, Square, Search, Plus, Trash2, Copy, Percent } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  cumple: boolean;
  peso: number;
}

interface Props {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  items: ChecklistItem[];
  onChange: (updated: ChecklistItem[]) => void;
  accentColor: "emerald" | "blue" | "indigo" | "teal";
}

export const ChecklistGenericoEditable: React.FC<Props> = ({
  title,
  subtitle,
  icon: Icon,
  items,
  onChange,
  accentColor
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = (id: string) => {
    onChange(
      items.map(item => (item.id === id ? { ...item, cumple: !item.cumple } : item))
    );
  };

  const handleUpdateText = (id: string, text: string) => {
    onChange(
      items.map(item => (item.id === id ? { ...item, label: text } : item))
    );
  };

  const handleUpdatePeso = (id: string, peso: number) => {
    onChange(
      items.map(item => (item.id === id ? { ...item, peso } : item))
    );
  };

  const handleAddItem = () => {
    const randomId = `${accentColor}-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: ChecklistItem = {
      id: randomId,
      label: "Nuevo lineamiento de evaluación",
      cumple: false,
      peso: 5
    };
    onChange([...items, newItem]);
  };

  const handleDuplicateItem = (item: ChecklistItem) => {
    const randomId = `${accentColor}-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: ChecklistItem = {
      ...item,
      id: randomId,
      label: `${item.label} (Copia)`
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  // Color mapping
  const colorStyles = {
    emerald: {
      bgActive: "bg-emerald-50/40 border-emerald-200 text-slate-800",
      text: "text-emerald-600",
      accentBg: "bg-emerald-50 text-emerald-750 border border-emerald-100",
      focusRing: "focus:ring-emerald-200",
      focusBorder: "focus:border-emerald-500",
      checkboxAccent: "text-emerald-600 focus:ring-emerald-500"
    },
    blue: {
      bgActive: "bg-blue-50/45 border-blue-200 text-slate-800",
      text: "text-blue-605",
      accentBg: "bg-blue-50 text-blue-820 border border-blue-100",
      focusRing: "focus:ring-blue-100",
      focusBorder: "focus:border-blue-500",
      checkboxAccent: "text-blue-600 focus:ring-blue-500"
    },
    indigo: {
      bgActive: "bg-indigo-50/45 border-indigo-200 text-slate-800",
      text: "text-indigo-600",
      accentBg: "bg-indigo-50 text-indigo-750 border border-indigo-100",
      focusRing: "focus:ring-indigo-100",
      focusBorder: "focus:border-indigo-500",
      checkboxAccent: "text-indigo-600 focus:ring-indigo-300"
    },
    teal: {
      bgActive: "bg-teal-50/45 border-teal-200 text-slate-800",
      text: "text-teal-605",
      accentBg: "bg-teal-50 text-teal-850 border border-teal-100",
      focusRing: "focus:ring-teal-100",
      focusBorder: "focus:border-teal-500",
      checkboxAccent: "text-teal-600 focus:ring-teal-500"
    }
  }[accentColor];

  const filteredItems = items.filter(i =>
    i.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPoints = items.reduce((sum, item) => sum + item.peso, 0);
  const metPoints = items.reduce((sum, item) => sum + (item.cumple ? item.peso : 0), 0);
  const percentMet = totalPoints > 0 ? Math.round((metPoints / totalPoints) * 105) : 0;
  const cappedPercent = Math.min(percentMet, 100);

  return (
    <div id={`checklist-${accentColor}-container`} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      
      {/* Header and statistics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-slate-650 shrink-0">
            <Icon className="w-6 h-6 text-slate-705" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight font-sans uppercase">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        
        {/* Statistics widget */}
        <div className="flex gap-3 items-center w-full md:w-auto self-stretch md:self-auto shrink-0 justify-between md:justify-end">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acreditación parcial</span>
            <span className="font-mono font-black text-slate-800 text-lg">
              {items.filter(i => i.cumple).length} / {items.length} <span className="text-xs text-slate-400 font-medium font-sans">items</span>
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="bg-slate-50 border border-slate-150 px-4 py-1.5 rounded-xl text-center">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cumplimiento Ponderado</span>
            <span className="font-mono font-extrabold text-blue-650 text-base">{cappedPercent}%</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar lineamiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 transition-all outline-none"
          />
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Criterio</span>
        </button>
      </div>

      {/* Checklist grid list */}
      <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-450 text-xs border border-dashed border-slate-200 rounded-xl">
            No se encontraron criterios de evaluación para "{searchTerm}".
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 p-3.5 rounded-xl border transition-all ${
                item.cumple
                  ? colorStyles.bgActive
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              {/* Checkbox wrapper */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className={`shrink-0 transition-colors ${
                    item.cumple ? colorStyles.text : "text-slate-400 hover:text-slate-650"
                  }`}
                  title={item.cumple ? "Desmarcar" : "Cumple"}
                >
                  {item.cumple ? (
                    <CheckSquare className="w-5.5 h-5.5" />
                  ) : (
                    <Square className="w-5.5 h-5.5" />
                  )}
                </button>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded md:hidden">
                  Peso: {item.peso} pts
                </span>
              </div>

              {/* Editable Label Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateText(item.id, e.target.value)}
                  className={`w-full px-2 py-1.5 rounded-lg border-0 bg-transparent text-sm font-semibold text-slate-800 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-blue-200 focus:border-blue-400`}
                  placeholder="Editar texto del lineamiento..."
                />
              </div>

              {/* Weight and actions */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0 mt-2 md:mt-0">
                {/* Editable Weight */}
                <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200 px-2 py-1 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest leading-none">Peso:</span>
                  <input
                    type="number"
                    value={item.peso}
                    min="0"
                    onChange={(e) => handleUpdatePeso(item.id, Number(e.target.value) || 0)}
                    className="w-10 bg-white border border-slate-250 rounded px-1 text-center font-mono text-xs font-bold text-slate-755"
                  />
                  <span className="text-[10px] text-slate-400 font-bold font-mono">pts</span>
                </div>

                <div className="h-5 w-px bg-slate-200 mx-1" />

                {/* Actions */}
                <button
                  type="button"
                  onClick={() => handleDuplicateItem(item)}
                  className="p-1.5 hover:bg-slate-100 text-slate-450 hover:text-slate-700 rounded-lg transition-all"
                  title="Duplicar lineamiento"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-all"
                  title="Eliminar lineamiento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
