// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, List, Map as AxiomMapIcon, LogOut, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [isImporting, setIsImporting] = useState(false);
  
  const tableScrollRef = useRef(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const saved = localStorage.getItem('axiom_vault_db');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (data.length > 0) localStorage.setItem('axiom_vault_db', JSON.stringify(data));
  }, [data]);

  const handleImportExcel = (file) => {
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        const formatted = raw.map((row, i) => {
          const find = (keys) => {
            const k = Object.keys(row).find(key => keys.some(s => key.toLowerCase().trim().includes(s.toLowerCase())));
            return k ? row[k] : null;
          };
          const rawRef = String(find(['Catastral', 'Referencia', 'Ref']) || 'PENDIENTE');
          const refArray = rawRef.split(/[;,]/).map(r => r.trim()).filter(r => r !== "");

          return {
            id: i + 1,
            establecimiento: find(['Establecimiento', 'Titular', 'Nombre']) || 'DESCONOCIDO',
            referencias: refArray,
            referencia_principal: refArray[0] || 'PENDIENTE',
            anexo_iv: (String(find(['Anexo IV']) || '').toUpperCase().includes('SI')) ? 'SI' : 'NO',
            estado_actual: String(find(['Estado', 'Status']) || 'A').toUpperCase().trim(),
            tipo: find(['Uso', 'Tipo', 'Ambito']) || 'General',
            obligado: String(find(['RD 393', 'Obligado']) || '').toUpperCase().includes('SI'),
            latitud: parseFloat(find(['Latitud', 'LAT'])) || null,
            longitud: parseFloat(find(['Longitud', 'LON'])) || null,
            municipio: find(['Municipio', 'Pueblo']) || 'Málaga',
            titular: find(['Titular', 'Propietario']) || 'N/A',
            finca: find(['Finca', 'Nº Finca']) || 'N/A',
            caducidad: find(['Caducidad', 'Vence']) || 'N/A',
            simulacro: find(['Simulacro']) || 'N/A',
            notas: ""
          };
        });
        setData(formatted);
        setTimeout(() => { setIsImporting(false); setActiveTab('table'); }, 800);
      } catch (err) { setIsImporting(false); alert("Error en procesado"); }
    };
    reader.readAsArrayBuffer(file);
  };

  const updateExpediente = (updatedExp) => {
    setData(prev => prev.map(e => e.id === updatedExp.id ? updatedExp : e));
    setSelectedExp(updatedExp);
  };

  // --- MOTOR DE REPORTE TÉCNICO AVANZADO (v1.7.2 REFINADO) ---
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

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BALANCE MENSUAL PLANES DE AUTOPROTECCIÓN", 105, 10, { align: 'center' });

      // Tabla 1: Entrada
      autoTable(doc, {
        startY: 15,
        head: [['PERIODO', 'NO MUNICIPALES', 'MUNICIPALES', 'FORESTALES', 'TOTAL']],
        body: [[month + ' 2026', 
          data.filter(e => !e.tipo.includes('Municipal') && !e.tipo.includes('Forestal')).length,
          data.filter(e => e.tipo.includes('Municipal')).length,
          data.filter(e => e.tipo.includes('Forestal')).length,
          data.length
        ]],
        theme: 'grid', headStyles: { fillColor: [230, 230, 230], textColor: 0, fontSize: 8 }
      });

      const getRowsByObligation = (isObligado) => {
        const states = ['A', 'B1', 'B2', 'F', 'FSV', 'N/P', 'N/T', 'CERRADO', 'REV'];
        return states.map(s => [
          s,
          data.filter(e => e.estado_actual === s && !e.tipo.includes('Municipal') && !e.tipo.includes('Forestal') && e.obligado === isObligado).length,
          data.filter(e => e.estado_actual === s && e.tipo.includes('Municipal') && e.obligado === isObligado).length,
          data.filter(e => e.estado_actual === s && e.tipo.includes('Forestal') && e.obligado === isObligado).length,
          data.filter(e => e.estado_actual === s && e.obligado === isObligado).length
        ]);
      };

      // Tabla 2: Obligados
      doc.setFontSize(9);
      doc.text("PLANES OBLIGADOS POR NORMATIVA", 15, doc.lastAutoTable.finalY + 8);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 11,
        head: [['ESTADO', 'NO MUNIC.', 'MUNICIPALES', 'FORESTALES', 'TOTAL']],
        body: getRowsByObligation(true),
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 7, cellPadding: 1.5 }
      });

      // Tabla 3: No Obligados
      doc.text("PLANES NO OBLIGADOS POR NORMATIVA", 15, doc.lastAutoTable.finalY + 8);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 11,
        head: [['ESTADO', 'NO MUNIC.', 'MUNICIPALES', 'FORESTALES', 'TOTAL']],
        body: getRowsByObligation(false),
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 7, cellPadding: 1.5 }
      });

      // Tabla 4: Estados Generales (Solicitada Imagen 4)
      const count = (st, isObl) => data.filter(e => e.estado_actual === st && e.obligado === isObl).length;
      const porIniciar = (isObl) => count('A', isObl) + count('REV', isObl);
      const enProceso = (isObl) => count('B1', isObl) + count('B2', isObl);
      const finalizados = (isObl) => count('F', isObl) + count('FSV', isObl) + count('N/P', isObl) + count('N/T', isObl) + count('CERRADO', isObl);

      doc.text("ESTADOS GENERALES", 15, doc.lastAutoTable.finalY + 8);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 11,
        head: [['ESTADOS GENERALES', 'OBLIGADOS', 'NO OBLIGADOS', 'TOTALES']],
        body: [
          ['POR INICIAR (A, REV.)', porIniciar(true), porIniciar(false), porIniciar(true) + porIniciar(false)],
          ['EN PROCESO (B1, B2)', enProceso(true), enProceso(false), enProceso(true) + enProceso(false)],
          ['FINALIZADOS (F, FSV, N/P, N/T, CERRADO)', finalizados(true), finalizados(false), finalizados(true) + finalizados(false)],
          ['TOTAL', data.filter(e=>e.obligado).length, data.filter(e=>!e.obligado).length, data.length]
        ],
        theme: 'grid', headStyles: { fillColor: [37, 99, 235] }, styles: { fontSize: 8, cellPadding: 1.5 }
      });

      // AJUSTE TÁCTICO: LEYENDA COMPACTA (Evitar corte de página)
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 6,
        head: [['ESTADO', 'DESCRIPCIÓN']],
        body: [
          ['A','PENDIENTE DE REVISAR'],['B1','REQUERIMIENTO SOLICITADO'],['B2','REQUERIMIENTO RECIBIDO'],
          ['F','FINALIZADO FAVORABLE'],['FSV','FINALIZADO SIN VISITA'],['N/P','NO PROCEDE / BAJA'],
          ['N/T','ANTIGUO'],['CERRADO','CERRADO'],['REV','PENDIENTE REVISIÓN PLEIF']
        ],
        theme: 'grid',
        margin: { right: 80 }, // La hacemos más estrecha para ganar espacio vertical si fuera necesario
        styles: { fontSize: 6, cellPadding: 0.8 }, // Fuente muy pequeña para referencia
        headStyles: { fillColor: [100, 100, 100], fontSize: 6 },
        pageBreak: 'avoid', // Evita que se divida entre dos páginas
        didParseCell: (d) => { 
          if(d.section === 'body' && d.column.index === 0) { 
            const c = palette[d.cell.raw]; 
            if(c) d.cell.styles.fillColor = c; 
          } 
        }
      });

      // --- PÁGINA 2: GRÁFICAS (RÉPLICA IMAGEN 3) ---
      doc.addPage();
      doc.setFontSize(12);
      doc.text("VISUALIZACIÓN DE DATOS ESTADÍSTICOS", 105, 15, { align: 'center' });

      const drawBarChart = (x, y, title, labels, values, colors) => {
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.text(title, x, y - 5);
        const max = Math.max(...values, 1);
        const chartH = 35;
        
        // Ejes
        doc.setDrawColor(200);
        doc.line(x, y, x, y + chartH);
        doc.line(x, y + chartH, x + 120, y + chartH);

        values.forEach((v, i) => {
          const h = (v/max) * chartH;
          doc.setFillColor(...(colors[i] || [150, 150, 150]));
          doc.rect(x + 5 + (i * 13), y + chartH - h, 8, h, 'F');
          
          doc.setFontSize(6);
          doc.saveGraphicsState();
          doc.text(labels[i], x + 5 + (i * 13), y + chartH + 4);
          doc.setFontSize(6);
          doc.text(v.toString(), x + 5 + (i * 13), y + chartH - h - 2);
        });
      };

      // Gráfico 1: Totales por Estado
      const stateLabels = ['A', 'B1', 'B2', 'F', 'FSV', 'N/P', 'N/T', 'CER', 'REV'];
      const stateValues = ['A', 'B1', 'B2', 'F', 'FSV', 'N/P', 'N/T', 'CERRADO', 'REV'].map(s => data.filter(e => e.estado_actual === s).length);
      drawBarChart(15, 45, "TOTALES POR CÓDIGO DE ESTADO", stateLabels, stateValues, ['A','B1','B2','F','FSV','N/P','N/T','CERRADO','REV'].map(s => palette[s] || [150,150,150]));

      // Gráfico 2: Estados Generales
      drawBarChart(15, 110, "RESUMEN DE ESTADOS GENERALES (ACUMULADO)", 
        ['POR INICIAR', 'EN PROCESO', 'FINALIZADOS'], 
        [porIniciar(true)+porIniciar(false), enProceso(true)+enProceso(false), finalizados(true)+finalizados(false)], 
        [[200,220,255], [100,150,255], [37,99,235]]
      );

      doc.save(`Axiom_Balance_Oficial_${month}_2026.pdf`);
    } catch (e) { console.error(e); alert("Fallo en el motor PDF."); }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F5F5F7', overflow: 'hidden' }}>
      <AnimatePresence>
        {isImporting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p style={{ marginTop: '20px', fontWeight: '900', color: '#1c1c1e', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>Actualizando Protocolo Vault...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{ width: '100px', backgroundColor: '#1C1C1E', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', zIndex: 100 }}>
        <img src={logoAxiom} alt="Axiom" style={{ width: '50px', height: '50px', marginBottom: '50px', objectFit: 'contain' }} />
        <NavIcon active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} label="Mando" />
        <NavIcon active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={<List size={24} />} label="Matriz" />
        <NavIcon active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<AxiomMapIcon size={24} />} label="Táctico" />
        <button onClick={() => setUser(null)} style={{ marginTop: 'auto', background: 'none', border: 'none', color: '#636366', cursor: 'pointer' }}><LogOut size={24} /></button>
      </nav>

      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <motion.div key="db" className="h-full"><DashboardView data={data} onSwitchTab={setActiveTab} onGenerateReport={generateReport} /></motion.div>}
          {activeTab === 'table' && <motion.div key="tb" className="h-full"><TableView data={data} onImportExcel={handleImportExcel} onSelect={(e) => { setSelectedExp(e); setIsSidebarOpen(true); }} onViewMap={(e) => { setSelectedExp(e); setActiveTab('map'); setIsSidebarOpen(false); }} selectedId={selectedExp?.id} scrollRef={tableScrollRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} /></motion.div>}
          {activeTab === 'map' && <motion.div key="mp" className="h-full"><VisorTactico selectedExp={selectedExp} /></motion.div>}
        </AnimatePresence>
      </main>

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} expediente={selectedExp} onUpdate={updateExpediente} onViewMap={(e) => { setSelectedExp(e); setActiveTab('map'); setIsSidebarOpen(false); }} />
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '30px', background: 'none', border: 'none', cursor: 'pointer', opacity: active ? 1 : 0.3, color: active ? '#2563eb' : '#fff' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent' }}>{icon}</div>
    <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>{label}</span>
  </button>
);

export default App;