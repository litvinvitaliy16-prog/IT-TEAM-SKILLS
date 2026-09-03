# ⚡ IT TEAM SKILLS // MATRIX CONTROL NODE

Микросервис управления разработчиками и навыками (M2M связь) на базе **FastAPI (async)**, **SQLAlchemy 2.0**, **Pydantic 2.0** и **SQLite**, с интерактивным SPA фронтендом в стилистике фильма **«Матрица»** (React 18, Canvas Digital Rain, Web Audio).

---

## 📋 Что необходимо для запуска (Prerequisites)

У пользователя должен быть установлен **ОДИН** из вариантов:

### Вариант 1 (Рекомендуемый для всех): **Docker Desktop**
* [Скачать Docker Desktop для Windows/Mac/Linux](https://www.docker.com/products/docker-desktop/)
* Больше ничего устанавливать не нужно (ни Python, ни библиотеки — всё упаковано внутри).

### Вариант 2 (Без Docker — локально на Python):
* **Python 3.10+** (проверить: `python --version`)
* Любой современный веб-браузер (Chrome, Edge, Firefox).

---

## 🚀 Вариант А: Запуск через Docker (самый простой)

1. Откройте терминал (PowerShell / CMD / Bash) в папке проекта.
2. Выполните команду сборки и запуска:
   ```bash
   docker compose up -d --build
   ```
3. Готово! Сервис запущен:
   * **Swagger Документация API**: [http://localhost:8080/docs](http://localhost:8080/docs)
   * **Веб-интерфейс**: откройте файл `frontend/index.html` в браузере (или перейдите на [http://localhost:8080/](http://localhost:8080/), если подключен `StaticFiles`).

#### Полезные команды Docker:
* Остановить контейнер: `docker compose down`
* Посмотреть логи бэкенда: `docker compose logs -f`

---

## 🐍 Вариант Б: Запуск без Docker (на чистом Python)

1. Установите зависимости бэкенда:
   ```bash
   pip install -r requirements.txt
   ```
2. Запустите бэкенд:
   ```bash
   python main.py
   ```
   *Сервер FastAPI запустится на порту `8080` (`http://localhost:8080`).*
3. Откройте фронтенд:
   * Просто дважды кликните по файлу `frontend/index.html` в проводнике и откройте его в браузере.

---

## 📁 Структура проекта

```text
IT TEAM SKILLS/
├── Dockerfile              # Рецепт сборки Docker-образа с Python 3.11
├── docker-compose.yml      # Конфигурация запуска контейнера и проброса портов
├── requirements.txt        # Список зависимостей Python
├── database.py             # Настройка асинхронного движка SQLAlchemy и сессий
├── dependencies.py         # FastAPI зависимости для DI (сессия БД, валидация по ID)
├── main.py                 # Точка входа FastAPI, Lifespan и CORS
├── models.py               # SQLAlchemy модели Developers, Skills и ассоциативная таблица
├── schemas.py              # Pydantic 2.0 схемы входных и выходных данных
├── routers/
│   ├── dev_router.py       # Эндпоинты управления разработчиками и связями M2M
│   └── skils_router.py     # Эндпоинты управления навыками
│
└── frontend/               # Фронтенд-приложение (SPA в стиле Матрицы)
    ├── index.html          # Главная HTML-страница
    ├── css/
    │   └── matrix.css      # Неоновые стили, сканлайны, бейджи грэйдов
    └── js/
        ├── api.js          # Клиент запросов к FastAPI
        ├── matrixRain.js   # Canvas-анимация падающих зеленых символов (Digital Rain)
        ├── matrixAvatar.js # Canvas-генератор и фотофильтр
        ├── terminalAudio.js# Синтезатор звуков винтажной клавиатуры (Web Audio)
        └── app.js          # React 18 SPA дашборд
```

---

## 🎯 Основные эндпоинты API

* `POST /api/dev/create` — Создать нового разработчика
* `GET /api/dev/all` — Получить список всех разработчиков со скиллами
* `GET /api/dev/developer_by_id/{id}` — Получить одного разработчика по ID
* `POST /api/dev/join_skill/{dev_id}/{skill_id}` — Привязать скилл к разработчику (M2M)
* `DELETE /api/dev/skill_join_delete/{dev_id}/{skill_id}` — Отвязать скилл от разработчика
* `DELETE /api/dev/{id}` — Удалить разработчика
* `POST /api/skills/create` — Создать новый скилл
* `GET /api/skills/all` — Получить список всех скиллов
* `DELETE /api/skills/{id}` — Удалить скилл

