# GoidaCraft Site — Next.js

Официальный сайт сервера GoidaCraft, теперь на **Next.js** вместо Express.

## ✨ Возможности

- ✅ **Next.js 13+** — современный React-фреймворк с SSG/SSR
- ✅ **Чистые URLs** — маршруты `/mods`, `/connect`, `/donors`, `/console` без расширений
- ✅ **Статические ассеты** — CSS, JS, изображения, шрифты из `assets/` и `fonts/`
- ✅ **Анимации** — полная поддержка исходных CSS-анимаций и JavaScript
- ✅ **SEO** — Open Graph, JSON-LD, мета-теги, кеширование
- ✅ **API** — Route `/api/static/[...path]` для обслуживания статических файлов

## 🚀 Локальная разработка

### Требования
- Node.js >= 14.0.0
- npm или yarn

### Установка и запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер (горячая перезагрузка)
npm run dev
```

Сервер будет запущен на **http://localhost:3000**

Доступные маршруты:
- `/` — главная
- `/mods` — моды
- `/connect` — подключение
- `/donors` — доноры
- `/console` — консоль

## 🏗️ Сборка для production

```bash
# Собрать проект (создаст .next/ и out/)
npm run build

# Запустить production-сервер
npm start
```

Production-сервер будет доступен на **http://localhost:3000**

## 📦 Развертывание

### Вариант 1: Статическое развертывание (рекомендуется для SEO)

Next.js генерирует полностью статический сайт при сборке (`npm run build`). Все страницы доступны как `.html` файлы в папке `out/`:

```bash
npm run build
# Загрузить содержимое out/ на хостинг (Netlify, Vercel, GitHub Pages и т.д.)
```

### Вариант 2: Node.js сервер

Для динамического обслуживания с Node.js:

```bash
npm run build
npm start
# Развернуть на сервер с Node.js (Heroku, Railway, VPS и т.д.)
```

### Вариант 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📁 Структура проекта

```
.
├── pages/
│   ├── api/
│   │   └── static/[...path].js     # Route для обслуживания assets/
│   ├── _app.js                     # App layout (загружает styles.css)
│   ├── index.js                    # Главная страница
│   ├── mods.js                     # Страница модов (опционально)
│   ├── connect.js                  # Страница подключения (опционально)
│   ├── donors.js                   # Страница доноров (опционально)
│   └── console.js                  # Консоль (опционально)
├── assets/                         # Статические ассеты (CSS, JS, изображения)
│   ├── styles.css
│   ├── decor.js
│   ├── donors-data.js
│   ├── prefetch.js
│   ├── server-status.js
│   ├── cursor/
│   └── img/
├── fonts/                          # Шрифты
├── public/                         # Папка для статики (может быть пуста)
├── next.config.js                  # Конфиг Next.js (rewrites, etc.)
├── package.json                    # Зависимости и скрипты
└── README.md                       # Этот файл
```

## ⚙️ Конфигурация

### next.config.js

Переписывает маршруты для обслуживания исходных `.html` файлов через Next.js API:

```javascript
async rewrites() {
  return [
    { source: '/assets/:path*', destination: '/api/static/assets/:path*' },
    { source: '/fonts/:path*', destination: '/api/static/fonts/:path*' },
    { source: '/mods', destination: '/api/static/mods.html' },
    { source: '/connect', destination: '/api/static/connect.html' },
    { source: '/donors', destination: '/api/static/donors.html' },
    { source: '/console', destination: '/api/static/console.html' },
  ];
}
```

## 🔄 Миграция со старого сайта

Старый Express-сервер полностью заменён на Next.js. Все функции сохранены:

- ✅ Все CSS-анимации работают (подключены в `pages/_app.js`)
- ✅ Все JavaScript-скрипты доступны из `assets/` (загружаются через API)
- ✅ Все маршруты сохранены (реализованы как rewrites)
- ✅ SEO метаэлементы и Open Graph интегрированы

## 🐛 Проблемы и решения

### Маршруты не работают?

Убедитесь, что `next.config.js` содержит все необходимые rewrites. Перезагрузите dev-сервер:

```bash
npm run dev
```

### CSS не загружается?

Проверьте, что `assets/styles.css` подключён в `pages/_app.js`:

```javascript
import '../assets/styles.css'
```

### Старые HTML файлы больше не нужны?

Да, все `.html` файлы (`index.html`, `mods.html` и т.д.) теперь обслуживаются через Next.js API. Вы можете оставить их на месте для комфорта или удалить позже.

## 📚 Ссылки

- [Next.js Документация](https://nextjs.org/docs)
- [React Документация](https://react.dev)
- [Развертывание на Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Развертывание на Netlify](https://docs.netlify.com/frameworks/next-js/overview/)

## 📝 Лицензия

MIT

---

**Гойдакрафт Команда** — 2026 🚂
