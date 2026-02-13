// src/components/DetailSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building, ShieldCheck, ClipboardList, Map as MapIcon, CheckCircle2, AlertCircle, Save, Calendar, Hash, BookmarkCheck } from 'lucide-react';

const DetailSidebar = ({ isOpen, onClose, expediente, onUpdate, onViewMap }) => {
  const [editEstado, setEditEstado] = useState('A');
  const [editNotas, setEditNotas] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (expediente) {
      setEditEstado(expediente.estado_actual);
      setEditNotas(expediente.notas || '');
    }
  }, [expediente]);

  const handleSave = () => {
    onUpdate({ ...expediente, estado_actual: editEstado, notas: editNotas });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  if (!expediente) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 1000 }} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28 }} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '580px', backgroundColor: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column' }}>
            
            <AnimatePresence>
              {showSaved && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '14px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', zIndex: 1005 }}>✓ SINCRONIZADO</motion.div>
              )}
            </AnimatePresence>

            <div style={{ padding: '35px', flex: 1, overflowY: 'hidden' }}> {/* ELIMINAMOS SCROLL AQUÍ */}
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c7c7cc', marginBottom: '20px' }}><X size={32} /></button>
              
              <header style={{ marginBottom: '30px' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Expediente Técnico</span>
                <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', margin: '5px 0', lineHeight: 1.1 }}>{expediente.establecimiento}</h2>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                   <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#f2f2f7', fontSize: '9px', fontWeight: 'bold' }}>REF: {expediente.referencia_principal}</span>
                   <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: expediente.anexo_iv === 'SI' ? '#dcfce7' : '#f2f2f7', fontSize: '9px', fontWeight: 'bold' }}>ANEXO IV: {expediente.anexo_iv}</span>
                </div>
              </header>

              {/* GRID COMPACTO DE 3 COLUMNAS PARA VISUALIZACIÓN TOTAL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <DetailRow icon={<Building size={14} />} label="Titular" value={expediente.titular} />
                <DetailRow icon={<Hash size={14} />} label="Nº Finca" value={expediente.finca} />
                <DetailRow icon={<MapPin size={14} />} label="Municipio" value={expediente.municipio} />
                <DetailRow icon={<Calendar size={14} />} label="Caducidad" value={expediente.caducidad} />
                <DetailRow icon={<BookmarkCheck size={14} />} label="Simulacro" value={expediente.simulacro} />
                <DetailRow icon={<ClipboardList size={14} />} label="Ámbito" value={expediente.tipo} />
              </div>

              <section style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '12px' }}>Acción Administrativa</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <StatusButton active={editEstado === 'F'} color="#10b981" icon={<CheckCircle2 size={16}/>} label="Favorable" onClick={() => setEditEstado('F')} />
                  <StatusButton active={editEstado === 'A'} color="#ef4444" icon={<AlertCircle size={16}/>} label="Pendiente A" onClick={() => setEditEstado('A')} />
                </div>
              </section>

              <section>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '12px' }}>Notas Técnicas</p>
                <textarea value={editNotas} onChange={(e) => setEditNotas(e.target.value)} style={{ width: '100%', height: '100px', padding: '15px', borderRadius: '15px', backgroundColor: '#f9fafb', border: '1px solid #f2f2f7', outline: 'none', fontSize: '13px' }} placeholder="Introduzca apuntes de gestión..." />
              </section>
            </div>

            <div style={{ padding: '25px 35px', borderTop: '1px solid #f2f2f7', display: 'flex', gap: '15px', backgroundColor: '#fff' }}>
              <button onClick={handleSave} style={{ flex: 2, padding: '20px', borderRadius: '15px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Save size={18} /> Sincronizar Cambios</button>
              <button onClick={() => onViewMap(expediente)} style={{ flex: 1, padding: '20px', borderRadius: '15px', backgroundColor: '#1c1c1e', color: '#fff', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapIcon size={18} /></button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StatusButton = ({ active, color, icon, label, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: active ? `2px solid ${color}` : '1px solid #f2f2f7', backgroundColor: active ? `${color}10` : '#fff', cursor: 'pointer' }}>
    <div style={{ color: active ? color : '#c7c7cc' }}>{icon}</div>
    <span style={{ fontSize: '10px', fontWeight: '900', color: active ? color : '#8e8e93', textTransform: 'uppercase' }}>{label}</span>
  </button>
);

const DetailRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
    <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#f2f2f7', color: '#2563eb' }}>{icon}</div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: '8px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '11px', fontWeight: '800', color: '#1c1c1e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || '-'}</p>
    </div>
  </div>
);

export default DetailSidebar;