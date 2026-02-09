// src/config/schema.js

export const ESTADOS = {
  A: { label: "Pendiente", color: "#FF3B30" }, 
  B1: { label: "Solicitado", color: "#FF9500" }, 
  B2: { label: "Recibido", color: "#5856D6" }, 
  F: { label: "Favorable", color: "#34C759" }, 
  FSV: { label: "Favorable Sin Visita", color: "#32ADE6" }, 
  NP: { label: "No Procede", color: "#8E8E93" }, 
  NT: { label: "No Terminado", color: "#AF52DE" }, 
  CERRADO: { label: "Cerrado", color: "#000000" }, 
  REV: { label: "Revisión PLEIF", color: "#FFCC00" } 
};

export const ROLES = {
  ADMIN: {
    id: "ADMIN",
    label: "Administrador de Vault",
    permissions: ["READ", "WRITE", "DELETE", "EXPORT"]
  },
  TECNICO: {
    id: "TECNICO",
    label: "Técnico de Consulta",
    permissions: ["READ", "EXPORT"]
  }
};

export const MOCK_USERS = [
  { id: "admin_01", username: "comandante", password: "ax1", role: "ADMIN", name: "Comandante Axiom" },
  { id: "tech_01", username: "tecnico", password: "pau", role: "TECNICO", name: "Técnico de Guardia" }
];

export const INITIAL_EXPEDIENTE_FIELDS = {
  tipo: "Forestal",
  top_riesgo: false,
  obligado_rd_393_2007: false,
  apendice_3_om_bomberos: false,
  obligado_reg_sec_esp: "",
  estado_actual: "A",
  fecha_ultimo_movimiento: "",
  entrada_pa_fecha: "",
  soporte_papel: false,
  soporte_cd: false,
  soporte_servidor: false,
  fecha_plan_autop: "",
  caducidad_pau: "",
  fecha_fin_anterior_pa: "",
  tecnico_asignado: "",
  n_expediente_cd: "",
  anexo_iv: false,
  certificado_implantacion: false,
  establecimiento: "",
  titular: "",
  uso_pau: "",
  doc_recibida: "",
  lugar_almacenamiento: "P.C.",
  fecha_simulacro: "",
  ubicacion_fisica: "ARMARIO METALICO",
  observaciones: "",
  n_finca: "",
  solicitada_ultima_revision: "",
  ref_catastral: ""
};