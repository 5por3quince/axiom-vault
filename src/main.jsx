import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

console.log("--- AXIOM CORE: INICIALIZANDO RENDERIZADO ---");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("ERROR CRÍTICO: No se encontró el elemento #root");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}