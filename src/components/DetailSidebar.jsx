// src/components/DetailSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building, ShieldCheck, ClipboardList, Map as MapIcon, CheckCircle2, AlertCircle, Save, FolderOpen, Calendar, Hash, BookmarkCheck, FileText, Laptop, Server, HardDrive } from 'lucide-react';

const DetailSidebar = ({ isOpen, onClose, expediente, onUpdate, onOpenFolder, isDark, onViewMap }) => {
  const [formData, setFormData] = useState({});
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => { if (expediente) setFormData(expediente); }, [expediente]);

  const save = () => { onUpdate(formData); setShowSaved(true); setTimeout(()=>setShowSaved(false), 2000); };

  if (!expediente) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000 }} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '750px', backgroundColor: isDark ? '#1C1C1E' : '#fff', color: isDark ? '#fff' : '#000', zIndex: 1001, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.1)' }}>
            
            <AnimatePresence>{showSaved && <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '14px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', zIndex: 1100 }}>✓ SINCRONIZADO</motion.div>}</AnimatePresence>

            <div style={{ padding: '35px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c7c7cc', cursor: 'pointer' }}><X size={32} /></button>
                <button onClick={() => onOpenFolder(formData)} style={{ padding: '12px 20px', borderRadius: '12px', backgroundColor: '#f0f7ff', color: '#2563eb', border: 'none', fontWeight: '900', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><FolderOpen size={16} /> ACCESO AL SERVIDOR</button>
              </div>

              <header style={{ marginBottom: '35px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>{formData.establecimiento}</h2>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', fontWeight: '900' }}>#{formData.expediente_num}</span>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: isDark ? '#333' : '#f2f2f7', fontSize: '10px', fontWeight: 'bold' }}>REF: {formData.referencia_principal}</span>
                </div>
              </header>

              {/* REJILLA COMPACTA DE 3 COLUMNAS PARA ELIMINAR SCROLL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <Field label="Titular" value={formData.titular} onChange={(v)=>setFormData({...formData, titular: v})} />
                <Field label="Ámbito" value={formData.tipo} onChange={(v)=>setFormData({...formData, tipo: v})} />
                <Field label="Uso" value={formData.uso} onChange={(v)=>setFormData({...formData, uso: v})} />
                <Field label="RD 393/2007" value={formData.rd393} onChange={(v)=>setFormData({...formData, rd393: v})} isSelect options={['SI','NO']} />
                <Field label="Apéndice 3" value={formData.apendice3} onChange={(v)=>setFormData({...formData, apendice3: v})} isSelect options={['SI','NO']} />
                <Field label="Anexo IV" value={formData.anexo_iv} onChange={(v)=>setFormData({...formData, anexo_iv: v})} isSelect options={['SI','NO']} />
                <Field label="Estado" value={formData.estado_actual} onChange={(v)=>setFormData({...formData, estado_actual: v})} isSelect options={['A','B1','B2','F','FSV','N/P','N/T','CERRADO','REV']} />
                <Field label="Caducidad" value={formData.caducidad} onChange={(v)=>setFormData({...formData, caducidad: v})} />
                <Field label="Simulacro" value={formData.simulacro} onChange={(v)=>setFormData({...formData, simulacro: v})} />
              </div>

              {/* SOPORTE FÍSICO */}
              <div style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: isDark ? '#2C2C2E' : '#f9fafb', borderRadius: '25px', marginBottom: '30px' }}>
                <Support icon={<FileText size={14}/>} label="Papel" val={formData.papel} />
                <Support icon={<Laptop size={14}/>} label="CD" val={formData.cd} />
                <Support icon={<Server size={14}/>} label="Server" val={formData.servidor} />
              </div>

              <section>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '12px' }}>Observaciones del Registro</p>
                <textarea value={formData.observaciones} onChange={(e)=>setFormData({...formData, observaciones: e.target.value})} style={{ width: '100%', height: '100px', padding: '20px', borderRadius: '22px', backgroundColor: isDark ? '#2C2C2E' : '#f9fafb', border: 'none', color: isDark ? '#fff' : '#000', fontSize: '13px', outline: 'none', resize: 'none' }} />
              </section>
            </div>
            
            <div style={{ padding: '30px 40px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '15px' }}>
              <button onClick={save} style={{ flex: 3, padding: '20px', borderRadius: '18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}><Save size={18} /> GUARDAR CAMBIOS</button>
              {/* BOTÓN VISOR TÁCTICO REPARADO */}
              <button onClick={() => onViewMap(formData)} style={{ flex: 1, padding: '20px', borderRadius: '18px', backgroundColor: '#1c1c1e', color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapIcon size={18} /></button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({ label, value, onChange, isSelect, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '8px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase' }}>{label}</label>
    {isSelect ? (
      <select value={value} onChange={(e)=>onChange(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '11px', outline: 'none' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type="text" value={value || ""} onChange={(e)=>onChange(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '11px', outline: 'none' }} />
    )}
  </div>
);

const Support = ({ icon, label, val }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ color: val === 'SI' ? '#34C759' : '#8e8e93' }}>{icon}</div>
    <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{label}: {val}</span>
  </div>
);

export default DetailSidebar;