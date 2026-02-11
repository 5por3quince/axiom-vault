// src/components/TableView.jsx
import React from 'react';
import { Upload, ChevronRight, Shield } from 'lucide-react';

const TableView = ({ data, onSelect, onViewMap, onImportExcel }) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImportExcel) {
      onImportExcel(file);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Matriz de <span className="text-blue-600">Custodia</span></h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 italic">Gestión de Planes de Autoprotección (PAU y PAIF)</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".xlsx, .xls" 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl"
        >
          <Upload size={18} /> Importar Listado .XLS
        </button>
      </header>

      <div className="flex-1 glass rounded-[2.5rem] overflow-hidden border border-white/10">
        <div className="overflow-auto h-full p-6">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="pb-6">Expediente</th>
                <th className="pb-6">Establecimiento / Ref. Catastral</th>
                <th className="pb-6">Estado</th>
                <th className="pb-6">Anexo IV</th>
                <th className="pb-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {data.map((exp) => (
                <tr 
                  key={exp.id} 
                  onClick={() => onSelect(exp)}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-6">
                    <p className="text-blue-600 font-black">#</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{exp.tipo}</p>
                  </td>
                  <td className="py-6">
                    <p className="font-black text-sm uppercase">{exp.establecimiento}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{exp.referencia_catastral}</p>
                  </td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      exp.estado_actual === 'F' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {exp.estado_actual === 'F' ? 'Favorable' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${exp.anexo_iv === 'SI' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                      <Shield size={16} fill={exp.anexo_iv === 'SI' ? 'white' : 'transparent'} />
                    </div>
                  </td>
                  <td className="py-6 text-right">
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
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
              <Upload size={64} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-sm text-center">Inyecte un listado Excel para comenzar la gestión operativa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableView;