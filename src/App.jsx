// src/App.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, List, Map, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import VisorTactico from './components/VisorTactico';
import DetailSidebar from './components/DetailSidebar';
import logoAxiom from './assets/LogoAxiomVault.png';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExp, setSelectedExp] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Motor de Importación XLS con Mapeo dinámico
  const handleImportExcel = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws);

      const formatted = raw.map((row, i) => {
        // Buscamos columnas por nombre flexible
        const find = (keys) => {
          const k = Object.keys(row).find(key => keys.some(s => key.toLowerCase().includes(s.toLowerCase())));
          return k ? row[k] : null;
        };

        return {
          id: i + 1,
          establecimiento: find(['Establecimiento', 'Titular', 'Sujeto', 'Nombre']) || 'ESTABLECIMIENTO DESCONOCIDO',
          referencia_catastral: find(['Catastral', 'Referencia', 'Ref']) || 'PENDIENTE',
          anexo_iv: find(['Anexo IV', 'ANEXO_IV'])?.toString().toUpperCase() === 'SI' ? 'SI' : 'NO',
          estado_actual: find(['Estado'])?.toString().toUpperCase().startsWith('F') ? 'F' : 'A',
          tipo: find(['Uso', 'Tipo', 'Ámbito']) || 'General',
          latitud: parseFloat(find(['Latitud', 'LAT'])) || 36.7213,
          longitud: parseFloat(find(['Longitud', 'LON', 'LNG'])) || -4.4214
        };
      });

      setData(formatted);
      setActiveTab('table');
    };
    reader.readAsBinaryString(file);
  };

  const generateReport = () => {
    if (data.length === 0) return alert("Cargue datos antes de generar el informe");
    const doc = new jsPDF();
    const month = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    doc.setFontSize(20);
    doc.text(`INFORME DE CUSTODIA PAU - ${month} 2026`, 15, 20);
    doc.autoTable({
      startY: 30,
      head: [['Establecimiento', 'Referencia', 'Estado', 'Anexo IV']],
      body: data.map(e => [e.establecimiento, e.referencia_catastral, e.estado_actual, e.anexo_iv]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    doc.save(`Axiom_Balance_${month}.pdf`);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="h-screen w-screen bg-[#F5F5F7] dark:bg-black text-black dark:text-white flex overflow-hidden font-sans selection:bg-blue-100">
      <nav className="w-24 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-10 gap-12 z-30 shadow-2xl">
        <img src={logoAxiom} alt="Axiom" className="w-14 h-14 object-contain shadow-sm mb-4" />
        
        <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={26} />} label="Mando" />
        <NavIcon active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={<List size={26} />} label="Matriz" />
        <NavIcon active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<Map size={26} />} label="Táctico" />

        <button onClick={() => setUser(null)} className="mt-auto p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all text-gray-400">
          <LogOut size={24} />
        </button>
      </nav>

      <main className="flex-1 relative overflow-hidden bg-gray-50/50 dark:bg-black">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <DashboardView data={data} onSwitchTab={setActiveTab} onGenerateReport={generateReport} />
            </motion.div>
          )}
          {activeTab === 'table' && (
            <motion.div key="tb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <TableView 
                data={data} 
                onImportExcel={handleImportExcel} 
                onSelect={(exp) => { setSelectedExp(exp); setIsSidebarOpen(true); }} 
                onViewMap={(exp) => { setSelectedExp(exp); setActiveTab('map'); }} 
              />
            </motion.div>
          )}
          {activeTab === 'map' && (
            <motion.div key="mp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <VisorTactico selectedExp={selectedExp} />
            </motion.div>
          )}
        </AnimatePresence>
        <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} expediente={selectedExp} />
      </main>
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all ${active ? 'scale-110' : 'opacity-30 hover:opacity-100 hover:scale-105'}`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-transparent text-gray-500'}`}>{icon}</div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
  </button>
);

export default App;