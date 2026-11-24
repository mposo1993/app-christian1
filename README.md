# Синай — щоденні 5 хвилин зі Словом

Застосунок для щоденного вивчення Біблії й історії Церкви.

```
frontend/   React + Vite: інтерфейс і ігрова логіка (Three.js для 3D-фону)
backend/    логіка API (Node, MongoDB): збереження прогресу
api/        тонкі обгортки для Vercel Serverless Functions
```

## API

`GET /api/progress?id=<uuid>` повертає `{ data, updatedAt }`
`PUT /api/progress?id=<uuid>` зберігає `{ data, updatedAt }`

Вхід не потрібен: прогрес прив'язаний до анонімного ID пристрою (у `localStorage`).
Без бекенду застосунок працює як раніше, на `localStorage`.

## Змінні середовища

Див. `.env.example`: `MONGODB_URI`, `MONGODB_DB` (задаються у Vercel).

## Локально

```
npm install
npm --prefix frontend install
npm run dev:frontend
```

## Деплой

Vercel збирає `npm run build` у `frontend/dist`, а `api/*.js` стають серверними функціями.
