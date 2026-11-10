import { apiRequest } from './api';

export interface Contacto {
  name: string;
  email: string;
  rol: string;
  parroquia: string;
  message: string;
}

export async function enviarContacto(contacto: Contacto): Promise<void> {
  await apiRequest<{ mensaje: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contacto),
  });
}
