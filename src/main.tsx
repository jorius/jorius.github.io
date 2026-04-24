// packages
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// components
import App from "./App.tsx";

// i18n
import "./i18n";

// styles
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
