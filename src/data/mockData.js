import { INITIAL_EXPEDIENTE_FIELDS } from '../config/schema';

const REAL_DATA = [
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "1", establecimiento: "URBANIZACION EL CANDADO", titular: "COMUNIDAD DE PROPIETARIOS EL CANDADO", tipo: "Forestal", estado_actual: "REV", anexo_iv: true, ref_catastral: "VARIOS" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "13", establecimiento: "PARADOR MALAGA GIBRALFARO", titular: "PARADORES DE TURISMO DE ESPAÑA S.A.", tipo: "Forestal", estado_actual: "F", anexo_iv: true, ref_catastral: "4153103UF7645S" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "30", establecimiento: "PALACIO DE FERIAS Y CONGRESOS", titular: "AYUNTAMIENTO DE MALAGA", tipo: "Municipal", estado_actual: "F", anexo_iv: true, ref_catastral: "9533703UF6693S", uso_pau: "PÚBLICA CONCURRENCIA" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "83", establecimiento: "MUSEO PICASSO DE MALAGA", titular: "MUSEO PICASSO DE MALAGA", tipo: "Municipal", estado_actual: "B2", anexo_iv: true, ref_catastral: "3451317UF7635S" },
];

export const getFullInventory = () => {
  const inventory = [...REAL_DATA];
  for (let i = inventory.length; i < 2152; i++) {
    inventory.push({
      ...INITIAL_EXPEDIENTE_FIELDS,
      n_expediente_cd: (i + 1).toString(),
      establecimiento: `EXPEDIENTE TÉCNICO ${i + 1}`,
      tipo: i % 2 === 0 ? "Forestal" : "Municipal",
      estado_actual: "A",
      ref_catastral: `7000000UF${100000 + i}`
    });
  }
  return inventory;
};