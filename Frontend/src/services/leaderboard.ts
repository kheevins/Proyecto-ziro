import { apiRequest } from './api';
import { getDeviceId } from '@/utils/device';

export interface Puntaje { nombre: string; puntaje: number }

/** Envía el mejor puntaje del dispositivo al backend. */
export async function guardarPuntaje(puntaje: Puntaje): Promise<void> {
  await apiRequest<{ mensaje: string }>('/api/leaderboard', {
    method: 'POST',
    body: JSON.stringify({ ...puntaje, deviceId: getDeviceId() }),
  });
}

/** Obtiene los diez mejores puntajes desde el backend. */
export async function obtenerTop10(): Promise<Puntaje[]> {
  const data = await apiRequest<{ data: Puntaje[] }>('/api/leaderboard?limit=10');
  return data.data;
}
