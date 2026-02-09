import React, { useState, useMemo } from 'react';
import { Search, Shield, FileUp, ChevronRight, Hash } from 'lucide-react';
import { ESTADOS } from '../config/schema';
import * as XLSX from 'xlsx';
import { open } from '@tauri-apps/plugin-dialog';

const TableView = ({ data = [], onSelectExp, onImportData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleImportListado = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
      });
      
      if (selected) {
        // En Tauri, necesitamos leer el archivo como array buffer
        const response = await fetch(selected);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Protocolo de mapeo Axiom
        const mappedData = jsonData.map(item => ({
          n_expediente_cd: item["Nº EXPEDIENTE"] || "000",
          establecimiento: item["ESTABLECIMIENTO"] || "SIN NOMBRE",
          titular: item["TITULAR"] || "",
          estado_actual: item["ESTADO"] || "A",
          ref_catastral: item["REF. CATASTRAL"] || "",
          tipo: item["TIPO"] || "Forestal",
          anexo_iv: item["ANEXO IV"] === "SI"
        }));

        onImportData(mappedData);
        alert(`MATRIZ ACTUALIZADA: ${mappedData.length} registros importados.`);
      }
    } catch (err) {
      console.error("Error XLS:", err);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.establecimiento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.n_expediente_cd?.toString().includes(searchTerm) ||
      item.ref_catastral?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1c1c1e]">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
            placeholder="Buscar por nombre, expediente o referencia catastral..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleImportListado}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
        >
          <FileUp size={20} /> IMPORTAR LISTADO .XLS
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6">
        <table className="w-full border-separate border-spacing-y-2 min-w-[1000px]">
          <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 bg-white/90 py-4 z-10">
            <tr>
              <th className="px-6 py-4 text-left">Expediente</th>
              <th className="px-6 py-4 text-left">Establecimiento / Ref. Catastral</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-center">Anexo IV</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((exp) => (
              <tr key={exp.n_expediente_cd} onClick={() => onSelectExp(exp)} className="group bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer rounded-2xl">
                <td className="px-6 py-5 rounded-l-2xl">
                  <span className="text-xs font-black text-blue-600">#{exp.n_expediente_cd}</span>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{exp.tipo}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-sm uppercase">{exp.establecimiento}</div>
                  <div className="text-[10px] font-mono text-blue-500 mt-1">{exp.ref_catastral || "SIN REFERENCIA"}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase" style={{ backgroundColor: `${ESTADOS[exp.estado_actual]?.color}15`, color: ESTADOS[exp.estado_actual]?.color }}>
                    {ESTADOS[exp.estado_actual]?.label}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  {exp.anexo_iv ? <div className="shield-active w-8 h-8 flex items-center justify-center mx-auto shadow-green-500/20"><Shield size={14}/></div> : <Shield size={14} className="text-gray-200 mx-auto" />}
                </td>
                <td className="px-6 py-5 rounded-r-2xl text-right"><ChevronRight className="inline text-gray-300 group-hover:text-blue-600 transition-all" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;