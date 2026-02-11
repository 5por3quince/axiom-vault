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
      antialias: true
    });

    const map = mapRef.current;
    map.on('load', () => {
      map.setFog({ 'color': '#000000', 'horizon-blend': 0.1 });
      setTimeout(() => map.resize(), 300); // Forzar re-renderizado
    });

    return () => map.remove();
  }, [selectedExp]);

  return (
    <div className="w-full h-full p-8 bg-[#F5F5F7] dark:bg-black"> {/* Margen Apple Style */}
      <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-8 left-8 glass px-6 py-3 rounded-full border border-white/20 z-10">
          <p className="text-[10px] font-black text-white uppercase tracking-widest">AXIOM M4-TACTICAL ENGINE</p>
        </div>
      </div>
    </div>
  );
};
export default VisorTactico;