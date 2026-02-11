// src/components/TableView.jsx
import React, { useState, useMemo } from 'react';
import { Upload, ChevronRight, Shield, FileSpreadsheet, Search, Filter } from 'lucide-react';

const TableView = ({ data, onSelect, onViewMap, onImportExcel, onGenerateReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL | F | A
  const fileInputRef = React.useRef(null);

  const filteredData = useMemo(() => {
    return data.filter(exp => {
      const matchesSearch = exp.establecimiento.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            exp.referencia_catastral.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'ALL' || exp.estado_actual === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterStatus]);

  return (
    <div className="p-8 h-full flex flex-col bg-[#F5F5F7] dark:bg-black">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Matriz de <span className="text-blue-600">Custodia</span></h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión Técnica de Planes de Autoprotección</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onGenerateReport}
            className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 shadow-lg"
          >
            <FileSpreadsheet size={16} /> Informe Balance
          </button>
          <input type="file" ref={fileInputRef} onChange={(e) => onImportExcel(e.target.files[0])} className="hidden" accept=".xlsx, .xls" />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-xl"
          >
            <Upload size={16} /> Importar XLS
          </button>
        </div>
      </header>

      {/* Barra de Herramientas: Búsqueda y Filtro */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por establecimiento o referencia..." 
            className="w-full h-14 pl-12 pr-6 bg-white dark:bg-white/5 rounded-2xl border-none outline-none font-bold text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="h-14 px-6 bg-white dark:bg-white/5 rounded-2xl font-bold text-sm outline-none border-none shadow-sm cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">TODOS LOS ESTADOS</option>
          <option value="F">FAVORABLES</option>
          <option value="A">PENDIENTES (PRIORIDAD A)</option>
        </select>
      </div>

      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-inner">
        <div className="overflow-auto h-full p-6">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="pb-6 pl-4">ID / ÁMBITO</th>
                <th className="pb-6">ESTABLECIMIENTO / REF. CATASTRAL</th>
                <th className="pb-6 text-center">ESTADO OPERATIVO</th>
                <th className="pb-6 text-center">ANEXO IV</th>
                <th className="pb-6 text-right pr-4">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredData.map((exp) => (
                <tr 
                  key={exp.id} 
                  onClick={() => onSelect(exp)}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <td className="py-6 pl-4">
                    <p className="text-blue-600 font-black">#{exp.expediente}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{exp.tipo}</p>
                  </td>
                  <td className="py-6">
                    <p className="font-black text-sm uppercase text-gray-800 dark:text-white">{exp.establecimiento}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{exp.referencia_catastral}</p>
                  </td>
                  <td className="py-6 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                      exp.estado_actual === 'F' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'
                    }`}>
                      {exp.estado_actual === 'F' ? 'Favorable' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-6 flex justify-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${exp.anexo_iv === 'SI' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}>
                      <Shield size={18} fill={exp.anexo_iv === 'SI' ? 'white' : 'transparent'} />
                    </div>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewMap(exp); }}
                      className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
              <Activity size={64} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Sin registros que coincidan con el filtro táctico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TableView;