// src/components/NewExpForm.jsx
import React, { useState } from 'react';
import { INITIAL_EXPEDIENTE_FIELDS } from '../config/schema';
import { Save, X, Shield, AlertCircle, FileText, Database } from 'lucide-react';

const NewExpForm = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState(INITIAL_EXPEDIENTE_FIELDS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="glass w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
        
        {/* HEADER DEL FORMULARIO */}
        <div className="p-10 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/30">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight dark:text-white">Alta en Vault</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Protocolo de Registro Administrativo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all text-gray-400"><X size={24} /></button>
        </div>

        {/* CUERPO DEL FORMULARIO: GRID BENTO */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto max-h-[70vh]">
          
          {/* COLUMNA 1: IDENTIFICACIÓN PRINCIPAL */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-2">Identificación</h4>
            <InputField label="Establecimiento" value={form.establecimiento} onChange={(v) => setForm({...form, establecimiento: v})} placeholder="Nombre Oficial" />
            <InputField label="Titular / Razón Social" value={form.titular} onChange={(v) => setForm({...form, titular: v})} />
            <InputField label="Nº Expediente (CD)" value={form.n_expediente_cd} onChange={(v) => setForm({...form, n_expediente_cd: v})} placeholder="ID-0000" />
          </div>

          {/* COLUMNA 2: DATOS LEGALES Y CATASTRO */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] px-2">Marco Legal</h4>
            <InputField label="Referencia Catastral" value={form.ref_catastral} onChange={(v) => setForm({...form, ref_catastral: v})} />
            <InputField label="Uso (CTE DB SI)" value={form.uso_pau} onChange={(v) => setForm({...form, uso_pau: v})} />
            <div className="grid grid-cols-2 gap-4">
              <ToggleField label="Obligado 393" active={form.obligado_rd_393_2007} onToggle={(v) => setForm({...form, obligado_rd_393_2007: v})} />
              <ToggleField label="TOP Riesgo" active={form.top_riesgo} onToggle={(v) => setForm({...form, top_riesgo: v})} danger />
            </div>
          </div>

          {/* COLUMNA 3: HITOS CRÍTICOS Y ESTADO */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] px-2">Estatus y Control</h4>
            <div className={`p-5 rounded-3xl border-2 transition-all ${form.anexo_iv ? 'border-green-500 bg-green-50' : 'border-gray-200 border-dashed bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase mb-1">Anexo IV</p>
                  <p className="text-[10px] font-bold text-gray-500">¿Escudo Verde Activo?</p>
                </div>
                <input type="checkbox" className="w-6 h-6 accent-green-500 cursor-pointer" checked={form.anexo_iv} onChange={(e) => setForm({...form, anexo_iv: e.target.checked})} />
              </div>
            </div>
            
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-2xl">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Estado Administrativo</label>
              <select className="w-full bg-transparent p-2 font-bold text-sm outline-none" value={form.estado_actual} onChange={(e) => setForm({...form, estado_actual: e.target.value})}>
                <option value="A">PENDIENTE (A)</option>
                <option value="B1">SOLICITADO (B1)</option>
                <option value="F">FAVORABLE (F)</option>
                <option value="REV">REVISIÓN (REV)</option>
              </select>
            </div>
          </div>

        </div>

        {/* ACCIONES FINALES */}
        <div className="p-10 bg-white/50 backdrop-blur-xl border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Save size={20} /> Blindar Registro en Vault
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1 px-2">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">{label}</label>
    <input 
      className="p-4 bg-gray-100 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ToggleField = ({ label, active, onToggle, danger }) => (
  <button onClick={() => onToggle(!active)} className={`p-3 rounded-2xl border text-center transition-all ${active ? (danger ? 'bg-red-500 text-white border-red-600' : 'bg-blue-600 text-white border-blue-700') : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
    <p className="text-[9px] font-black uppercase">{label}</p>
    <p className="text-[10px] font-bold">{active ? 'SÍ' : 'NO'}</p>
  </button>
);

export default NewExpForm;