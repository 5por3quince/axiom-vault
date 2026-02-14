// src/components/DetailSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building, ShieldCheck, ClipboardList, Map as MapIcon, Save, FolderOpen, Calendar, Hash } from 'lucide-react';

const DetailSidebar = ({ isOpen, onClose, expediente, onUpdate, onOpenFolder, isDark }) => {
  const [f, setF] = useState({});

  useEffect(() => { if (expediente) setF(expediente); }, [expediente]);

  const save = () => { onUpdate(f); alert("Vault Sincronizado."); };

  if (!expediente) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000 }} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '620px', backgroundColor: isDark ? '#1C1C1E' : '#fff', color: isDark ? '#fff' : '#000', zIndex: 1001, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '35px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c7c7cc', cursor: 'pointer' }}><X size={32} /></button>
                <button onClick={() => onOpenFolder(expediente)} style={{ padding: '12px 20px', borderRadius: '14px', backgroundColor: '#f0f7ff', color: '#2563eb', border: 'none', fontWeight: '900', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><FolderOpen size={18} /> ACCESO AL SERVIDOR</button>
              </div>

              <header style={{ marginBottom: '35px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>{f.establecimiento}</h2>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', fontWeight: '900' }}>#{f.expediente_num}</span>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: isDark ? '#333' : '#f2f2f7', fontSize: '10px', fontWeight: 'bold' }}>REF: {f.referencia_principal}</span>
                </div>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <Field L="Titular" V={f.titular} O={(v)=>setF({...f, titular: v})} />
                <Field L="Ámbito" V={f.tipo} O={(v)=>setF({...f, tipo: v})} />
                <Field L="Uso" V={f.uso} O={(v)=>setF({...f, uso: v})} />
                <Field L="Nº Finca" V={f.finca} O={(v)=>setF({...f, finca: v})} />
                <Field L="Caducidad" V={f.caducidad} O={(v)=>setF({...f, caducidad: v})} />
                <Field L="Simulacro" V={f.simulacro} O={(v)=>setF({...f, simulacro: v})} />
                <Field L="Anexo IV" V={f.anexo_iv} O={(v)=>setF({...f, anexo_iv: v})} isS />
                <Field L="Estado" V={f.estado_actual} O={(v)=>setF({...f, estado_actual: v})} isS opts={['A','B1','B2','F','FSV','N/P','N/T','CERRADO','REV']} />
              </div>

              <section>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '12px' }}>Anotaciones Técnicas de Gestión</p>
                <textarea value={f.notas} onChange={(e)=>setF({...f, notas: e.target.value})} style={{ width: '100%', height: '140px', padding: '20px', borderRadius: '22px', backgroundColor: isDark ? '#2C2C2E' : '#f9fafb', border: 'none', color: isDark ? '#fff' : '#000', fontSize: '14px', outline: 'none' }} />
              </section>
            </div>
            <div style={{ padding: '30px 40px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '15px' }}>
              <button onClick={save} style={{ flex: 1, padding: '20px', borderRadius: '18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}><Save size={20} /> GUARDAR CAMBIOS</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({ L, V, O, isS, opts }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase' }}>{L}</label>
    {isS ? (
      <select value={V} onChange={(e)=>O(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 'bold' }}>{opts ? opts.map(o=><option key={o} value={o}>{o}</option>) : <><option value="SI">SI</option><option value="NO">NO</option></>}</select>
    ) : (
      <input type="text" value={V || ""} onChange={(e)=>O(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
    )}
  </div>
);

export default DetailSidebar;