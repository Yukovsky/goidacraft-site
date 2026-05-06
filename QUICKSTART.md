
# RUN BACKEND + FRONTEND

Краткая инструкция по запуску в dev и production.

## DEV

1. Запуск backend:

```bash
node server.js
```

2. Проверка backend:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/server-status
```

3. Запуск фронта:

- Для страницы, открытой через file://, скрипт сам обращается к http://localhost:3000/api/server-status.
- Для локального HTTP-сервера фронта (например http://localhost:5500) также используется локальный backend.

## PRODUCTION

1. Запуск backend на сервере:

```bash
NODE_ENV=production PORT=3000 node server.js
```

2. Рекомендуемый запуск через PM2:

```bash
pm2 start server.js --name goidacraft-cache
pm2 save
```

3. Фронт в production:

- Фронт должен быть доступен по HTTP/HTTPS.
- Путь /api/server-status должен проксироваться на backend (localhost:3000).
- Если прокси не настроен, фронт может использовать fallback на внешний API.

## MINIMAL CHECKLIST

1. Backend отвечает на /health.
2. Backend отдает JSON на /api/server-status.
3. На странице в DevTools -> Network видно запрос к локальному /api/server-status или http://localhost:3000/api/server-status.
