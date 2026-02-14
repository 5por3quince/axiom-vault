// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, List, Map as AxiomMapIcon, LogOut, 
  Loader2, Plus, Sun, Moon, Save, FileSpreadsheet 
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importación de Componentes
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import VisorTactico from './components/VisorTactico';
import DetailSidebar from './components/DetailSidebar';
import NewExpedienteModal from './components/NewExpedienteModal';
import logoAxiom from './assets/LogoAxiomVault.png';

const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExp, setSelectedExp] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [theme, setTheme] = useState(localStorage.getItem('axiom_theme') || 'light');
  const [serverPath, setServerPath] = useState(localStorage.getItem('axiom_server_path') || '');
  const tableScrollRef = useRef(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const initData = async () => {
      if (serverPath) {
        try {
          const content = await invoke('load_database', { base_path: serverPath });
          setData(JSON.parse(content));
        } catch (e) {
          const savedLocal = localStorage.getItem('axiom_vault_db');
          if (savedLocal) setData(JSON.parse(savedLocal));
        }
      } else {
        const savedLocal = localStorage.getItem('axiom_vault_db');
        if (savedLocal) setData(JSON.parse(savedLocal));
      }
    };
    initData();
  }, [serverPath]);

  useEffect(() => {
    if (data.length > 0) localStorage.setItem('axiom_vault_db', JSON.stringify(data));
    localStorage.setItem('axiom_server_path', serverPath);
    localStorage.setItem('axiom_theme', theme);
  }, [data, serverPath, theme]);

  // --- GESTIÓN DE ARCHIVOS RUST ---
  const syncServer = async (targetData) => {
    const d = targetData || data;
    if (serverPath && d.length > 0) {
      try {
        await invoke('save_database', { base_path: serverPath, data_json: JSON.stringify(d) });
      } catch (e) { console.error("Error Sincronización Servidor"); }
    }
  };

  const handleCreateFolders = async (expediente) => {
    if (!serverPath) return;
    try {
      await invoke('create_expediente_folders', { 
        base_path: serverPath, 
        numero_expediente: expediente.expediente_num,
        nombre_expediente: expediente.establecimiento 
      });
    } catch (err) { console.error(err); }
  };

  const handleOpenFolder = async (expediente) => {
    if (!serverPath) return alert("Configure la ruta raíz.");
    const folderName = `${expediente.expediente_num} - ${expediente.establecimiento.replace(/[/\\?%*:|"<>]/g, "-")}`;
    const folderPath = `${serverPath}/${folderName}`;
    try {
      await invoke('open_vault_folder', { folder_path: folderPath });
    } catch (err) { alert("Ruta inaccesible."); }
  };

  // --- MOTOR DE IMPORTACIÓN ---
  const handleImportExcel = (file) => {
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        const formatted = rawRows.map((row, i) => {
          const f = (ks) => {
            const k = Object.keys(row).find(key => ks.some(s => key.toLowerCase().trim().includes(s.toLowerCase())));
            return k ? row[k] : "-";
          };
          return {
            id: Date.now() + i,
            tipo: f(['TIPO']),
            obligado: f(['OBLIGADO']),
            rd393: f(['R.D. 393/2007']),
            apendice3: f(['APÉNDICE 3']),
            sectorial: f(['SECTORIAL']),
            estado_actual: String(f(['ESTADO ACTUAL']) || 'A').toUpperCase().trim(),
            fecha_mov: f(['FECHA ÚLTIMO MOVIMIENTO']),
            entrada_pau: f(['ENTRADA PAU']),
            papel: f(['PAPEL']),
            cd: f(['CD']),
            servidor: f(['SERVIDOR']),
            fecha_pau: f(['FECHA PAU']),
            caducidad: f(['CADUCIDAD']),
            fin_anterior: f(['FECHA FIN ANTERIOR']),
            tecnico: f(['TÉCNICO']),
            expediente_num: f(['Nº EXPEDIENTE']),
            anexo_iv: f(['ANEXO IV']) === 'SI' ? 'SI' : 'NO',
            certificado: f(['CERTIFICADO IMPLANTACIÓN']),
            establecimiento: f(['NOMBRE ESTABLECIMIENTO']),
            titular: f(['TITULAR']),
            uso: f(['USO (CTB DB SI)']),
            documentacion: f(['DOCUMENTACIÓN RECIBIDA']),
            simulacro: f(['FECHA SIMULACRO']),
            ubicacion_fisica: f(['UBICACIÓN FÍSICA']),
            observaciones: f(['OBSERVACIONES']),
            finca: f(['Nº FINCA']),
            solicitada_rev: f(['SOLICITADA ÚLTIMA REVISIÓN']),
            solicitudes_ant: f(['SOLICITUDES ANTERIORES']),
            referencia_catastral: f(['REFERENCIA CATASTRAL']),
            latitud: parseFloat(f(['Latitud'])) || 36.7213,
            longitud: parseFloat(f(['Longitud'])) || -4.4214,
            notas: ""
          };
        });
        setData(formatted);
        syncServer(formatted);
        setTimeout(() => { setIsImporting(false); setActiveTab('table'); }, 800);
      } catch (err) { setIsImporting(false); alert("Error en Excel."); }
    };
    reader.readAsArrayBuffer(file);
  };

  // --- CRUD ---
  const updateExpediente = (updatedExp) => {
    setData(prev => {
      const newData = prev.map(e => e.id === updatedExp.id ? updatedExp : e);
      syncServer(newData);
      return newData;
    });
    setSelectedExp(updatedExp);
  };

  const handleAddNewExpediente = (newExp) => {
    const fullExp = { ...newExp, id: Date.now(), notas: "" };
    const newData = [fullExp, ...data];
    setData(newData);
    syncServer(newData);
    handleCreateFolders(fullExp);
    setIsModalOpen(false);
  };

  const handleSort = (field, direction) => {
    const sorted = [...data].sort((a, b) => {
      const valA = (a[field] || "").toString().toLowerCase();
      const valB = (b[field] || "").toString().toLowerCase();
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    setData(sorted);
  };

  // --- GENERADOR DE INFORME OFICIAL ---
  const generateReport = () => {
    if (data.length === 0) return alert("Base vacía.");
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const month = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();
      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("BALANCE MENSUAL PLANES DE AUTOPROTECCIÓN", 105, 10, { align: 'center' });
      
      autoTable(doc, {
        startY: 15, head: [['PERIODO', 'NO MUNIC.', 'MUNICIPALES', 'FORESTALES', 'TOTAL']],
        body: [[month + ' 2026', data.filter(e => !e.tipo.includes('Municipal') && !e.tipo.includes('Forestal')).length, data.filter(e => e.tipo.includes('Municipal')).length, data.filter(e => e.tipo.includes('Forestal')).length, data.length]],
        theme: 'grid', headStyles: { fillColor: [230, 230, 230], textColor: 0 }
      });

      const porIn = (isObl) => data.filter(e => ['A','REV'].includes(e.estado_actual) && (isObl ? e.rd393==='SI' : e.rd393==='NO')).length;
      const enPr = (isObl) => data.filter(e => ['B1','B2'].includes(e.estado_actual) && (isObl ? e.rd393==='SI' : e.rd393==='NO')).length;
      const fin = (isObl) => data.filter(e => ['F','FSV','N/P','N/T','CERRADO'].includes(e.estado_actual) && (isObl ? e.rd393==='SI' : e.rd393==='NO')).length;

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10, head: [['ESTADOS GENERALES', 'OBLIGADOS', 'NO OBLIGADOS', 'TOTALES']],
        body: [['POR INICIAR', porIn(true), porIn(false), porIn(true)+porIn(false)], ['EN PROCESO', enPr(true), enPr(false), enPr(true)+enPr(false)], ['FINALIZADOS', fin(true), fin(false), fin(true)+fin(false)], ['TOTAL', data.filter(e=>e.rd393==='SI').length, data.filter(e=>e.rd393==='NO').length, data.length]],
        theme: 'grid', headStyles: { fillColor: [37, 99, 235] }
      });

      doc.addPage();
      doc.text("GRÁFICAS DE BALANCE", 105, 15, { align: 'center' });
      doc.save(`Axiom_Balance_${month}.pdf`);
    } catch (e) { alert("Error PDF"); }
  };

  if (!user) return <Login onLogin={setUser} />;
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: isDark ? '#000' : '#F5F5F7', color: isDark ? '#fff' : '#000', overflow: 'hidden', transition: 'all 0.4s' }}>
      <AnimatePresence>{isImporting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin text-blue-600" size={48} /><p style={{ marginTop: '20px', fontWeight: '900', color: isDark ? '#fff' : '#1c1c1e', textTransform: 'uppercase', fontSize: '12px' }}>Sincronizando Vault...</p>
        </motion.div>
      )}</AnimatePresence>

      <nav style={{ width: '100px', backgroundColor: isDark ? '#111' : '#1C1C1E', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', zIndex: 100 }}>
        <img src={logoAxiom} alt="Axiom" style={{ width: '50px', height: '50px', marginBottom: '40px', objectFit: 'contain' }} />
        <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} label="Mando" isDark={isDark} />
        <NavIcon active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={<List size={24} />} label="Matriz" isDark={isDark} />
        <NavIcon active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<AxiomMapIcon size={24} />} label="Táctico" isDark={isDark} />
        <button onClick={() => setIsModalOpen(true)} style={{ marginTop: '20px', width: '56px', height: '56px', borderRadius: '18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}><Plus size={26} /></button>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ marginTop: 'auto', marginBottom: '25px', background: 'none', border: 'none', color: '#636366', cursor: 'pointer' }}>{isDark ? <Sun size={24} /> : <Moon size={24} />}</button>
        <button onClick={() => setUser(null)} style={{ background: 'none', border: 'none', color: '#636366', cursor: 'pointer' }}><LogOut size={24} /></button>
      </nav>

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <motion.div key="db" className="h-full"><DashboardView data={data} onSwitchTab={setActiveTab} serverPath={serverPath} setServerPath={setServerPath} onGenerateReport={generateReport} isDark={isDark} onSync={() => syncServer()} /></motion.div>}
          {activeTab === 'table' && <motion.div key="tb" className="h-full"><TableView data={data} onImportExcel={handleImportExcel} onSelect={(e) => { setSelectedExp(e); setIsSidebarOpen(true); }} onViewMap={(e) => { setSelectedExp(e); setActiveTab('map'); setIsSidebarOpen(false); }} selectedId={selectedExp?.id} scrollRef={tableScrollRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onSort={handleSort} isDark={isDark} /></motion.div>}
          {activeTab === 'map' && <motion.div key="mp" className="h-full"><VisorTactico selectedExp={selectedExp} /></motion.div>}
        </AnimatePresence>
      </main>

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} expediente={selectedExp} onUpdate={updateExpediente} onOpenFolder={handleOpenFolder} onViewMap={(e) => { setSelectedExp(e); setActiveTab('map'); setIsSidebarOpen(false); }} isDark={isDark} />
      <NewExpedienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddNewExpediente} isDark={isDark} />
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label, isDark }) => (
  <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '25px', background: 'none', border: 'none', cursor: 'pointer', opacity: active ? 1 : 0.3, color: active ? '#2563eb' : '#fff', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent' }}>{icon}</div>
    <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
  </button>
);

export default App;