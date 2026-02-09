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
      center: [-4.4214, 36.7213],
      zoom: 12,
      pitch: 45,
      antialias: true,
      preserveDrawingBuffer: true // Ayuda a renderizar en diferentes GPUs
    });

    const map = mapRef.current;

    map.on('load', () => {
      // Triple disparo de redimensionado para asegurar el chip M4/PC GPU
      map.resize();
      setTimeout(() => map.resize(), 500);
      setTimeout(() => map.resize(), 2000);
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (selectedExp && mapRef.current) {
      const mockLng = -4.4214 + (Math.random() - 0.5) * 0.03;
      const mockLat = 36.7213 + (Math.random() - 0.5) * 0.03;
      mapRef.current.on('style.load', () => {
  mapRef.current.setFog({}); // Añade atmósfera (estética Apple)
  setTimeout(() => {
    mapRef.current.resize();
  }, 100);
});
      new mapboxgl.Marker({ color: selectedExp.anexo_iv ? '#34C759' : '#FF3B30' }).setLngLat([mockLng, mockLat]).addTo(mapRef.current);
    }
  }, [selectedExp]);

  return <div ref={mapContainerRef} className="map-master-container absolute inset-0 w-full h-full" />;
};

export default VisorTactico;