// src/components/VisorTactico.jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam10cmlndWVybyIsImEiOiJjbHN2eHR3NGwwN3BvMnFvMGpsb2Z2cXBzIn0.tW7f_eN7-3Zt-2-D_7_TUA';

const VisorTactico = ({ selectedExp }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: selectedExp ? [selectedExp.longitud, selectedExp.latitud] : [-4.4214, 36.7213],
      zoom: selectedExp ? 18 : 12,
      pitch: 60,
      antialias: true,
      fadeDuration: 0 // Mejora respuesta en M4
    });

    const map = mapRef.current;
    map.on('load', () => {
      map.setFog({ 'color': '#000000', 'horizon-blend': 0.1 });
      // Truco crítico para evitar pantalla blanca tras transición
      setTimeout(() => map.resize(), 100);
      setTimeout(() => map.resize(), 1000);
    });

    return () => map.remove();
  }, [selectedExp]);

  return (
    <div className="w-full h-full p-10 bg-[#F5F5F7] dark:bg-black overflow-hidden">
      <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-8 left-8 glass px-6 py-3 rounded-full border border-white/20 z-10 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AXIOM M4-TACTICAL ENGINE</p>
        </div>
      </div>
    </div>
  );
};
export default VisorTactico;