// src/components/VisorTactico.jsx
import React from 'react';

const VisorTactico = ({ selectedExp }) => {
  if (!selectedExp) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
      <p style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '12px' }}>Seleccione objetivo en la matriz</p>
    </div>
  );
  
  const lat = selectedExp.latitud;
  const lng = selectedExp.longitud;
  const name = encodeURIComponent(selectedExp.establecimiento);
  
  // URL calibrada para zoom táctico
  const mapUrl = lat && lng 
    ? `https://maps.google.com/maps?ll=${lat},${lng}&q=${lat},${lng}(${name})&t=k&z=19&hl=es&output=embed`
    : `https://maps.google.com/maps?q=${name},${encodeURIComponent(selectedExp.municipio)},España&t=k&z=18&hl=es&output=embed`;

  return (
    <div style={{ width: '100%', height: '100%', padding: '30px', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#000', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
        <iframe 
          key={selectedExp.id} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          src={mapUrl} 
          allowFullScreen 
          style={{ filter: 'brightness(1.05) contrast(1.02)' }} 
        />
        
        {/* HUD REPOSICIONADO A LA DERECHA */}
        <div style={{ 
          position: 'absolute', 
          top: '25px', 
          right: '25px', // Cambio estratégico de izquierda a derecha
          backgroundColor: 'rgba(28, 28, 30, 0.96)', 
          padding: '20px 25px', 
          borderRadius: '20px', 
          backdropFilter: 'blur(15px)', 
          border: '1px solid rgba(255,255,255,0.12)', 
          maxWidth: '380px', 
          zIndex: 100, 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#34C759', borderRadius: '50%', boxShadow: '0 0 8px #34C759' }} />
            <p style={{ color: '#2563eb', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Rastreador Táctico M4</p>
          </div>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '900', textTransform: 'uppercase', margin: 0, lineHeight: 1.3 }}>
            {selectedExp.establecimiento}
          </h3>
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
             <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>REF: {selectedExp.referencia_principal}</p>
             <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>LOC: {selectedExp.municipio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisorTactico;