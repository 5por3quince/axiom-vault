// src/App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import VisorTactico from './components/VisorTactico';
import DetailSidebar from './components/DetailSidebar';
import NewExpForm from './components/NewExpForm';
import { getFullInventory } from './data/mockData';
import { Plus, LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setInventory(getFullInventory());
    }
  }, [user]);

  if (!user) return <Login onLogin={setUser} />;

  // FUNCIÓN CRÍTICA: Actualizar un expediente existente
  const handleUpdateExpediente = (updatedExp) => {
    setInventory(prev => prev.map(exp => 
      exp.n_expediente_cd === updatedExp.n_expediente_cd ? updatedExp : exp
    ));
    setSelectedExp(updatedExp); // Actualiza la vista detalle
  };

  // FUNCIÓN CRÍTICA: Importar datos masivos desde XLS
  const handleImportData = (newData) => {
    setInventory(newData);
    setActiveTab('table');
  };

  const handleSaveNew = (newExp) => {
    setInventory([newExp, ...inventory]);
    setIsFormOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-white font-sans overflow-hidden">
      
      <nav className="w-20 flex flex-col items-center py-8 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-500/20">
          <span className="text-white font-black text-xs uppercase">Ax</span>
        </div>
        
        <div className="flex flex-col gap-8 flex-1">
          <NavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" />
          <NavBtn active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon="📂" />
          <NavBtn active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon="📍" />
          
          {user.role === 'ADMIN' && (
            <button onClick={() => setIsFormOpen(true)} className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 hover:scale-110 transition-all">
              <Plus />
            </button>
          )}
        </div>

        <button onClick={() => setUser(null)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'dashboard' && <DashboardView data={inventory} onSwitchTab={setActiveTab} />}
        {activeTab === 'table' && (
          <TableView 
            data={inventory} 
            onSelectExp={(e) => { setSelectedExp(e); setIsSidebarOpen(true); }} 
            onImportData={handleImportData}
          />
        )}
        {activeTab === 'map' && <VisorTactico selectedExp={selectedExp} />}
      </main>

      {isSidebarOpen && (
        <DetailSidebar 
          expediente={selectedExp} 
          onUpdate={handleUpdateExpediente} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}

      <NewExpForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSaveNew} />
    </div>
  );
}

const NavBtn = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
    <span className="text-xl">{icon}</span>
  </button>
);

export default App;