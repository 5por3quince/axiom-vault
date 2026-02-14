// src/components/TableView.jsx
import React, { useMemo, useRef, useEffect } from 'react';
import { Upload, Shield, Search, Map as AxiomMapIcon, Database } from 'lucide-react';

const TableView = ({ data = [], onImportExcel, onSelect, onViewMap, selectedId, scrollRef, searchTerm, setSearchTerm, statusFilter, setStatusFilter, isDark }) => {
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = scrollRef.current;
  }, []);

  const filtered = useMemo(() => {
    return data.filter(e => {
      const establishment = (e.establecimiento || '').toLowerCase();
      const ref = (e.referencia_principal || '').toLowerCase();
      return (establishment.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase())) &&
             (statusFilter === 'ALL' || e.estado_actual === statusFilter);
    });
  }, [data, searchTerm, statusFilter]);

  const tableBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#1C1C1E';
  const borderRow = isDark ? '1px solid #2C2C2E' : '1px solid #f2f2f7';

  return (
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, textTransform: 'uppercase', color: textPrimary }}>MATRIZ DE <span style={{ color: '#2563eb' }}>EXPEDIENTES</span></h1>
        <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '16px 24px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }}>
          <Upload size={18} /> Importar XLS
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xls,.xlsx" onChange={(e) => onImportExcel(e.target.files[0])} />
        </button>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={20} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            // --- FIX VISIBILIDAD ---
            style={{ width: '100%', padding: '18px 20px 18px 60px', borderRadius: '20px', border: 'none', backgroundColor: tableBg, color: textPrimary, fontSize: '14px', fontWeight: 'bold', outline: 'none' }} 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0 25px', borderRadius: '20px', border: 'none', backgroundColor: tableBg, color: '#2563eb', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}>
          <option value="ALL">TODOS</option><option value="F">FAVORABLES</option><option value="A">PENDIENTES</option>
        </select>
      </div>

      <div style={{ flex: 1, backgroundColor: tableBg, borderRadius: '32px', border: `1px solid ${isDark ? '#333' : 'rgba(0,0,0,0.05)'}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div ref={scrollContainerRef} onScroll={(e) => scrollRef.current = e.target.scrollTop} style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: tableBg, zIndex: 10 }}>
              <tr style={{ textAlign: 'left', borderBottom: `2px solid ${isDark ? '#333' : '#f2f2f7'}` }}>
                <th style={{ padding: '16px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', width: '80px' }}>ID</th>
                <th style={{ padding: '16px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase' }}>Establecimiento</th>
                <th style={{ padding: '16px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', textAlign: 'center', width: '140px' }}>Estado</th>
                <th style={{ padding: '16px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', textAlign: 'center', width: '100px' }}>Mapa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} onClick={() => onSelect(e)} style={{ borderBottom: borderRow, cursor: 'pointer', backgroundColor: selectedId === e.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent' }}>
                  <td style={{ padding: '16px', fontWeight: '900', color: '#2563eb' }}>#{e.expediente_num}</td>
                  <td style={{ padding: '16px' }}>
                    {/* --- FIX VISIBILIDAD ESTABLECIMIENTO --- */}
                    <div style={{ fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', color: textPrimary }}>{e.establecimiento}</div>
                    <div style={{ fontSize: '10px', color: '#8e8e93', fontWeight: 'bold' }}>{e.referencia_principal}</div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '8px', fontWeight: '900', backgroundColor: e.estado_actual === 'F' ? '#dcfce7' : '#fee2e2', color: e.estado_actual === 'F' ? '#166534' : '#991b1b' }}>{e.estado_actual === 'F' ? 'FAVORABLE' : 'PENDIENTE'}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button onClick={(event) => { event.stopPropagation(); onViewMap(e); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8e8e93' }}><AxiomMapIcon size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;