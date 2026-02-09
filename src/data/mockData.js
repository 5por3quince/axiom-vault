// src/data/mockData.js
import { INITIAL_EXPEDIENTE_FIELDS } from '../config/schema';

const REAL_DATABASE = [
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "1", establecimiento: "URBANIZACION EL CANDADO", titular: "COMUNIDAD DE PROPIETARIOS EL CANDADO", tipo: "Forestal", estado_actual: "REV", anexo_iv: true, ref_catastral: "VARIOS", caducidad_pau: "2022-06" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "3", establecimiento: "ENTIDAD PINOS DEL LIMONAR", titular: "COMUNIDAD DE PROPIETARIOS", tipo: "Forestal", estado_actual: "NT", ref_catastral: "4764105UF7646S" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "4", establecimiento: "URBANIZACION EL MAYORAZGO", tipo: "Forestal", estado_actual: "NT" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "5", establecimiento: "PALACIO MONTE MIRAMAR", titular: "LUIS LOPEZ DE URALDE VIURET", tipo: "Forestal", estado_actual: "REV", anexo_iv: true, ref_catastral: "5558521UF7655N" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "6", establecimiento: "MONTE MIRAMAR", tipo: "Forestal", estado_actual: "REV" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "7", establecimiento: "URBANIZACION HACIENDA DE MIRAMAR", titular: "COMUNIDAD DE PROPIETARIOS", tipo: "Forestal", estado_actual: "REV", ref_catastral: "5558503UF7655N" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "10", establecimiento: "SEMINARIO OBISPADO DE MALAGA", titular: "OBISPADO DE MALAGA", tipo: "Forestal", estado_actual: "B1", ref_catastral: "29900A01400136" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "11", establecimiento: "CASTILLO DE GIBRALFARO", tipo: "Forestal", estado_actual: "NT", ref_catastral: "4153101UF7645S" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "12", establecimiento: "COLEGIO SAGRADA FAMILIA- EL MONTE", titular: "COLEGIO SAGRADA FAMILIA EL MONTE", tipo: "Forestal", estado_actual: "REV", ref_catastral: "4356101UF7645N" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "13", establecimiento: "PARADOR MALAGA GIBRALFARO", titular: "PARADORES DE TURISMO DE ESPAÑA S.A.", tipo: "Forestal", estado_actual: "F", anexo_iv: true, ref_catastral: "4153103UF7645S" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "14", establecimiento: "URBANIZACION LA ALCAZABA", titular: "COMUNIDAD DE PROPIETARIOS", tipo: "Forestal", estado_actual: "NT", ref_catastral: "VARIOS" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "18", establecimiento: "URBANIZACION PINARES DE SAN ANTON", titular: "COMUNIDAD DE PROPIETARIOS", tipo: "Forestal", estado_actual: "F", anexo_iv: true, ref_catastral: "VARIOS" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "19", establecimiento: "CENTRO ASISTENCIAL SAN JUAN DE DIOS", titular: "ORDEN HOSPITALARIA SAN JUAN DE DIOS", tipo: "Forestal", estado_actual: "F", anexo_iv: true, ref_catastral: "3092901UF7639S" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "30", establecimiento: "PALACIO DE FERIAS Y CONGRESOS", titular: "AYUNTAMIENTO DE MALAGA", tipo: "Municipal", estado_actual: "F", anexo_iv: true, ref_catastral: "9533703UF6693S", uso_pau: "PÚBLICA CONCURRENCIA" },
  { ...INITIAL_EXPEDIENTE_FIELDS, n_expediente_cd: "83", establecimiento: "MUSEO PICASSO DE MALAGA", titular: "MUSEO PICASSO DE MALAGA", tipo: "Municipal", estado_actual: "B2", anexo_iv: true, ref_catastral: "3451317UF7635S", uso_pau: "PÚBLICA CONCURRENCIA" },
];

export const getFullInventory = () => {
  const inventory = [...REAL_DATABASE];
  const remaining = 2152 - inventory.length;
  for (let i = 0; i < remaining; i++) {
    inventory.push({
      ...INITIAL_EXPEDIENTE_FIELDS,
      n_expediente_cd: (4000 + i).toString(),
      establecimiento: `REGISTRO TÉCNICO COMPLEMENTARIO ${i + 1}`,
      tipo: i % 2 === 0 ? "Forestal" : "Municipal",
      estado_actual: "A",
      ref_catastral: `7000000UF${100000 + i}`
    });
  }
  return inventory;
};