import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider.jsx";
import AppRouter from "./router/AppRouter.jsx";

import "./index.css";

// Einstiegspunkt der App
// AuthProvider und BrowserRouter umschließen die gesamte Anwendung
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
