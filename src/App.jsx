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

  // Motor de Importación con Mapeo Inteligente
  const handleImportExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws);

      const formatted = raw.map((row, i) => {
        // Buscador de columnas por coincidencia de nombre (ignora mayúsculas/acentos)
        const getVal = (keys) => {
          const foundKey = Object.keys(row).find(k => keys.some(key => k.toLowerCase().includes(key.toLowerCase())));
          return foundKey ? row[foundKey] : null;
        };

        return {
          id: i + 1,
          expediente: getVal(['Expediente', 'Nº', 'COD']) || `PAU-2026-${i+1}`,
          establecimiento: getVal(['Establecimiento', 'Titular', 'Nombre', 'Sujeto']) || 'SIN IDENTIFICAR',
          referencia_catastral: getVal(['Catastral', 'Referencia', 'Ref']) || 'PENDIENTE',
          anexo_iv: (getVal(['Anexo IV', 'ANEXO_IV'])?.toString().toUpperCase() === 'SI') ? 'SI' : 'NO',
          estado_actual: getVal(['Estado'])?.toString().toUpperCase().startsWith('F') ? 'F' : 'A',
          tipo: getVal(['Uso', 'Tipo', 'Ámbito']) || 'General',
          latitud: parseFloat(getVal(['Latitud', 'LAT'])) || 36.7213,
          longitud: parseFloat(getVal(['Longitud', 'LON', 'LNG'])) || -4.4214,
          fecha_caducidad: getVal(['Caducidad', 'Vence']) || 'N/A'
        };
      });

      setData(formatted);
      setActiveTab('table');
    };
    reader.readAsBinaryString(file);
  };

  // Generador de Informe de Balance PDF
  const generateMonthlyReport = () => {
    const doc = jsPDF();
    const now = new Date();
    const month = now.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    
    doc.setFontSize(22);
    doc.text(`INFORME DE BALANCE - ${month} 2026`, 14, 20);
    doc.setFontSize(10);
    doc.text("AXIOM VAULT - GESTIÓN DE PLANES DE AUTOPROTECCIÓN", 14, 28);

    const favorables = data.filter(e => e.estado_actual === 'F').length;
    const pendientes = data.filter(e => e.estado_actual === 'A').length;

    doc.autoTable({
      startY: 40,
      head: [['Métrica', 'Cantidad', 'Porcentaje']],
      body: [
        ['Total Expedientes Gestionados', data.length, '100%'],
        ['Planes Favorables', favorables, `${((favorables/data.length)*100).toFixed(1)}%`],
        ['Planes Pendientes (Prioridad A)', pendientes, `${((pendientes/data.length)*100).toFixed(1)}%`],
        ['Sujetos a Anexo IV', data.filter(e => e.anexo_iv === 'SI').length, '-']
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`Axiom_Balance_${month}_2026.pdf`);
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="h-screen w-screen bg-[#F5F5F7] dark:bg-black text-black dark:text-white flex overflow-hidden font-sans">
      <nav className="w-20 lg:w-24 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-10 gap-10 z-30">
        <img src={logoAxiom} alt="Logo" className="w-14 h-14 object-contain mb-4" />
        <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} label="Mando" />
        <NavIcon active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={<List size={24} />} label="Matriz" />
        <NavIcon active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<Map size={24} />} label="Táctico" />
        <button onClick={() => setUser(null)} className="mt-auto opacity-40 hover:opacity-100 hover:text-red-500 transition-all"><LogOut size={22} /></button>
      </nav>

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <motion.div key="db" className="h-full"><DashboardView data={data} onSwitchTab={setActiveTab} /></motion.div>}
          {activeTab === 'table' && (
            <motion.div key="tb" className="h-full">
              <TableView 
                data={data} 
                onImportExcel={handleImportExcel} 
                onGenerateReport={generateMonthlyReport}
                onSelect={(exp) => { setSelectedExp(exp); setIsSidebarOpen(true); }} 
                onViewMap={(exp) => { setSelectedExp(exp); setActiveTab('map'); }} 
              />
            </motion.div>
          )}
          {activeTab === 'map' && <motion.div key="mp" className="h-full"><VisorTactico selectedExp={selectedExp} /></motion.div>}
        </AnimatePresence>
        <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} expediente={selectedExp} />
      </main>
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'scale-110' : 'opacity-30 hover:opacity-100'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{label}</span>
  </button>
);
export default App;