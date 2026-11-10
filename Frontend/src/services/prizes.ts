import { apiRequest } from './api';
import { getDeviceId } from '@/utils/device';

export interface PrizeDef { id: string; nombre: string; stockInicial: number }

export const PREMIOS: PrizeDef[] = [
  { id: 'skybrill', nombre: 'SkyBrill — Set de collar y aretes', stockInicial: 1 },
  { id: 'aromacielo', nombre: 'Aromacielo — Vela aromática', stockInicial: 1 },
  { id: 'mini-nonitas', nombre: 'Mini Nonitas — Cupón de descuento', stockInicial: 1 },
  { id: 'petzuki', nombre: 'Petzuki — Cupón de descuento para mascotas', stockInicial: 1 },
];

export const CARTAS_VIRTUD = [
  'Fe', 'Esperanza', 'Caridad', 'Prudencia', 'Justicia', 'Fortaleza',
  'Templanza', 'Humildad', 'Paciencia', 'Gratitud', 'Perseverancia', 'Alegría',
];

export const UMBRAL_PREMIO_XP = 1000;
const CLAIM_KEY = 'ziro_premio_ganado';

export function yaGanoPremioFisico(): boolean {
  return localStorage.getItem(CLAIM_KEY) === '1';
}

export async function obtenerInventario(): Promise<Record<string, number>> {
  const response = await apiRequest<{ data: Record<string, number> }>('/prizes/inventory');
  return response.data;
}

export interface Resultado {
  tipo: 'fisico' | 'digital';
  premio?: PrizeDef;
  carta?: string;
  codigo: string;
}

/** La asignación y el control de stock deben realizarse en el backend, nunca en el navegador. */
export async function reclamarPremio(xp: number): Promise<Resultado> {
  const response = await apiRequest<{ data: Resultado }>('/api/prizes/claim', {
    method: 'POST',
    body: JSON.stringify({ xp, deviceId: getDeviceId() }),
  });
  if (response.data.tipo === 'fisico') localStorage.setItem(CLAIM_KEY, '1');
  return response.data;
}

export { getDeviceId };
