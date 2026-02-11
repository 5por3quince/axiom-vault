// src/components/TableView.jsx
import React, { useState, useMemo, useRef } from 'react';
import { Upload, ChevronRight, Shield, Search, Database } from 'lucide-react';

const TableView = ({ data = [], onSelect, onViewMap, onImportExcel, selectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const fileInputRef = useRef(null);

  const filteredData = useMemo(() => {
    return data.filter(exp => {
      const textMatch = exp.establecimiento.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        exp.referencia_catastral.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === 'ALL' || exp.estado_actual === filterStatus;
      return textMatch && statusMatch;
    });
  }, [data, searchTerm, filterStatus]);

  return (
    <div className="p-8 h-full flex flex-col bg-[#F5F5F7] dark:bg-black">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black dark:text-white">MATRIZ DE <span className="text-blue-600">CUSTODIA</span></h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 italic">Gestión de Expedientes Técnicos</p>
        </div>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 shadow-xl transition-all active:scale-95"
        >
          <Upload size={18} /> Importar Listado .XLS
          <input type="file" ref={fileInputRef} onChange={(e) => onImportExcel(e.target.files[0])} className="hidden" accept=".xlsx, .xls" />
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nombre o referencia catastral..." 
            className="w-full h-14 pl-14 pr-6 bg-white dark:bg-[#1C1C1E] rounded-2xl border-none outline-none font-bold text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="h-14 px-6 bg-white dark:bg-[#1C1C1E] rounded-2xl font-black text-[10px] uppercase outline-none border-none shadow-sm cursor-pointer text-blue-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">TODOS LOS ESTADOS</option>
          <option value="F">FAVORABLES</option>
          <option value="A">PENDIENTES</option>
        </select>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner">
        <div className="overflow-auto h-full p-6">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5">
              <tr>
                <th className="pb-6 pl-4">ID</th>
                <th className="pb-6">ESTABLECIMIENTO / REFERENCIA</th>
                <th className="pb-6 text-center">ESTADO</th>
                <th className="pb-6 text-center">ANEXO IV</th>
                <th className="pb-6 text-right pr-4">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredData.map((exp) => (
                <tr 
                  key={exp.id} 
                  onClick={() => onSelect(exp)}
                  className={`transition-all cursor-pointer group ${
                    selectedId === exp.id ? 'bg-blue-50/50 dark:bg-blue-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <td className="py-6 pl-4 font-black text-blue-600 text-sm">#{exp.id.toString().padStart(3, '0')}</td>
                  <td className="py-6">
                    <p className="font-black text-sm uppercase text-gray-800 dark:text-white">{exp.establecimiento}</p>
                    <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-tighter">{exp.referencia_catastral}</p>
                  </td>
                  <td className="py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${
                      exp.estado_actual === 'F' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {exp.estado_actual === 'F' ? 'Favorable' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-6 flex justify-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${exp.anexo_iv === 'SI' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}>
                      <Shield size={14} fill={exp.anexo_iv === 'SI' ? 'white' : 'transparent'} />
                    </div>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewMap(exp); }}
                      className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                    >
                      <Map size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Database size={48} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">Esperando importación de datos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableView;