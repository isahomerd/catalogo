import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import logo from "./assets/logo.png";

const favicon =
  document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
  document.createElement("link");

favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = logo;

if (!favicon.parentNode) {
  document.head.appendChild(favicon);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
