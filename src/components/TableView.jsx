// src/components/TableView.jsx
import React, { useState, useMemo, useRef } from 'react';
import { Upload, ChevronRight, Shield, Search, Filter, Database } from 'lucide-react';

const TableView = ({ data = [], onSelect, onViewMap, onImportExcel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const fileInputRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(exp => {
      const establishment = (exp.establecimiento || '').toLowerCase();
      const ref = (exp.referencia_catastral || '').toLowerCase();
      const matchesSearch = establishment.includes(searchTerm.toLowerCase()) || ref.includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || exp.estado_actual === filterStatus;
      const matchesType = filterType === 'ALL' || exp.tipo === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data, searchTerm, filterStatus, filterType]);

  return (
    <div className="p-8 h-full flex flex-col bg-[#F5F5F7] dark:bg-black overflow-hidden font-sans">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black dark:text-white">
            MATRIZ DE <span className="text-blue-600">CUSTODIA</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Gestión de Expedientes Técnicos PAU
          </p>
        </div>
        
        <div className="flex gap-4">
          <input type="file" ref={fileInputRef} onChange={(e) => onImportExcel(e.target.files[0])} className="hidden" accept=".xlsx, .xls" />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-700 shadow-xl transition-all active:scale-95"
          >
            <Upload size={18} /> Importar Listado .XLS
          </button>
        </div>
      </header>

      {/* Barra de Herramientas Operativa */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por establecimiento, titular o referencia..." 
            className="w-full h-16 pl-14 pr-6 bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] border-none outline-none font-bold text-sm shadow-sm text-black dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="h-16 px-6 bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest outline-none border-none shadow-sm cursor-pointer text-blue-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">TODOS LOS ESTADOS</option>
          <option value="F">FAVORABLES (F)</option>
          <option value="A">PENDIENTES (A)</option>
        </select>

        <select 
          className="h-16 px-6 bg-white dark:bg-[#1C1C1E] rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest outline-none border-none shadow-sm cursor-pointer text-gray-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ALL">TODOS LOS TIPOS</option>
          <option value="Forestal">FORESTAL (PLEIF)</option>
          <option value="Municipal">MUNICIPAL</option>
          <option value="General">GENERAL</option>
        </select>
      </div>

      {/* Contenedor de Tabla blindado */}
      <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner relative">
        <div className="overflow-auto h-full p-8">
          <table className="w-full text-left">
            <thead className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 dark:border-white/5">
              <tr>
                <th className="pb-6 pl-4">EXPEDIENTE / ÁMBITO</th>
                <th className="pb-6">ESTABLECIMIENTO / REF. CATASTRAL</th>
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
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <td className="py-7 pl-4">
                    <p className="text-blue-600 font-black text-sm">#{exp.id.toString().padStart(3, '0')}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">{exp.tipo || 'GENERAL'}</p>
                  </td>
                  <td className="py-7">
                    <p className="font-black text-[13px] uppercase text-gray-800 dark:text-white leading-none mb-1">{exp.establecimiento}</p>
                    <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-tighter">{exp.referencia_catastral}</p>
                  </td>
                  <td className="py-7 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                      exp.estado_actual === 'F' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }`}>
                      {exp.estado_actual === 'F' ? 'Favorable' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-7">
                    <div className="flex justify-center">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${exp.anexo_iv === 'SI' ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-300'}`}>
                        <Shield size={18} fill={exp.anexo_iv === 'SI' ? 'white' : 'transparent'} />
                      </div>
                    </div>
                  </td>
                  <td className="py-7 text-right pr-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewMap(exp); }}
                      className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-32 opacity-20">
              <Database size={64} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Sin registros cargados en el motor de custodia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableView;