// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import VisorTactico from './components/VisorTactico';
import DetailSidebar from './components/DetailSidebar';

// Importación de datos (Basado en tu árbol de directorios de VSCode)
import initialData from './data/pau_data.json'; 

const App = () => {
  // --- ESTADOS DE NÚCLEO ---
  const [user, setUser] = useState(null); // Gestión de sesión (MOCK_USERS)
  const [data, setData] = useState([]); // Los 2,152 expedientes
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | table | map
  const [selectedExp, setSelectedExp] = useState(null); // Expediente activo en visor/detalle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- CARGA DE DATOS E INTEGRIDAD (M4 OPTIMIZED) ---
  useEffect(() => {
    // Simulamos la carga masiva de los 2,152 expedientes
    if (initialData) {
      setData(initialData);
    }
  }, []);

  // --- LÓGICA DE NAVEGACIÓN ---
  const handleSelectExpediente = (exp) => {
    setSelectedExp(exp);
    setIsSidebarOpen(true);
  };

  const handleOpenInMap = (exp) => {
    setSelectedExp(exp);
    setActiveTab('map');
    setIsSidebarOpen(false);
  };

  // --- RENDERIZADO CONDICIONAL (AUTENTICACIÓN) ---
  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <div className="h-screen w-screen bg-[#F5F5F7] dark:bg-black text-black dark:text-white flex overflow-hidden font-sans">
      
      {/* BARRA LATERAL DE NAVEGACIÓN (Estilo Apple) */}
      <nav className="w-20 lg:w-24 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-10 gap-8 z-30">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <span className="text-white font-black text-xl italic">A</span>
        </div>
        
        <NavIcon 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon="􀉪" // Símbolo SF para Dashboard
          label="Mando"
        />
        <NavIcon 
          active={activeTab === 'table'} 
          onClick={() => setActiveTab('table')} 
          icon="􀇀" // Símbolo SF para Table
          label="Matriz"
        />
        <NavIcon 
          active={activeTab === 'map'} 
          onClick={() => setActiveTab('map')} 
          icon="􀙊" // Símbolo SF para Map
          label="Táctico"
        />

        <div className="mt-auto flex flex-col items-center gap-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden">
             <span className="text-[10px] font-black">{user.username?.substring(0,2).toUpperCase()}</span>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="text-gray-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-tighter"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full"
            >
              <DashboardView data={data} onSwitchTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'table' && (
            <motion.div 
              key="table"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full"
            >
              <TableView 
                data={data} 
                onSelect={handleSelectExpediente} 
                onViewMap={handleOpenInMap}
              />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <VisorTactico selectedExp={selectedExp} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIDEBAR DE DETALLES (Bento Style) */}
        <DetailSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          expediente={selectedExp}
          onViewMap={() => setActiveTab('map')}
        />
      </main>

      {/* INDICADOR DE HARDWARE M4 */}
      <div className="fixed bottom-6 right-8 pointer-events-none z-50">
        <div className="glass px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em]">
            Axiom Core • M4 Verified
          </span>
        </div>
      </div>
    </div>
  );
};

// Sub-componente de navegación estilo Apple
const NavIcon = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 group transition-all ${active ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${
      active ? 'bg-blue-600/10 text-blue-600 shadow-inner' : 'text-gray-500'
    }`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

export default App;