import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, List, Map as AxiomMapIcon, LogOut, 
  Loader2, Plus, Sun, Moon, Save, Database, FolderSync, FileSpreadsheet 
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importación de Componentes del Ecosistema AXIOM
import Login from './components/Login';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import VisorTactico from './components/VisorTactico';
import DetailSidebar from './components/DetailSidebar';
import NewExpedienteModal from './components/NewExpedienteModal';
import logoAxiom from './assets/LogoAxiomVault.png';

const App = () => {
  // --- ESTADOS DE NÚCLEO ---
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExp, setSelectedExp] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // --- CONFIGURACIÓN Y TEMA ---
  const [theme, setTheme] = useState(localStorage.getItem('axiom_theme') || 'light');
  const [serverPath, setServerPath] = useState(localStorage.getItem('axiom_server_path') || '');
  const tableScrollRef = useRef(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // --- PERSISTENCIA: CARGA INICIAL (M4 OPTIMIZED) ---
  useEffect(() => {
    const initData = async () => {
      if (serverPath) {
        try {
          const content = await invoke('load_database', { base_path: serverPath });
          setData(JSON.parse(content));
          console.log("AXIOM: Base de datos sincronizada desde servidor.");
        } catch (e) {
          console.log("AXIOM: Servidor no detectado, cargando persistencia local.");
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

  // Persistencia de configuración de sistema
  useEffect(() => {
    localStorage.setItem('axiom_server_path', serverPath);
    localStorage.setItem('axiom_theme', theme);
    if (data.length > 0) localStorage.setItem('axiom_vault_db', JSON.stringify(data));
  }, [serverPath, theme, data]);

  // --- GESTIÓN DE ARCHIVOS (BRIDGE RUST) ---
  const syncServer = async (targetData) => {
    const dataToSave = targetData || data;
    if (serverPath && dataToSave.length > 0) {
      try {
        await invoke('save_database', { 
          base_path: serverPath, 
          data_json: JSON.stringify(dataToSave) 
        });
        console.log("AXIOM: Vault master sincronizado.");
      } catch (e) { 
        console.error("Fallo de sincronización en servidor:", e); 
      }
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
    } catch (err) { console.error("Error creando carpetas:", err); }
  };

  const handleOpenFolder = async (expediente) => {
    if (!serverPath) return alert("Configure la ruta raíz en el Dashboard.");
    const folderName = `${expediente.expediente_num} - ${expediente.establecimiento.replace(/[/\\?%*:|"<>]/g, "-")}`;
    const folderPath = `${serverPath}/${folderName}`;
    try {
      await invoke('open_vault_folder', { folder_path: folderPath });
    } catch (err) { alert("Acceso denegado o carpeta inexistente en servidor."); }
  };

  // --- MOTOR DE IMPORTACIÓN MAPEADO 27 CAMPOS ---
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
          const rawRef = String(f(['Catastral', 'Referencia']));
          const refArray = rawRef.split(/[;,]/).map(r => r.trim()).filter(r => r !== "");

          return {
            id: Date.now() + i,
            tipo: f(['TIPO']),
            obligado: String(f(['OBLIGADO'])).toUpperCase().includes('SI') ? 'SI' : 'NO',
            rd393: String(f(['R.D. 393/2007', 'RD393'])).toUpperCase().includes('SI') ? 'SI' : 'NO',
            apendice3: String(f(['APÉNDICE 3', 'APENDICE'])).toUpperCase().includes('SI') ? 'SI' : 'NO',
            sectorial: String(f(['SECTORIAL'])).toUpperCase().includes('SI') ? 'SI' : 'NO',
            estado_actual: String(f(['ESTADO ACTUAL', 'STATUS']) || 'A').toUpperCase().trim(),
            fecha_mov: f(['ÚLTIMO MOVIMIENTO']),
            entrada_pau: f(['ENTRADA PAU']),
            papel: f(['PAPEL']),
            cd: f(['CD']),
            servidor: f(['SERVIDOR']),
            fecha_pau: f(['FECHA PAU']),
            caducidad: f(['CADUCIDAD']),
            fin_anterior: f(['FIN ANTERIOR']),
            tecnico: f(['TÉCNICO', 'RESPONSABLE']),
            expediente_num: f(['Nº EXPEDIENTE', 'Expediente']),
            anexo_iv: String(f(['ANEXO IV'])).toUpperCase().includes('SI') ? 'SI' : 'NO',
            certificado: f(['CERTIFICADO']),
            establecimiento: f(['ESTABLECIMIENTO', 'NOMBRE']),
            titular: f(['TITULAR']),
            uso: f(['USO']),
            documentacion: f(['DOCUMENTACIÓN']),
            simulacro: f(['SIMULACRO']),
            ubicacion_fisica: f(['UBICACIÓN FÍSICA']),
            observaciones: f(['OBSERVACIONES']),
            finca: f(['Nº FINCA']),
            solicitada_rev: f(['SOLICITADA REVISIÓN']),
            solicitudes_ant: f(['SOLICITUDES ANTERIORES']),
            referencia_catastral: rawRef,
            referencia_principal: refArray[0] || '-',
            referencias: refArray,
            latitud: parseFloat(f(['Latitud'])) || 36.7213,
            longitud: parseFloat(f(['Longitud'])) || -4.4214,
            municipio: "Málaga",
            notas: ""
          };
        });
        setData(formatted);
        syncServer(formatted);
        setTimeout(() => { setIsImporting(false); setActiveTab('table'); }, 800);
      } catch (err) { setIsImporting(false); alert("Error crítico en mapeo de Excel."); }
    };
    reader.readAsArrayBuffer(file);
  };

  // --- CRUD OPERACIONES ---
  const updateExpediente = (updatedExp) => {
    setData(prev => {
      const newData = prev.map(e => e.id === updatedExp.id ? updatedExp : e);
      syncServer(newData);
      return newData;
    });
    setSelectedExp(updatedExp);
  };

  const handleAddNewExpediente = (newExp) => {
    const fullExp = { 
      ...newExp, id: Date.now(), notes: "", anexo_iv: "NO", estado_actual: "A",
      rd393: "NO", referencias: [newExp.referencia_principal], expediente_num: newExp.expediente
    };
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

  // --- GENERADOR DE INFORME OFICIAL (v1.7.2 - 2 PÁGINAS) ---
  const generateReport = () => {
    if (data.length === 0) return alert("Cargue datos primero.");
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const month = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();
      const palette = {
        A: [204, 204, 255], B1: [255, 102, 102], B2: [255, 153, 51],
        F: [153, 204, 0], FSV: [51, 153, 153], NP: [204, 204, 204],
        NT: [153, 153, 153], CERRADO: [217, 217, 217], REV: [166, 166, 166]
      };

      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text("BALANCE MENSUAL PLANES DE AUTOPROTECCIÓN", 105, 10, { align: 'center' });

      // Tabla Periodo
      autoTable(doc, {
        startY: 15, head: [['PERIODO', 'NO MUNIC.', 'MUNICIPALES', 'FORESTALES', 'TOTAL']],
        body: [[month + ' 2026', 
          data.filter(e => !e.tipo.includes('Municipal') && !e.tipo.includes('Forestal')).length, 
          data.filter(e => e.tipo.includes('Municipal')).length, 
          data.filter(e => e.tipo.includes('Forestal')).length, 
          data.length]],
        theme: 'grid', headStyles: { fillColor: [230, 230, 230], textColor: 0 }
      });

      const getRowsByOblig = (isObl) => {
        const states = ['A', 'B1', 'B2', 'F', 'FSV', 'N/P', 'N/T', 'CERRADO', 'REV'];
        return states.map(s => [
          s,
          data.filter(e => e.estado_actual === s && !e.tipo.includes('Municipal') && !e.tipo.includes('Forestal') && e.rd393 === (isObl ? 'SI' : 'NO')).length,
          data.filter(e => e.estado_actual === s && e.tipo.includes('Municipal') && e.rd393 === (isObl ? 'SI' : 'NO')).length,
          data.filter(e => e.estado_actual === s && e.tipo.includes('Forestal') && e.rd393 === (isObl ? 'SI' : 'NO')).length,
          data.filter(e => e.estado_actual === s && e.rd393 === (isObl ? 'SI' : 'NO')).length
        ]);
      };

      doc.text("PLANES OBLIGADOS", 15, doc.lastAutoTable.finalY + 8);
      autoTable(doc, { startY: doc.lastAutoTable.finalY + 11, head: [['ESTADO', 'NO MUNIC.', 'MUNIC.', 'FOREST.', 'TOTAL']], body: getRowsByOblig(true), headStyles: { fillColor: [239, 68, 68] }, styles: { fontSize: 7 } });

      doc.text("SÍNTESIS DE ESTADOS GENERALES", 15, doc.lastAutoTable.finalY + 8);
      const cST = (st, isObl) => data.filter(e => e.estado_actual === st && e.rd393 === (isObl ? 'SI' : 'NO')).length;
      const porIn = (isObl) => cST('A', isObl) + cST('REV', isObl);
      const enPr = (isObl) => cST('B1', isObl) + cST('B2', isObl);
      const fin = (isObl) => cST('F', isObl) + cST('FSV', isObl) + cST('N/P', isObl) + cST('N/T', isObl) + cST('CERRADO', isObl);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 11, head: [['ESTADOS GENERALES', 'OBLIGADOS', 'NO OBLIGADOS', 'TOTALES']],
        body: [['POR INICIAR', porIn(true), porIn(false), porIn(true)+porIn(false)], ['EN PROCESO', enPr(true), enPr(false), enPr(true)+enPr(false)], ['FINALIZADOS', fin(true), fin(false), fin(true)+fin(false)], ['TOTAL', data.filter(e=>e.rd393==='SI').length, data.filter(e=>e.rd393==='NO').length, data.length]],
        theme: 'grid', headStyles: { fillColor: [37, 99, 235] }
      });

      // Leyenda
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 5, head: [['ESTADO', 'DESCRIPCIÓN']],
        body: [['A','PENDIENTE'],['B1','SOLICITADO'],['B2','RECIBIDO'],['F','FAVORABLE'],['FSV','SIN VISITA'],['N/P','NO PROCEDE'],['N/T','ANTIGUO'],['CERRADO','CERRADO'],['REV','REV. PLEIF']],
        theme: 'grid', margin: { right: 100 }, styles: { fontSize: 6, cellPadding: 0.5 }, pageBreak: 'avoid',
        didParseCell: (d) => { if(d.section === 'body' && d.column.index === 0) { const c = palette[d.cell.raw]; if(c) d.cell.styles.fillColor = c; } }
      });

      // Página 2: Gráficas
      doc.addPage();
      doc.text("VISUALIZACIÓN ESTADÍSTICA", 105, 15, { align: 'center' });
      const drawB = (x, y, title, vals, labels) => {
        doc.setFontSize(8); doc.text(title, x, y - 5);
        const max = Math.max(...vals, 1);
        vals.forEach((v, i) => {
          const h = (v/max) * 35; doc.setFillColor(37, 99, 235); doc.rect(x + (i * 18), y + 35 - h, 12, h, 'F');
          doc.setFontSize(6); doc.text(labels[i], x + (i * 18), y + 40); doc.text(v.toString(), x + (i * 18) + 4, y + 35 - h - 2);
        });
      };
      drawB(20, 50, "RESUMEN POR ESTADO", [porIn(true)+porIn(false), enPr(true)+enPr(false), fin(true)+fin(false)], ['POR INICIAR', 'EN PROCESO', 'FINALIZADOS']);

      doc.save(`Axiom_Balance_Oficial_${month}.pdf`);
    } catch (e) { console.error("Error en motor PDF:", e); }
  };

  if (!user) return <Login onLogin={setUser} />;
  const isDark = theme === 'dark';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: isDark ? '#000' : '#F5F5F7', color: isDark ? '#fff' : '#000', overflow: 'hidden', transition: 'all 0.4s ease' }}>
      <AnimatePresence>{isImporting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin text-blue-600" size={48} /><p style={{ marginTop: '20px', fontWeight: '900', color: isDark ? '#fff' : '#1c1c1e', textTransform: 'uppercase', fontSize: '12px' }}>Sincronizando Registro...</p>
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

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} expediente={selectedExp} onUpdate={updateExpediente} onOpenFolder={handleOpenFolder} isDark={isDark} />
      <NewExpedienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddNewExpediente} isDark={isDark} />
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label, isDark }) => (
  <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '25px', background: 'none', border: 'none', cursor: 'pointer', opacity: active ? 1 : 0.3, color: active ? '#2563eb' : '#fff', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent' }}>{icon}</div>
    <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
  </button>
);

export default App;