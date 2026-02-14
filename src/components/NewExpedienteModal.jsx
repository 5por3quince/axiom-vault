// src/components/NewExpedienteModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, PlusCircle, Hash } from 'lucide-react';

const NewExpedienteModal = ({ isOpen, onClose, onSubmit, isDark }) => {
  const [f, setF] = useState({
    expediente_num: '', establecimiento: '', titular: '', tipo: 'GENERAL',
    obligado: 'NO', rd393: 'NO', apendice3: 'NO', sectorial: 'NO',
    estado_actual: 'A', fecha_mov: '', entrada_pau: '', papel: 'NO',
    cd: 'NO', servidor: 'NO', fecha_pau: '', caducidad: '', fin_anterior: '',
    tecnico: '', anexo_iv: 'NO', certificado: 'NO', uso: '',
    documentacion: '', simulacro: '', ubicacion_fisica: 'ARCHIVO',
    observaciones: '', finca: '', solicitada_rev: '', solicitudes_ant: '',
    referencia_catastral: '', municipio: 'Málaga'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!f.expediente_num || !f.establecimiento) return alert("Nº Expediente y Nombre son obligatorios.");
    onSubmit(f);
    setF({/* reset */});
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'relative', width: '90%', maxWidth: '1000px', height: '90vh', backgroundColor: isDark ? '#1C1C1E' : '#fff', color: isDark ? '#fff' : '#000', borderRadius: '40px', padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>NUEVO REGISTRO TÁCTICO</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c7c7cc' }}><X size={32} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <Input L="Nº EXPEDIENTE" V={f.expediente_num} O={(v)=>setF({...f, expediente_num: v})} isDark={isDark} />
          <Input L="ESTABLECIMIENTO" V={f.establecimiento} O={(v)=>setF({...f, establecimiento: v})} isDark={isDark} />
          <Input L="TITULAR" V={f.titular} O={(v)=>setF({...f, titular: v})} isDark={isDark} />
          
          <Select L="TIPO" V={f.tipo} O={(v)=>setF({...f, tipo: v})} opts={['FORESTAL', 'MUNICIPAL', 'NO MUNICIPAL', 'NO EXISTE']} isDark={isDark} />
          <Select L="OBLIGADO" V={f.obligado} O={(v)=>setF({...f, obligado: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Select L="R.D. 393/2007" V={f.rd393} O={(v)=>setF({...f, rd393: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Select L="APÉNDICE 3 O.M." V={f.apendice3} O={(v)=>setF({...f, apendice3: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Select L="REG. SECTORIAL" V={f.sectorial} O={(v)=>setF({...f, sectorial: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Select L="ESTADO ACTUAL" V={f.estado_actual} O={(v)=>setF({...f, estado_actual: v})} opts={['A', 'B1', 'B2', 'CERRADO', 'F', 'FSV']} isDark={isDark} />
          
          <Input L="FECHA ÚLT. MOV" V={f.fecha_mov} O={(v)=>setF({...f, fecha_mov: v})} type="date" isDark={isDark} />
          <Input L="ENTRADA PAU" V={f.entrada_pau} O={(v)=>setF({...f, entrada_pau: v})} type="date" isDark={isDark} />
          <div style={{ display: 'flex', gap: '5px' }}>
            <Select L="PAPEL" V={f.papel} O={(v)=>setF({...f, papel: v})} opts={['SI', 'NO']} isDark={isDark} />
            <Select L="CD" V={f.cd} O={(v)=>setF({...f, cd: v})} opts={['SI', 'NO']} isDark={isDark} />
            <Select L="SERV" V={f.servidor} O={(v)=>setF({...f, servidor: v})} opts={['SI', 'NO']} isDark={isDark} />
          </div>

          <Input L="FECHA PAU" V={f.fecha_pau} O={(v)=>setF({...f, fecha_pau: v})} type="date" isDark={isDark} />
          <Input L="CADUCIDAD" V={f.caducidad} O={(v)=>setF({...f, caducidad: v})} type="date" isDark={isDark} />
          <Input L="FIN ANT PAU" V={f.fin_anterior} O={(v)=>setF({...f, fin_anterior: v})} type="date" isDark={isDark} />
          <Input L="TÉCNICO" V={f.tecnico} O={(v)=>setF({...f, tecnico: v})} isDark={isDark} />
          <Select L="ANEXO IV" V={f.anexo_iv} O={(v)=>setF({...f, anexo_iv: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Select L="CERT. IMPLANT." V={f.certificado} O={(v)=>setF({...f, certificado: v})} opts={['SI', 'NO']} isDark={isDark} />
          <Input L="USO (CTB DB SI)" V={f.uso} O={(v)=>setF({...f, uso: v})} isDark={isDark} />
          <Input L="DOC. RECIBIDA" V={f.documentacion} O={(v)=>setF({...f, documentacion: v})} type="date" isDark={isDark} />
          <Input L="FECHA SIMULACRO" V={f.simulacro} O={(v)=>setF({...f, simulacro: v})} type="date" isDark={isDark} />
          <Select L="UBIC. FÍSICA" V={f.ubicacion_fisica} O={(v)=>setF({...f, ubicacion_fisica: v})} opts={['ARCHIVO', 'ARMARIO METALICO', 'DUPLICADO', 'SERVIDOR', 'NO DISPONE']} isDark={isDark} />
          <Input L="Nº FINCA" V={f.finca} O={(v)=>setF({...f, finca: v})} isDark={isDark} />
          <Input L="SOLICITADA REV" V={f.solicitada_rev} O={(v)=>setF({...f, solicitada_rev: v})} type="date" isDark={isDark} />
          <Input L="SOLICITUDES ANT" V={f.solicitudes_ant} O={(v)=>setF({...f, solicitudes_ant: v})} type="date" isDark={isDark} />
          <div style={{ gridColumn: 'span 3' }}>
            <Input L="REF CATASTRAL" V={f.referencia_catastral} O={(v)=>setF({...f, referencia_catastral: v})} isDark={isDark} />
          </div>
          <div style={{ gridColumn: 'span 3' }}>
            <p style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '8px' }}>OBSERVACIONES</p>
            <textarea value={f.observaciones} onChange={(e)=>setF({...f, observaciones: e.target.value})} style={{ width: '100%', height: '80px', borderRadius: '15px', padding: '15px', backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', border: '1px solid rgba(0,0,0,0.1)', color: isDark ? '#fff' : '#000', outline: 'none' }} />
          </div>

          <div style={{ gridColumn: 'span 3', marginTop: '20px' }}>
            <button type="submit" style={{ width: '100%', padding: '22px', borderRadius: '22px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Save size={20} /> REGISTRAR EN VAULT
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Input = ({ L, V, O, type = "text", isDark }) => (
  <div>
    <p style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '8px' }}>{L}</p>
    <input type={type} value={V} onChange={(e)=>O(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', color: isDark ? '#fff' : '#000', fontWeight: 'bold', outline: 'none' }} />
  </div>
);

const Select = ({ L, V, O, opts, isDark }) => (
  <div>
    <p style={{ fontSize: '9px', fontWeight: '900', color: '#8e8e93', textTransform: 'uppercase', marginBottom: '8px' }}>{L}</p>
    <select value={V} onChange={(e)=>O(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: isDark ? '#2C2C2E' : '#F9FAFB', color: isDark ? '#fff' : '#000', fontWeight: 'bold', outline: 'none' }}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default NewExpedienteModal;