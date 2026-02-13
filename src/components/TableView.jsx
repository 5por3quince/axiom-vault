// src/components/TableView.jsx
import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Shield, Search, Map as AxiomMapIcon, Database } from 'lucide-react';

const TableView = ({ data = [], onImportExcel, onSelect, onViewMap, selectedId, scrollRef, searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollRef.current;
    }
  }, []);

  const handleScrollPersistence = (e) => {
    scrollRef.current = e.target.scrollTop;
  };

  const filtered = useMemo(() => {
    return data.filter(e => {
      const establishment = (e.establecimiento || '').toLowerCase();
      const ref = (e.referencia_principal || '').toLowerCase();
      return (establishment.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase())) &&
             (statusFilter === 'ALL' || e.estado_actual === statusFilter);
    });
  }, [data, searchTerm, statusFilter]);

  return (
    <div style={{ padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F5F7', overflow: 'hidden' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>MATRIZ DE <span style={{ color: '#2563eb' }}>EXPEDIENTES</span></h1>
        <button onClick={() => fileInputRef.current.click()} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '16px 28px', borderRadius: '18px', border: 'none', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Upload size={18} /> Importar Listado .XLS
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xls,.xlsx" onChange={(e) => onImportExcel(e.target.files[0])} />
        </button>
      </header>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', color: '#8e8e93' }} size={20} />
          <input type="text" placeholder="Filtrar expedientes..." style={{ width: '100%', padding: '20px 20px 20px 65px', borderRadius: '22px', border: 'none', backgroundColor: '#fff', fontSize: '14px', fontWeight: 'bold', outline: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0 30px', borderRadius: '22px', border: 'none', backgroundColor: '#fff', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', color: '#2563eb' }}>
          <option value="ALL">TODOS</option>
          <option value="F">FAVORABLES</option>
          <option value="A">PENDIENTES</option>
        </select>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '35px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div ref={scrollContainerRef} onScroll={handleScrollPersistence} style={{ overflowY: 'auto', flex: 1, padding: '25px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f4f7' }}>
                <th style={{ padding: '18px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', width: '80px' }}>ID</th>
                <th style={{ padding: '18px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase' }}>Establecimiento</th>
                <th style={{ padding: '18px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', textAlign: 'center', width: '140px' }}>Estado</th>
                <th style={{ padding: '18px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', textAlign: 'center', width: '110px' }}>Anexo IV</th>
                <th style={{ padding: '18px', fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', textAlign: 'right', width: '85px' }}>Mapa</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} onClick={() => onSelect(e)} style={{ borderBottom: '1px solid #f4f4f7', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selectedId === e.id ? '#f0f7ff' : 'transparent' }}>
                  <td style={{ padding: '22px 18px', fontWeight: '900', color: '#2563eb', fontSize: '13px' }}>#{e.id.toString().padStart(3, '0')}</td>
                  <td style={{ padding: '22px 18px', overflow: 'hidden' }}>
                    <div style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.establecimiento}</div>
                    <div style={{ fontSize: '10px', color: '#8e8e93', fontWeight: 'bold' }}>{e.referencia_principal}</div>
                  </td>
                  <td style={{ padding: '18px', textAlign: 'center' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '9px', fontWeight: '900', backgroundColor: e.estado_actual === 'F' ? '#dcfce7' : '#fee2e2', color: e.estado_actual === 'F' ? '#166534' : '#991b1b' }}>{e.estado_actual === 'F' ? 'FAVORABLE' : 'PENDIENTE'}</span>
                  </td>
                  <td style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <motion.div animate={e.anexo_iv === 'SI' ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: e.anexo_iv === 'SI' ? '#10b981' : '#f8f8fa' }}>
                        <Shield size={18} color={e.anexo_iv === 'SI' ? '#fff' : '#d1d1d6'} fill={e.anexo_iv === 'SI' ? '#fff' : 'transparent'} />
                      </motion.div>
                    </div>
                  </td>
                  <td style={{ padding: '18px', textAlign: 'right' }}>
                    <button onClick={(event) => { event.stopPropagation(); onViewMap(e); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c7c7cc', padding: '10px' }}>
                      <AxiomMapIcon size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <div style={{ padding: '100px 0', textAlign: 'center', opacity: 0.2 }}><Database size={48} /><p>Sin datos</p></div>}
        </div>
      </div>
    </div>
  );
};

export default TableView;