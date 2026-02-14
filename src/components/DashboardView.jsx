// src/components/DashboardView.jsx
import React from 'react';
import { Server, Folder, FileSpreadsheet, FileText, BarChart3, Activity } from 'lucide-react';

const DashboardView = ({ data = [], onSwitchTab, onGenerateReport, serverPath, setServerPath, isDark }) => {
  const stats = {
    total: data.length,
    anexo: data.filter(e => e.anexo_iv === 'SI').length,
    pend: data.filter(e => ['A', 'B1', 'B2', 'REV'].includes(e.estado_actual)).length,
    fav: data.filter(e => e.estado_actual === 'F').length
  };

  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#1C1C1E';
  const borderCol = isDark ? '#333' : '#f0f0f5';

  return (
    <div style={{ padding: '60px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.05em', color: textPrimary, margin: 0 }}>VAULT <span style={{ color: '#2563eb' }}>CORE</span></h1>
          <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px' }}>Gestión Operativa de Planes de Autoprotección</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onGenerateReport} style={{ backgroundColor: '#059669', color: 'white', padding: '18px 28px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 12px 25px rgba(5,150,105,0.2)' }}>Crear Informe de Balance</button>
          <button onClick={() => onSwitchTab('table')} style={{ backgroundColor: '#2563eb', color: 'white', padding: '18px 28px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 12px 25px rgba(37,99,235,0.2)' }}>Matriz Completa</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '40px' }}>
        <StatCard title="TOTAL VAULT" value={stats.total} color="#2563eb" bg={cardBg} text={textPrimary} />
        <StatCard title="ANEXO IV" value={stats.anexo} color="#059669" bg={cardBg} text={textPrimary} highlight />
        <StatCard title="PRIORIDAD A" value={stats.pend} color="#ef4444" bg={cardBg} text={textPrimary} />
        <StatCard title="VALIDADOS (F)" value={stats.fav} color="#10b981" bg={cardBg} text={textPrimary} />
      </div>

      <section style={{ backgroundColor: cardBg, padding: '40px', borderRadius: '40px', border: `1px solid ${borderCol}` }}>
        <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '12px' }}><BarChart3 size={20}/> Balance Administrativo Operativo</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '10px', color: '#8e8e93', borderBottom: `2px solid ${borderCol}` }}>
              <th style={{ padding: '20px 0' }}>Ámbito</th>
              <th style={{ textAlign: 'center' }}>Obligados 393/2007</th>
              <th style={{ textAlign: 'center' }}>No Obligados</th>
              <th style={{ textAlign: 'right' }}>Total Carga</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${borderCol}` }}>
              <td style={{ padding: '25px 0', fontWeight: '800', color: textPrimary }}>Sector Forestal (PLEIF)</td>
              <td style={{ textAlign: 'center', color: '#2563eb', fontWeight: '900' }}>{data.filter(e=>e.tipo==='FORESTAL' && e.rd393==='SI').length}</td>
              <td style={{ textAlign: 'center', color: '#8e8e93' }}>{data.filter(e=>e.tipo==='FORESTAL' && e.rd393==='NO').length}</td>
              <td style={{ textAlign: 'right', fontWeight: '900', color: textPrimary }}>{data.filter(e=>e.tipo==='FORESTAL').length}</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${borderCol}` }}>
              <td style={{ padding: '25px 0', fontWeight: '800', color: textPrimary }}>Instalaciones Municipales</td>
              <td style={{ textAlign: 'center', color: '#2563eb', fontWeight: '900' }}>{data.filter(e=>e.tipo==='MUNICIPAL' && e.rd393==='SI').length}</td>
              <td style={{ textAlign: 'center', color: '#8e8e93' }}>{data.filter(e=>e.tipo==='MUNICIPAL' && e.rd393==='NO').length}</td>
              <td style={{ textAlign: 'right', fontWeight: '900', color: textPrimary }}>{data.filter(e=>e.tipo==='MUNICIPAL').length}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ backgroundColor: cardBg, padding: '40px', borderRadius: '40px', border: `1px solid ${borderCol}`, marginTop: '30px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}><Server size={20}/> Configuración de Infraestructura</h3>
        <div style={{ backgroundColor: isDark ? '#2C2C2E' : '#f9fafb', padding: '30px', borderRadius: '25px' }}>
          <p style={{ fontSize: '11px', fontWeight: '900', color: isDark ? '#8E8E93' : '#1c1c1e', textTransform: 'uppercase', marginBottom: '15px' }}>Ruta Maestra del Servidor (Carpeta PAU)</p>
          <div style={{ position: 'relative' }}>
            <Folder style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={20} />
            <input type="text" value={serverPath} onChange={(e) => setServerPath(e.target.value)} placeholder="Introduzca ruta del servidor..." style={{ width: '100%', padding: '20px 20px 20px 55px', borderRadius: '18px', border: '1px solid #3A3A3C', fontSize: '14px', fontWeight: 'bold', outline: 'none', backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', color: textPrimary, boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, color, highlight, bg, text }) => (
  <div style={{ backgroundColor: bg, padding: '35px', borderRadius: '35px', border: '1px solid rgba(0,0,0,0.03)', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
    {highlight && <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: '#10b981', color: '#fff', padding: '5px 12px', borderRadius: '10px', fontSize: '8px', fontWeight: '900' }}>● PROTEGIDO</div>}
    <p style={{ color: '#8e8e93', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{title}</p>
    <p style={{ fontSize: '48px', fontWeight: '900', margin: 0, color: text }}>{value.toLocaleString()}</p>
  </div>
);

export default DashboardView;