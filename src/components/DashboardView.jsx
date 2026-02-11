// src/components/DashboardView.jsx
import React, { useMemo } from 'react';
import { ShieldCheck, FileText, Activity, BarChart3, FileSpreadsheet } from 'lucide-react';

const DashboardView = ({ data = [], onSwitchTab, onGenerateReport }) => {
  const metrics = useMemo(() => ({
    total: data.length,
    anexoIV: data.filter(e => e.anexo_iv === 'SI').length,
    pendientes: data.filter(e => e.estado_actual === 'A').length,
    favorables: data.filter(e => e.estado_actual === 'F').length
  }), [data]);

  return (
    <div className="p-10 h-full overflow-y-auto bg-[#F5F5F7] dark:bg-black">
      <header className="mb-12 flex justify-between items-end">
        <div>
          {/* LOGO ELIMINADO DE AQUÍ SEGÚN HOJA DE RUTA */}
          <h1 className="text-4xl font-black tracking-tighter not-italic text-black dark:text-white uppercase">
            AXIOM <span className="text-blue-600">VAULT</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1 italic">
            GESTIÓN DE PLANES DE AUTOPROTECCIÓN • FEBRERO 2026
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onGenerateReport}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <FileSpreadsheet size={18} /> Crear Informe de Balance
          </button>
          <button 
            onClick={() => onSwitchTab('table')} 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-blue-700 transition-all active:scale-95"
          >
            <FileText size={18} /> Matriz Completa
          </button>
        </div>
      </header>

      {/* Grid de Métricas Bento Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <StatCard title="Total Vault" value={metrics.total} icon={<FileText className="text-blue-500"/>} />
        <StatCard title="Anexo IV Activos" value={metrics.anexoIV} icon={<ShieldCheck className="text-white"/>} specialColor="bg-green-500" highlight />
        <StatCard title="Prioridad A" value={metrics.pendientes} icon={<Activity className="text-red-500"/>} />
        <StatCard title="Validados" value={metrics.favorables} icon={<ShieldCheck className="text-emerald-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-[#1C1C1E] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-center mb-10">
             <h3 className="text-lg font-black text-blue-600 uppercase tracking-widest flex items-center gap-3"><BarChart3 size={22}/> BALANCE ADMINISTRATIVO (LÍNEA ROJA)</h3>
             <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Sincronizado M4</span>
           </div>
           
           <table className="w-full text-left font-bold">
              <thead className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
                <tr><th className="pb-6">Ámbito de Aplicación</th><th className="pb-6 text-center">Obligados R.D. 393/2007</th><th className="pb-6 text-center">No Obligados</th><th className="pb-6 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                <tr className="text-sm"><td className="py-8 text-gray-800 dark:text-gray-200">Sector Forestal (PLEIF)</td><td className="py-8 text-center text-blue-600 font-black">1</td><td className="py-8 text-center text-gray-300">1075</td><td className="py-8 text-right font-black text-black dark:text-white">{data.filter(e => e.tipo === 'Forestal').length}</td></tr>
                <tr className="text-sm"><td className="py-8 text-gray-800 dark:text-gray-200">Instalaciones Municipales</td><td className="py-8 text-center text-blue-600 font-black">1</td><td className="py-8 text-center text-gray-300">1075</td><td className="py-8 text-right font-black text-black dark:text-white">{data.filter(e => e.tipo === 'Municipal').length}</td></tr>
                <tr className="text-2xl font-black"><td className="pt-10 uppercase italic">RESUMEN VAULT</td><td className="pt-10 text-center text-blue-600">2</td><td className="pt-10 text-center text-gray-300">2150</td><td className="pt-10 text-right text-black dark:text-white">{metrics.total}</td></tr>
              </tbody>
           </table>
           <div className="mt-10 pt-6 border-t border-dashed border-gray-200 dark:border-white/10 text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">www.axiomdata.eu • Axiom Core • M4 Verified</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, highlight, specialColor }) => (
  <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 ${specialColor || 'bg-gray-50 dark:bg-white/5'} rounded-2xl shadow-inner`}>{icon}</div>
      {highlight && <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter animate-pulse">● Protegido</div>}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-4xl font-black tracking-tighter text-black dark:text-white">{value.toLocaleString()}</p>
  </div>
);

export default DashboardView;