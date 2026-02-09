import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/apple-theme.css";
import "./App.css"; // Inyectamos las correcciones estructurales

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);