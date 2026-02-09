// src/components/DetailSidebar.jsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  ShieldCheck, FileText, FolderOpen, User, HardDrive, 
  X, Calendar, Info, Edit3, Save, Briefcase, AlertTriangle,
  FileCheck, Globe, MapPin, Hash, Database, Layers
} from 'lucide-react';
import { generateOfficialPDF } from '../services/pdfService';
import { ESTADOS } from '../config/schema';

const DetailSidebar = ({ expediente, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (expediente) {
      setEditData({ ...expediente });
      setIsEditing(false);
    }
  }, [expediente]);

  if (!expediente || !editData) return null;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleOpenFolder = async () => {
    const folderPath = `C:/AXIOM_CUSTODIA/EXP_${expediente.n_expediente_cd}`;
    try {
      await invoke('create_expediente_folder', { path: folderPath });
      await invoke('open_pau_folder', { path: folderPath });
    } catch (err) {
      alert("Error táctico: No se puede acceder a la ruta. Verifique permisos en C:/");
    }
  };

  const handlePDFTrigger = async () => {
    setIsGenerating(true);
    try {
      await generateOfficialPDF([editData]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <aside className="w-[500px] glass h-full border-l border-gray-200 dark:border-white/10 flex flex-col animate-sidebar shadow-2xl z-50 overflow-hidden bg-white/95 text-[#1d1d1f]">
      
      {/* HEADER: IDENTIFICACIÓN Y TIPO */}
      <div className="p-8 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-[9px] font-black bg-blue-600 text-white uppercase tracking-widest shadow-md">
              {expediente.tipo}
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] font-black bg-gray-800 text-white uppercase tracking-widest shadow-md">
              # {expediente.n_expediente_cd}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className={`p-2 rounded-full transition-all ${isEditing ? 'bg-orange-100 text-orange-600 rotate-12' : 'hover:bg-gray-100 text-gray-400'}`}
              title="Modificar Expediente"
            >
              <Edit3 size={20}/>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <label className="text-[9px] font-black text-blue-600 uppercase ml-1 tracking-tighter">Establecimiento</label>
            <input 
              className="text-xl font-black w-full bg-white border-2 border-blue-500 rounded-2xl px-4 py-2 uppercase outline-none shadow-inner" 
              value={editData.establecimiento} 
              onChange={(e) => setEditData({...editData, establecimiento: e.target.value.toUpperCase()})} 
            />
          </div>
        ) : (
          <h2 className="text-2xl font-black tracking-tighter leading-tight uppercase text-gray-800">{expediente.establecimiento}</h2>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        
        {/* HITOS LÍNEA ROJA: ANEXO IV */}
        <div className={`p-5 rounded-[2rem] flex items-center gap-5 border-2 transition-all ${editData.anexo_iv ? 'bg-green-50 border-green-200 shadow-lg shadow-green-500/10' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
          <div className={`p-3 rounded-full ${editData.anexo_iv ? 'shield-active shadow-xl shadow-green-500/30' : 'bg-gray-300'}`}>
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase text-green-700 tracking-widest">Protocolo Anexo IV</p>
            <p className="text-sm font-bold text-green-900">{editData.anexo_iv ? "VALIDADO Y VIGENTE" : "PENDIENTE DE REGISTRO"}</p>
          </div>
          {isEditing && (
            <input 
              type="checkbox" 
              className="w-6 h-6 accent-green-600 cursor-pointer"
              checked={editData.anexo_iv}
              onChange={(e) => setEditData({...editData, anexo_iv: e.target.checked})}
            />
          )}
        </div>

        {/* SECCIÓN 1: ESTATUS LEGAL Y TÉCNICO */}
        <Section title="Estatus Legal y Técnico" icon={<Briefcase size={14}/>} color="text-blue-600">
          <DetailField 
            isEdit={isEditing} 
            label="Técnico Asignado" 
            value={editData.tecnico_asignado} 
            onChange={(v) => setEditData({...editData, tecnico_asignado: v})} 
            placeholder="Nombre del Técnico"
            icon={<User size={12}/>}
          />
          <DetailField 
            isEdit={isEditing} 
            label="Titular / Propiedad" 
            value={editData.titular} 
            onChange={(v) => setEditData({...editData, titular: v})} 
          />
          <div className="grid grid-cols-2 gap-2">
            <DetailField label="Obligado R.D. 393/2007" value={editData.obligado_rd_393_2007 ? "SÍ" : "NO"} />
            <DetailField label="Apéndice 3 O.M." value={editData.apendice_3_om_bomberos ? "SÍ" : "NO"} />
          </div>
          <DetailField 
            isEdit={isEditing} 
            label="Estado Actual" 
            value={editData.estado_actual} 
            onChange={(v) => setEditData({...editData, estado_actual: v})} 
            isSelect 
            options={Object.keys(ESTADOS)} 
          />
        </Section>

        {/* SECCIÓN 2: CUSTODIA Y DATOS CATASTRALES */}
        <Section title="Datos de Custodia" icon={<HardDrive size={14}/>} color="text-purple-600">
          <DetailField 
            isEdit={isEditing} 
            label="Referencia Catastral" 
            value={editData.ref_catastral} 
            onChange={(v) => setEditData({...editData, ref_catastral: v})} 
            highlight 
            icon={<Globe size={12}/>}
          />
          <div className="grid grid-cols-2 gap-2">
            <DetailField isEdit={isEditing} label="Nº Finca" value={editData.n_finca} onChange={(v) => setEditData({...editData, n_finca: v})} />
            <DetailField isEdit={isEditing} label="Uso (CTE DB SI)" value={editData.uso_pau} onChange={(v) => setEditData({...editData, uso_pau: v})} />
          </div>
          <DetailField 
            isEdit={isEditing} 
            label="Ubicación Física" 
            value={editData.ubicacion_fisica} 
            onChange={(v) => setEditData({...editData, ubicacion_fisica: v})} 
            icon={<MapPin size={12}/>}
          />
        </Section>

        {/* SECCIÓN 3: CRONOLOGÍA ADMINISTRATIVA */}
        <Section title="Seguimiento y Fechas" icon={<Calendar size={14}/>} color="text-orange-600">
           <div className="grid grid-cols-2 gap-2">
             <DetailField isEdit={isEditing} label="Entrada P.A." value={editData.entrada_pa_fecha} onChange={(v) => setEditData({...editData, entrada_pa_fecha: v})} />
             <DetailField isEdit={isEditing} label="Simulacro" value={editData.fecha_simulacro} onChange={(v) => setEditData({...editData, fecha_simulacro: v})} />
           </div>
           <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
             <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Caducidad Prevista (3-4 años)</p>
                <AlertTriangle size={12} className="text-red-400" />
             </div>
             {isEditing ? (
               <input 
                type="text" 
                className="w-full bg-transparent text-sm font-black text-red-700 outline-none" 
                value={editData.caducidad_pau} 
                onChange={(e) => setEditData({...editData, caducidad_pau: e.target.value})}
               />
             ) : (
               <p className="text-sm font-black text-red-700 tabular-nums">{editData.caducidad_pau || "SIN REGISTRO"}</p>
             )}
           </div>
        </Section>

        {/* SOPORTES DISPONIBLES */}
        <div className="p-4 glass border border-gray-100 rounded-[1.5rem]">
           <p className="text-[9px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-widest"><Database size={12}/> Soportes en Custodia</p>
           <div className="flex gap-3">
              <SoporteToggle label="Papel" active={editData.soporte_papel} isEdit={isEditing} onToggle={(v) => setEditData({...editData, soporte_papel: v})} />
              <SoporteToggle label="CD" active={editData.soporte_cd} isEdit={isEditing} onToggle={(v) => setEditData({...editData, soporte_cd: v})} />
              <SoporteToggle label="Servidor" active={editData.soporte_servidor} isEdit={isEditing} onToggle={(v) => setEditData({...editData, soporte_servidor: v})} />
           </div>
        </div>

        {/* OBSERVACIONES */}
        <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-[1.5rem] mb-10">
           <p className="text-[10px] font-black text-yellow-600 uppercase mb-2 flex items-center gap-2 tracking-widest">
             <AlertTriangle size={12}/> Observaciones
           </p>
           {isEditing ? (
             <textarea 
               className="w-full bg-white/50 border-none rounded-xl p-3 text-xs font-medium outline-none focus:ring-1 ring-yellow-400 shadow-inner"
               rows="3"
               value={editData.observaciones}
               onChange={(e) => setEditData({...editData, observaciones: e.target.value})}
             />
           ) : (
             <p className="text-xs text-yellow-800 leading-relaxed italic">{editData.observaciones || "Sin anotaciones."}</p>
           )}
        </div>
      </div>

      {/* ACCIONES TÁCTICAS (STICKY FOOTER) */}
      <div className="p-8 border-t border-gray-100 bg-white/70 backdrop-blur-xl space-y-3">
        {isEditing ? (
          <button 
            onClick={handleSave} 
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Save size={18} /> Guardar Cambios en Vault
          </button>
        ) : (
          <>
            <button 
              onClick={handleOpenFolder} 
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <FolderOpen size={18} /> Abrir Carpeta de Custodia
            </button>
            <button 
              onClick={handlePDFTrigger} 
              disabled={isGenerating} 
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 transition-all ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-500/20'}`}
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <FileCheck size={18} />
              )}
              {isGenerating ? "GENERANDO..." : "Lanzar Informe PDF Oficial"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

const Section = ({ title, icon, color, children }) => (
  <section className="space-y-3">
    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${color || 'text-gray-400'}`}>
      {icon} {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const DetailField = ({ label, value, highlight, isEdit, onChange, isSelect, options, placeholder, icon }) => (
  <div className="p-3 bg-white border border-gray-100 rounded-2xl flex justify-between items-center transition-all hover:border-blue-200 group">
    <div className="flex flex-col flex-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{label}</p>
      {isEdit ? (
        isSelect ? (
          <select className="text-xs font-bold bg-blue-50 border-none outline-none rounded-lg p-1 text-blue-600" value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map(o => <option key={o} value={o}>{ESTADOS[o]?.label || o}</option>)}
          </select>
        ) : (
          <input className="text-xs font-bold bg-blue-50 border-none outline-none rounded-lg p-1 text-blue-600 w-full" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />
        )
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          <p className={`text-xs font-bold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>
            {value || "---"}
          </p>
        </div>
      )}
    </div>
  </div>
);

const SoporteToggle = ({ label, active, isEdit, onToggle }) => (
  <button 
    disabled={!isEdit}
    onClick={() => onToggle(!active)}
    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
      active 
      ? 'bg-blue-600 text-white border-blue-700 shadow-md' 
      : 'bg-gray-100 text-gray-400 border-gray-200 opacity-40'
    }`}
  >
    {label}
  </button>
);

export default DetailSidebar;