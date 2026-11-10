const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const mensaje = payload && typeof payload.mensaje === 'string' ? payload.mensaje : `Error HTTP ${response.status}`;
    throw new Error(mensaje);
  }
  return payload as T;
}
