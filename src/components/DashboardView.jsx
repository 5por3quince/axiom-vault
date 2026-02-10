import React, { useMemo } from 'react';
import { ShieldCheck, FileText, AlertCircle, CheckCircle2, BarChart3, Activity, Shield } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardView = ({ data = [], onSwitchTab }) => {
  const metrics = useMemo(() => ({
    total: data.length,
    // Lógica Prioritaria: Filtrado estricto por marcador "SI"
    anexoIV: data.filter(e => e.anexo_iv === 'SI' || e.anexo_iv === true).length,
    pendientes: data.filter(e => e.estado_actual === 'A').length,
    favorables: data.filter(e => e.estado_actual === 'F' || e.estado_actual === 'FSV').length,
    forestal: data.filter(e => e.tipo === 'Forestal').length,
    municipal: data.filter(e => e.tipo === 'Municipal').length
  }), [data]);

  const chartData = {
    labels: ['Favorables', 'Pendientes', 'Anexo IV', 'Otros'],
    datasets: [{
      data: [metrics.favorables, metrics.pendientes, metrics.anexoIV, metrics.total - (metrics.favorables + metrics.pendientes)],
      backgroundColor: ['#34C759', '#FF3B30', '#007AFF', '#E5E5EA'],
      hoverOffset: 4,
      borderWidth: 0, 
      cutout: '82%',
    }]
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#F5F5F7] dark:bg-[#000000] font-sans selection:bg-blue-100">
      <header className="mb-10 flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold tracking-tighter text-black dark:text-white">
            AXIOM <span className="text-blue-600">VAULT</span>
          </h1>
          <p className="text-gray-500 font-semibold mt-2 flex items-center gap-2 text-lg">
            <Activity size={18} className="text-blue-500" /> 
            Estación de Mando de Custodia • febrero de 2026
          </p>
        </motion.div>
        
        <button 
          onClick={() => onSwitchTab('table')} 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3"
        >
          <FileText size={20} /> Matriz Completa
        </button>
      </header>

      {/* Grid Principal - Estética Bento Box Apple */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Vault" value={metrics.total} icon={<FileText className="text-blue-500"/>} />
        
        {/* Hito Crítico: Anexo IV con Escudo Animado */}
        <StatCard 
          title="Anexo IV Activos" 
          value={metrics.anexoIV} 
          icon={<ShieldCheck className="text-white"/>} 
          highlight 
          specialColor="bg-green-500"
        />
        
        <StatCard title="Prioridad A" value={metrics.pendientes} icon={<AlertCircle className="text-red-500"/>} />
        <StatCard title="Validados" value={metrics.favorables} icon={<CheckCircle2 className="text-emerald-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eficacia del Sistema */}
        <div className="bg-white dark:bg-[#1C1C1E] p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 text-black dark:text-white">Eficacia del Sistema</h3>
          <div className="flex flex-col items-center justify-center flex-1 gap-12">
            <div className="relative w-52 h-52">
              <Doughnut 
                data={chartData} 
                options={{ 
                  plugins: { legend: { display: false } }, 
                  maintainAspectRatio: false,
                  animation: { duration: 2000, easing: 'easeOutQuart' }
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-black dark:text-white">
                  {metrics.total > 0 ? Math.round((metrics.favorables / metrics.total) * 100) : 0}%
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global</span>
              </div>
            </div>
            <div className="w-full space-y-3">
               <LegendRow color="bg-[#34C759]" label="Favorables" value={metrics.favorables} />
               <LegendRow color="bg-[#FF3B30]" label="Pendientes" value={metrics.pendientes} />
               <LegendRow color="bg-[#007AFF]" label="Anexo IV" value={metrics.anexoIV} />
               <LegendRow color="bg-[#E5E5EA]" label="Otros" value={metrics.total - (metrics.favorables + metrics.pendientes)} />
            </div>
          </div>
        </div>

        {/* Balance Administrativo - Línea Roja */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <BarChart3 size={22}/> Balance Administrativo (Línea Roja)
            </h3>
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">Actualizado Nov 2025</span>
          </div>
          <table className="w-full text-left font-semibold">
            <thead className="text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 dark:border-white/5">
              <tr>
                <th className="pb-6">Ámbito de Aplicación</th>
                <th className="pb-6 text-center">Obligados R.D. 393/2007</th>
                <th className="pb-6 text-center">No Obligados</th>
                <th className="pb-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-[15px] divide-y divide-gray-50 dark:divide-white/5 text-black dark:text-white">
              <TableRow label="Sector Forestal (PLEIF)" obligado={1} noObligado={1075} total={metrics.forestal} />
              <TableRow label="Instalaciones Municipales" obligado={1} noObligado={1075} total={metrics.municipal} />
              <tr className="text-2xl font-black">
                <td className="pt-10">RESUMEN VAULT</td>
                <td className="pt-10 text-center text-blue-600">2</td>
                <td className="pt-10 text-center text-gray-300">2150</td>
                <td className="pt-10 text-right tabular-nums text-black dark:text-white">{metrics.total}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-[11px] text-gray-400 font-bold uppercase text-center">Protocolo de Integridad de Datos Activo • Chip M4 Validated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, highlight, specialColor }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white dark:bg-[#1C1C1E] p-7 rounded-[2.2rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 ${specialColor || 'bg-[#F5F5F7] dark:bg-white/5'} rounded-2xl shadow-inner relative z-10`}>
        {icon}
      </div>
      {highlight && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"
        />
      )}
      {highlight && (
        <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
          <Shield size={10} fill="white" /> Protegido
        </div>
      )}
    </div>
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-4xl font-black tabular-nums tracking-tighter text-black dark:text-white">{value.toLocaleString()}</p>
  </motion.div>
);

const TableRow = ({ label, obligado, noObligado, total }) => (
  <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
    <td className="py-7 font-bold text-gray-800 dark:text-gray-200">{label}</td>
    <td className="py-7 text-center text-blue-600 font-black">{obligado}</td>
    <td className="py-7 text-center text-gray-400 font-medium">{noObligado}</td>
    <td className="py-7 text-right font-black tabular-nums text-lg">{total}</td>
  </tr>
);

const LegendRow = ({ color, label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-3">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-[12px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
    <span className="text-sm font-black tabular-nums text-black dark:text-white">{value}</span>
  </div>
);

export default DashboardView;