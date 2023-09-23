import React from "react";
import ReactDOM from "react-dom/client";
import importIcons from "./cache-icons.ts";
import "./main.css";
import "@elastic/eui/dist/eui_theme_dark.css";
import { App } from "./App.tsx";

importIcons();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
