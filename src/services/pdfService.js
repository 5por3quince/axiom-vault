// src/services/pdfService.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Importación directa de la función
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { ESTADOS } from "../config/schema";

export const generateOfficialPDF = async (data) => {
  if (!data || data.length === 0) return;

  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Cabecera Estilo Axiom
    doc.setFillColor(0, 122, 255);
    doc.rect(0, 0, 297, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("AXIOM VAULT • INFORME OFICIAL DE CUSTODIA PAU", 15, 13);

    const rows = data.map(exp => [
      exp.n_expediente_cd,
      (exp.establecimiento || "---").toUpperCase(),
      (exp.titular || "---").toUpperCase(),
      (exp.tecnico_asignado || "NO ASIGNADO").toUpperCase(),
      (ESTADOS[exp.estado_actual]?.label || exp.estado_actual).toUpperCase(),
      exp.anexo_iv ? "SÍ" : "NO",
      exp.ref_catastral || "---"
    ]);

    // LLAMADA CORREGIDA: autoTable(doc, options) en lugar de doc.autoTable
    autoTable(doc, {
      head: [["EXP", "ESTABLECIMIENTO", "TITULAR", "TÉCNICO", "ESTADO", "ANEXO IV", "CATASTRO"]],
      body: rows,
      startY: 25,
      styles: { fontSize: 7, font: "helvetica" },
      headStyles: { fillColor: [40, 40, 40] },
      theme: 'grid'
    });

    // Preparar binario para Tauri
    const pdfArrayBuffer = doc.output("arraybuffer");
    const uint8Array = new Uint8Array(pdfArrayBuffer);

    // Diálogo de guardado
    const path = await save({
      filters: [{ name: "PDF", extensions: ["pdf"] }],
      defaultPath: `AXIOM_REPORTE_${data[0].n_expediente_cd}.pdf`
    });

    if (path) {
      await writeFile(path, uint8Array);
      console.log("PDF Guardado con éxito");
    }
  } catch (error) {
    console.error("Fallo motor PDF:", error);
    alert("Error de motor PDF: Verifique la consola.");
  }
};