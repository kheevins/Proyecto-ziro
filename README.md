# Ziro Web

Proyecto organizado en `Frontend/` (React + TypeScript + Vite). El backend se agregará en `Backend/`.

## Frontend

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

La URL de la API se configura mediante `VITE_API_URL`. Por defecto apunta a `http://localhost:5000/api`.

## Nota de integración

Los servicios `src/services/` ya están preparados para consumir los endpoints del backend: `POST /contacts`, `GET/POST /leaderboard`, `GET /prizes/inventory` y `POST /prizes/claim`. Estos endpoints deben implementarse en Express antes de que esas funciones puedan operar.
