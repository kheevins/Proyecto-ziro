import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

/**
 * Red de seguridad global: si cualquier componente hijo lanza durante el render,
 * en un lifecycle method o en un constructor, React desmonta todo el árbol y
 * `<div id="root">` queda vacío ("pantalla en blanco"). Este ErrorBoundary
 * intercepta ese crash y muestra el error en pantalla en vez de nada.
 *
 * Límite importante: los Error Boundaries de React SOLO capturan errores de
 * render/lifecycle de sus hijos. NO capturan errores dentro de event handlers
 * (onClick, onChange, etc.) ni de código async fuera de render (promesas,
 * setTimeout). Por eso este archivo también instala listeners globales de
 * `window.onerror` y `unhandledrejection`, para que un crash async o de un
 * handler tampoco deje la pantalla en blanco sin explicación.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] crash capturado:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, info } = this.state;
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: '#450a0a',
            color: '#fff',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            overflowY: 'auto',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              border: '2px solid #ef4444',
              borderRadius: 12,
              padding: '16px',
              background: '#7f1d1d',
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: 0.5, color: '#fecaca' }}>
              ⚠️ ERROR EN LA APLICACIÓN
            </p>
            <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 600, wordBreak: 'break-word' }}>
              {error?.name ?? 'Error'}: {error?.message ?? 'Error desconocido'}
            </p>

            {error?.stack && (
              <>
                <p style={{ margin: '14px 0 4px', fontSize: 11, color: '#fecaca', fontWeight: 700 }}>STACK TRACE</p>
                <pre
                  style={{
                    margin: 0,
                    fontSize: 11,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '10px',
                    borderRadius: 8,
                    maxHeight: '35vh',
                    overflowY: 'auto',
                  }}
                >
                  {error.stack}
                </pre>
              </>
            )}

            {info?.componentStack && (
              <>
                <p style={{ margin: '14px 0 4px', fontSize: 11, color: '#fecaca', fontWeight: 700 }}>
                  COMPONENT STACK
                </p>
                <pre
                  style={{
                    margin: 0,
                    fontSize: 11,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '10px',
                    borderRadius: 8,
                    maxHeight: '25vh',
                    overflowY: 'auto',
                  }}
                >
                  {info.componentStack}
                </pre>
              </>
            )}

            <button
              onClick={this.handleReload}
              style={{
                marginTop: 16,
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                border: 'none',
                background: '#fecaca',
                color: '#7f1d1d',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Muestra la misma caja roja para errores que un ErrorBoundary de React
 * NUNCA puede atrapar: excepciones síncronas en event handlers y promesas
 * rechazadas sin catch en cualquier parte del árbol. Sin esto, esos casos
 * solo aparecen en la consola y la UI parece "congelada" o en blanco.
 * Se instala una sola vez, antes de montar React, desde main.tsx.
 */
export function installGlobalErrorOverlay() {
  const showOverlay = (title: string, detail: string) => {
    if (document.getElementById('__ziro_global_error_overlay')) return; // no duplicar
    const el = document.createElement('div');
    el.id = '__ziro_global_error_overlay';
    el.style.cssText =
      'position:fixed;inset:0;z-index:999999;background:#450a0a;color:#fff;font-family:ui-monospace,Menlo,monospace;overflow-y:auto;padding:16px;box-sizing:border-box;';
    el.innerHTML = `
      <div style="border:2px solid #ef4444;border-radius:12px;padding:16px;background:#7f1d1d;">
        <p style="margin:0;font-size:14px;font-weight:700;letter-spacing:.5px;color:#fecaca;">⚠️ ${title}</p>
        <pre style="margin:10px 0 0;font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,.25);padding:10px;border-radius:8px;max-height:60vh;overflow-y:auto;">${detail.replace(
          /</g,
          '&lt;'
        )}</pre>
        <button onclick="window.location.reload()" style="margin-top:16px;width:100%;padding:12px;border-radius:8px;border:none;background:#fecaca;color:#7f1d1d;font-weight:700;font-size:14px;">Recargar página</button>
      </div>`;
    document.body.appendChild(el);
  };

  window.addEventListener('error', (e) => {
    showOverlay('ERROR NO CAPTURADO', `${e.message}\n\n${e.error?.stack ?? '(sin stack disponible)'}`);
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    const detail = reason instanceof Error ? reason.stack ?? reason.message : String(reason);
    showOverlay('PROMESA RECHAZADA SIN CAPTURAR', detail);
  });
}
