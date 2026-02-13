import React, { useMemo } from 'react';
import { ShieldCheck, FileText, Activity, BarChart3, FileSpreadsheet } from 'lucide-react';

const DashboardView = ({ data = [], onSwitchTab, onGenerateReport }) => {
  const metrics = useMemo(() => ({
    total: data.length,
    anexoIV: data.filter(e => e.anexo_iv === 'SI').length,
    pendientes: data.filter(e => e.estado_actual === 'A').length,
    favorables: data.filter(e => e.estado_actual === 'F').length,
    forestal: data.filter(e => e.tipo?.includes('Forestal')).length,
    municipal: data.filter(e => e.tipo?.includes('Municipal')).length
  }), [data]);

  return (
    <div style={{ padding: '60px', height: '100%', overflowY: 'auto', backgroundColor: '#F5F5F7', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.05em', margin: 0, color: '#1c1c1e' }}>
            AXIOM <span style={{ color: '#2563eb' }}>VAULT</span>
          </h1>
          <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px' }}>
            Gestión de Planes de Autoprotección • Febrero 2026
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onGenerateReport} style={{ backgroundColor: '#059669', color: 'white', padding: '18px 28px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 25px rgba(5, 150, 105, 0.25)', transition: 'all 0.3s' }}>
            <FileSpreadsheet size={20} /> Crear Informe de Balance
          </button>
          <button onClick={() => onSwitchTab('table')} style={{ backgroundColor: '#2563eb', color: 'white', padding: '18px 28px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 25px rgba(37, 99, 235, 0.25)' }}>
            <FileText size={20} /> Matriz Completa
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '40px' }}>
        <StatCard title="Total Vault" value={metrics.total} color="#2563eb" icon={<FileText size={20}/>} />
        <StatCard title="Anexo IV Activos" value={metrics.anexoIV} color="#059669" highlight icon={<ShieldCheck size={20}/>} />
        <StatCard title="Prioridad A" value={metrics.pendientes} color="#ef4444" icon={<Activity size={20}/>} />
        <StatCard title="Validados" value={metrics.favorables} color="#10b981" icon={<ShieldCheck size={20}/>} />
      </div>

      <div style={{ backgroundColor: '#fff', padding: '45px', borderRadius: '45px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={20}/> Balance Administrativo Operativo
        </h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '10px', color: '#8e8e93', borderBottom: '2px solid #f8f8fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <th style={{ padding: '20px 0' }}>Ámbito de Aplicación</th>
              <th style={{ textAlign: 'center' }}>Obligados 393/2007</th>
              <th style={{ textAlign: 'center' }}>No Obligados</th>
              <th style={{ textAlign: 'right' }}>Total Carga</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f8f8fa' }}>
              <td style={{ padding: '30px 0', fontWeight: '900', fontSize: '14px', color: '#1c1c1e' }}>Sector Forestal (PLEIF)</td>
              <td style={{ textAlign: 'center', color: '#2563eb', fontWeight: '900', fontSize: '16px' }}>1</td>
              <td style={{ textAlign: 'center', color: '#c7c7cc', fontWeight: 'bold' }}>1075</td>
              <td style={{ textAlign: 'right', fontWeight: '900', fontSize: '16px' }}>{metrics.forestal}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f8f8fa' }}>
              <td style={{ padding: '30px 0', fontWeight: '900', fontSize: '14px', color: '#1c1c1e' }}>Instalaciones Municipales</td>
              <td style={{ textAlign: 'center', color: '#2563eb', fontWeight: '900', fontSize: '16px' }}>1</td>
              <td style={{ textAlign: 'center', color: '#c7c7cc', fontWeight: 'bold' }}>1075</td>
              <td style={{ textAlign: 'right', fontWeight: '900', fontSize: '16px' }}>{metrics.municipal}</td>
            </tr>
            <tr>
              <td style={{ padding: '40px 0 0 0', fontWeight: '900', fontSize: '20px', color: '#1c1c1e', textTransform: 'uppercase', fontStyle: 'italic' }}>Resumen Vault</td>
              <td style={{ padding: '40px 0 0 0', textAlign: 'center', color: '#2563eb', fontWeight: '900', fontSize: '24px' }}>2</td>
              <td style={{ padding: '40px 0 0 0', textAlign: 'center', color: '#c7c7cc', fontWeight: '900', fontSize: '24px' }}>2150</td>
              <td style={{ padding: '40px 0 0 0', textAlign: 'right', fontWeight: '900', fontSize: '24px', color: '#1c1c1e' }}>{metrics.total}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px dashed #e5e7eb', textAlign: 'center' }}>
          <p style={{ color: '#c7c7cc', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            www.axiomdata.eu • Protocolo M4 Verified
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, highlight, icon }) => (
  <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '35px', border: '1px solid rgba(0,0,0,0.04)', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', transition: 'transform 0.3s ease' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{ padding: '12px', borderRadius: '15px', backgroundColor: '#f8f9fa', color: color }}>{icon}</div>
      {highlight && <div style={{ backgroundColor: '#10b981', color: '#fff', padding: '5px 12px', borderRadius: '10px', fontSize: '8px', fontWeight: '900', letterSpacing: '0.1em' }}>● PROTEGIDO</div>}
    </div>
    <p style={{ color: '#8e8e93', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '5px' }}>{title}</p>
    <p style={{ fontSize: '48px', fontWeight: '900', margin: 0, color: '#1c1c1e', letterSpacing: '-0.03em' }}>{value.toLocaleString()}</p>
  </div>
);

export default DashboardView;