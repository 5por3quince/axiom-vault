// src/services/dataProcessor.js

export const processAxiomData = (rawData) => {
  console.time('M4_Processing_Power');
  
  const processed = rawData.map(item => {
    // Validación de la Línea Roja: Si no tiene Ref Catastral o ID, marcar alerta
    const isCritical = !item.ref_catastral || item.estado_actual === 'A';
    
    return {
      ...item,
      // Normalización de campos administrativos
      establecimiento: item.establecimiento?.toUpperCase() || "SIN NOMBRE",
      titular: item.titular || "PROPIEDAD DESCONOCIDA",
      // Lógica de Anexo IV: Prioridad visual
      priority: item.anexo_iv ? 1 : (isCritical ? 2 : 3)
    };
  });

  console.timeEnd('M4_Processing_Power');
  return processed.sort((a, b) => a.priority - b.priority);
};