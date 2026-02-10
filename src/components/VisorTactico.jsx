// src/components/VisorTactico.jsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ExternalLink, MapPin, Navigation, Maximize2, ShieldCheck, AlertCircle } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam10cmlndWVybyIsImEiOiJjbHN2eHR3NGwwN3BvMnFvMGpsb2Z2cXBzIn0.tW7f_eN7-3Zt-2-D_7_TUA';

const VisorTactico = ({ selectedExp }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicialización del Mapa optimizada para GPU M4
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-4.4214, 36.7213], // Coordenadas base (Málaga/Referencia)
      zoom: 12,
      pitch: 60, // Ángulo cinemático Apple
      bearing: -17,
      antialias: true,
      preserveDrawingBuffer: true
    });

    const map = mapRef.current;

    map.on('load', () => {
      setMapLoaded(true);
      // Configuración de atmósfera Apple Deep Satellite
      map.setFog({
        'range': [1, 10],
        'color': '#000000',
        'horizon-blend': 0.1,
        'high-color': '#245bde',
        'space-color': '#000000',
        'star-intensity': 0.15
      });

      // Triple disparo de redimensionado para estabilidad en arquitectura M4
      map.resize();
      setTimeout(() => map.resize(), 500);
      setTimeout(() => map.resize(), 2000);
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    return () => {
      if (markerRef.current) markerRef.current.remove();
      map.remove();
    };
  }, []);

  // Lógica de Posicionamiento Táctico y Street View
  useEffect(() => {
    if (selectedExp && mapRef.current && mapLoaded) {
      const map = mapRef.current;
      
      // En producción, aquí se resolvería la geocodificación por Ref. Catastral
      // Por ahora, usamos coordenadas del expediente si existen o fallback
      const lng = selectedExp.longitud || -4.4214;
      const lat = selectedExp.latitud || 36.7213;

      // Limpiar marcador previo
      if (markerRef.current) markerRef.current.remove();

      // Crear Marcador Personalizado según Anexo IV
      const el = document.createElement('div');
      el.className = `w-8 h-8 rounded-full border-4 border-white shadow-2xl flex items-center justify-center ${
        selectedExp.anexo_iv === 'SI' ? 'bg-green-500' : 'bg-red-600'
      } animate-pulse`;
      el.innerHTML = `<div class="w-2 h-2 bg-white rounded-full"></div>`;

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);

      // Vuelo cinemático al expediente
      map.flyTo({
        center: [lng, lat],
        zoom: 18,
        pitch: 75,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  }, [selectedExp, mapLoaded]);

  // Función para abrir Street View basado en ubicación del expediente
  const openStreetView = () => {
    if (!selectedExp) return;
    const lat = selectedExp.latitud || 36.7213;
    const lng = selectedExp.longitud || -4.4214;
    const query = encodeURIComponent(`${selectedExp.establecimiento} ${selectedExp.referencia_catastral}`);
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[2.5rem]">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      
      {/* HUD de Información Apple Style */}
      {selectedExp && (
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="glass p-6 rounded-[2rem] border border-white/20 shadow-2xl max-w-md pointer-events-auto animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-2">
              {selectedExp.anexo_iv === 'SI' ? (
                <ShieldCheck className="text-green-500" size={24} />
              ) : (
                <AlertCircle className="text-red-500" size={24} />
              )}
              <h2 className="text-white font-black text-xl tracking-tighter uppercase truncate">
                {selectedExp.establecimiento || 'Sin Identificar'}
              </h2>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              Ref: {selectedExp.referencia_catastral || 'N/A'}
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={openStreetView}
                className="flex-1 bg-white text-black h-12 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
              >
                <Navigation size={16} /> Street View
              </button>
              <button className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

          <div className="glass px-4 py-2 rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Live Vault Feed
          </div>
        </div>
      )}

      {/* Brújula y Estado del Chip */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="flex flex-col gap-2">
          <div className="glass p-3 rounded-2xl border border-white/10 text-[9px] font-black text-gray-500 uppercase vertical-lr tracking-widest">
            AXIOM M4-ENGINE
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisorTactico;