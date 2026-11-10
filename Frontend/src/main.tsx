import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary, installGlobalErrorOverlay } from './components/ErrorBoundary';
import './index.css';

// Se instala ANTES de montar React, así incluso un fallo durante el primer
// render (por ejemplo, un import roto que revienta de forma síncrona) queda
// visible en pantalla en lugar de dejar <div id="root"> vacío.
installGlobalErrorOverlay();

const rootEl = document.getElementById('root');

if (!rootEl) {
  // Esto solo pasaría si index.html está corrupto/editado; lo dejamos como
  // último salvavidas fuera de React.
  document.body.innerHTML =
    '<div style="padding:20px;color:#fff;background:#7f1d1d;font-family:monospace">No se encontró #root en index.html</div>';
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
