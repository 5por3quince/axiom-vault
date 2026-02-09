import React, { useMemo } from 'react';
import { ShieldCheck, FileText, AlertCircle, CheckCircle2, BarChart3, Activity } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardView = ({ data = [], onSwitchTab }) => {
  const metrics = useMemo(() => ({
    total: data.length,
    anexoIV: data.filter(e => e.anexo_iv).length,
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
      borderWidth: 0, cutout: '82%',
    }]
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AXIOM <span className="text-blue-600">VAULT</span></h1>
          <p className="text-gray-500 font-medium">Estación de Mando de Custodia • febrero de 2026</p>
        </div>
        <button onClick={() => onSwitchTab('table')} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all"><FileText size={18} /> Matriz Completa</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Vault" value={metrics.total} icon={<FileText className="text-blue-500"/>} />
        <StatCard title="Anexo IV Activos" value={metrics.anexoIV} icon={<ShieldCheck className="text-green-500"/>} highlight />
        <StatCard title="Prioridad A" value={metrics.pendientes} icon={<AlertCircle className="text-red-500"/>} />
        <StatCard title="Validados" value={metrics.favorables} icon={<CheckCircle2 className="text-emerald-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold mb-8">Eficacia del Sistema</h3>
          <div className="flex flex-col xl:flex-row items-center gap-10">
            <div className="relative w-44 h-44">
              <Doughnut data={chartData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black">{Math.round((metrics.favorables / metrics.total) * 100)}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
               <LegendRow color="bg-green-500" label="Favorables" value={metrics.favorables} />
               <LegendRow color="bg-red-500" label="Pendientes" value={metrics.pendientes} />
               <LegendRow color="bg-blue-600" label="Anexo IV" value={metrics.anexoIV} />
               <LegendRow color="bg-gray-300" label="Otros" value={metrics.total - (metrics.favorables + metrics.pendientes)} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-bold mb-8 text-blue-600 uppercase tracking-widest flex items-center gap-2"><BarChart3 size={20}/> Balance Administrativo (Línea Roja)</h3>
          <table className="w-full text-left font-bold divide-y divide-gray-100">
            <thead className="text-[10px] font-black text-gray-400 uppercase">
              <tr><th className="pb-4">Ámbito de Aplicación</th><th className="pb-4">Obligados R.D. 393/2007</th><th className="pb-4">No Obligados</th><th className="pb-4 text-right">Total</th></tr>
            </thead>
            <tbody className="text-sm">
              <tr><td className="py-6">Sector Forestal (PLEIF)</td><td className="py-6 text-blue-600">1</td><td className="py-6 text-gray-300 font-medium">1075</td><td className="py-6 text-right font-black tabular-nums">{metrics.forestal}</td></tr>
              <tr><td className="py-6">Instalaciones Municipales</td><td className="py-6 text-blue-600">1</td><td className="py-6 text-gray-300 font-medium">1075</td><td className="py-6 text-right font-black tabular-nums">{metrics.municipal}</td></tr>
              <tr className="text-xl font-black"><td className="pt-8">RESUMEN VAULT</td><td className="pt-8 text-blue-600">2</td><td className="pt-8 text-gray-300">2150</td><td className="pt-8 text-right tabular-nums">{metrics.total}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, highlight }) => (
  <div className="glass p-6 rounded-[2rem] border border-white/50 shadow-sm bento-card">
    <div className="flex justify-between mb-4"><div className="p-3 bg-white dark:bg-white/5 rounded-2xl shadow-sm">{icon}</div>{highlight && <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />}</div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
    <p className="text-4xl font-black tabular-nums tracking-tighter dark:text-white">{value.toLocaleString()}</p>
  </div>
);

const LegendRow = ({ color, label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[11px] font-black text-gray-500 uppercase tracking-tighter">{label}</span>
    </div>
    <span className="text-sm font-black tabular-nums">{value}</span>
  </div>
);

export default DashboardView;