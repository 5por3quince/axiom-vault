// src/components/VisorTactico.jsx
import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';

const VisorTactico = ({ selectedExp }) => {
  // Generamos la URL de Google Maps para el expediente seleccionado
  const lng = selectedExp?.longitud || -4.4214;
  const lat = selectedExp?.latitud || 36.7213;
  const zoom = selectedExp ? 19 : 13;
  
  // URL de Google Maps embebido (Mucho más estable que Mapbox en entornos Desktop Tauri)
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=TU_API_KEY_AQUI&center=${lat},${lng}&zoom=${zoom}&maptype=satellite`;
  
  // Alternativa sin API Key para pruebas rápidas (URL de búsqueda directa)
  const fallbackUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&t=k&output=embed`;

  return (
    <div className="w-full h-full p-8 bg-[#F5F5F7] dark:bg-black overflow-hidden flex flex-col">
      <div className="relative flex-1 rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
        <iframe
          title="Tactical Viewer"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={fallbackUrl}
          allowFullScreen
          className="opacity-90 grayscale-[20%] brightness-110"
        />
        
        {/* HUD Táctico Superior */}
        <div className="absolute top-10 left-10 right-10 flex justify-between items-start pointer-events-none">
          <div className="glass px-6 py-4 rounded-[2rem] border border-white/20 pointer-events-auto shadow-2xl backdrop-blur-3xl">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
              <div>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Localización Táctica Activa</p>
                <h3 className="text-white font-black text-lg uppercase truncate max-w-[300px]">
                  {selectedExp?.establecimiento || "VISTA GENERAL DEL SECTOR"}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="glass px-4 py-2 rounded-full border border-white/20 text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            M4-TACTICAL ENGINE
          </div>
        </div>
      </div>
      
      {/* Footer informativo opcional */}
      <div className="mt-6 px-4 flex justify-between items-center opacity-40">
        <p className="text-[9px] font-bold uppercase text-gray-500">Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
        <p className="text-[9px] font-bold uppercase text-gray-500">Capa: Satélite Alta Resolución</p>
      </div>
    </div>
  );
};

export default VisorTactico;