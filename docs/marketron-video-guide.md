# Marketron: инструкция для видео о Sofinka

Цель: за 1:45–1:55 показать работающий продукт, модель данных, связь UI с сервером и одно техническое решение. Лимит из письма — 2 минуты, запись экрана с включённой веб-камерой.

Основная история: пользователь работает с вопросами → типизированный UI отправляет параметры генерации → сервер обращается к OpenRouter и обрабатывает ответ → вопросы сохраняются отдельно для каждого языка.

**Подготовка перед записью**

1. Запусти приложение из корня проекта: `pnpm dev`. Открой адрес, который напечатает Vite. При проверке 3 ноября это был `http://127.0.0.1:3000`; порт из README может отличаться.
2. Открой две вкладки одного запущенного приложения: `/en` и `/en/constructor`. Во второй нажми `Generate` и оставь диалог открытым. Во время записи достаточно показать его параметры.
3. В первой вкладке найди `What is 2 + 2?`. Во время записи выбери `4` и нажми `Check`. Если вопрос уже отвечен, заранее нажми `Try again`. Если в твоём браузере другой набор вопросов, выбери знакомый вопрос из него.
4. Открой в VS Code четыре файла из таблицы ниже и расположи вкладки в этом порядке. Увеличь шрифт до читаемого размера, закрой лишние панели. В Quick Open (`Cmd+P`) можно вставить `путь:строка` из инструкции.
5. Подготовь запись экрана, микрофона и веб-камеры. Помести камеру так, чтобы она не закрывала код. Отключи уведомления и закрой личные вкладки. Оставь `.env` закрытым: достаточно показать в коде имя переменной `OPENROUTER_API_KEY`.
6. Дважды проговори текст с таймером, одновременно переключая экраны. Время в таблице — ориентир; целевой результат — до 1:55. Если речь выходит длиннее, используй сокращения в конце инструкции.

**Маршрут записи**

| Время | Экран / файл | На что обратить внимание |
| --- | --- | --- |
| 0:00–0:20 | Браузер: `/en` → подготовленная вкладка `/en/constructor` | Ответ `4` → `Check`; затем параметры в диалоге `Generate questions` |
| 0:20–0:40 | `src/components/questions/question-types.ts` | Пример интерфейса с полем `type`, затем объединение `Question` |
| 0:40–0:58 | `src/components/constructor/generate-questions-dialog.tsx` | Внутренний API и `useMutation` |
| 0:58–1:27 | `src/routes/api/generate-questions.ts` | Серверный запрос к OpenRouter, затем парсинг и нормализация |
| 1:27–1:50 | `src/lib/questions-storage.ts` | Ключ с языком, сохранение; короткое упоминание тестов |

**Шаг 1. Показать результат — браузер, 0:00–0:20**

Начни с интерфейса викторины. Пока представляешь проект, выбери `4` и нажми `Check`: появится `Correct. Great work.` Затем переключись на заранее открытую вкладку конструктора с диалогом генерации. Покажи поля Topic, Age, Count и Question type. Язык берётся из текущего языка приложения.

Текст:

> Hi, I'm Mykhailo. This is Sofinka, my multilingual quiz app for children. It includes a question editor and AI generation. I'll walk through the data flow from the interface to the server.

Смысл: сразу дать контекст продукта и обозначить технический маршрут. Генерацию заранее проверяй отдельно, если хочешь ею пользоваться; в основном сценарии видео отправка запроса не нужна.

**Шаг 2. Объяснить стек и модель — `question-types.ts`, 0:20–0:40**

Quick Open: `src/components/questions/question-types.ts:85`.

Покажи `ImageChoiceQuestion` с `type: "image-choice"`, затем `export type Question` на строке 102. Достаточно указать на код курсором, без чтения всех девяти вариантов.

Текст:

> React provides reusable question components, and TypeScript helps catch data-shape mistakes. TanStack Start provides routing and server endpoints. Questions use a discriminated union covering nine types, so each format has its own structure.

Смысл: React позволяет собирать повторно используемые компоненты; TypeScript различает варианты вопроса по полю `type`. Например, у matching есть `pairs`, а у image-choice — `options` с изображениями. Это объясняет выбор технологий через конкретную задачу.

**Шаг 3. Показать запрос из UI — `generate-questions-dialog.tsx`, 0:40–0:58**

Quick Open: `src/components/constructor/generate-questions-dialog.tsx:55`.

Укажи на `fetch("/api/generate-questions", ...)`, затем немного прокрути к `useMutation` на строке 86: `onSuccess` передаёт вопросы через `onGenerated`, закрывает диалог и показывает уведомление; `onError` показывает ошибку. Состояние `isPending` используется ниже для кнопки загрузки.

Текст:

> This dialog sends the topic, age, language, count, and question type to our API. TanStack Query mutations handle loading, success, and errors, keeping that request state out of the form logic.

Смысл: разделить ответственность интерфейса и сервера и показать управляемые состояния асинхронного запроса. Перечень полей виден в интерфейсе `GenerateQuestionsRequest` на строке 37; объект запроса собирается на строке 103.

**Шаг 4. Показать сервер и сложную часть — `generate-questions.ts`, 0:58–1:27**

Quick Open: `src/routes/api/generate-questions.ts:50`.

Сначала покажи запрос к OpenRouter и `Authorization` с `process.env.OPENROUTER_API_KEY`. Здесь виден код обращения к ключу, его значение не требуется. На фразе про обработку ответа перейди в этом же файле к строке 99: `parseModelJson` → `normalizeGeneratedResponse` → `Response.json`.

Текст:

> The server calls OpenRouter, keeping the API key outside the browser. One challenge is handling AI output wrapped in Markdown or extra text. A separate parser extracts the JSON, and normalization prepares the question data for the UI.

Смысл: показать собственную серверную обработку поверх внешнего AI API. Конкретный пример: ответ вида «Here is the JSON: {…}» сначала проходит парсер, а затем преобразование структуры вопроса. Это обработка формата данных; она не проверяет фактическую правильность учебного ответа.

Парсер реализован в `server/model-json.mjs:1`; нормализатор — в `server/question-normalizers.mjs:3`. В основном видео достаточно показать вызовы в API-маршруте. Эти два файла оставь для возможных вопросов после просмотра.

**Шаг 5. Объяснить хранение и закончить — `questions-storage.ts`, 1:27–1:50**

Quick Open: `src/lib/questions-storage.ts:12`.

Покажи `getQuestionsStorageKey`: получаются ключи `sofinka.questions.en`, `sofinka.questions.ua`, `sofinka.questions.ru`. Затем прокрути к `saveQuestions` на строке 39. На последней фразе можно оставить этот файл на экране.

Текст:

> This version stores questions locally, with separate keys for each language. That keeps language sets separate without requiring accounts. Vitest covers storage, parsing, normalization, and the generation request. Thanks for watching.

Смысл: объяснить осознанный объём текущей версии. Наборы вопросов сохраняются в этом браузере; синхронизация между устройствами потребовала бы серверного хранения и модели пользователей.

**Текст целиком для репетиции**

Hi, I'm Mykhailo. This is Sofinka, my multilingual quiz app for children. It includes a question editor and AI generation. I'll walk through the data flow from the interface to the server.

React provides reusable question components, and TypeScript helps catch data-shape mistakes. TanStack Start provides routing and server endpoints. Questions use a discriminated union covering nine types, so each format has its own structure.

This dialog sends the topic, age, language, count, and question type to our API. TanStack Query mutations handle loading, success, and errors, keeping that request state out of the form logic.

The server calls OpenRouter, keeping the API key outside the browser. One challenge is handling AI output wrapped in Markdown or extra text. A separate parser extracts the JSON, and normalization prepares the question data for the UI.

This version stores questions locally, with separate keys for each language. That keeps language sets separate without requiring accounts. Vitest covers storage, parsing, normalization, and the generation request. Thanks for watching.

**Если на репетиции выходит больше 1:55**

Сначала убери предложение “I'll walk through the data flow from the interface to the server.” Затем сократи конец третьего абзаца: закончи его после “loading, success, and errors”. При необходимости в первом шаге покажи только викторину и кратко назови конструктор. Остальные технические шаги сохраняй.

**Карта кода для понимания и возможных уточнений**

Эти файлы не нужно дополнительно открывать в двухминутном видео.

| Задача | Файл и точка входа |
| --- | --- |
| Выбрать компонент по типу вопроса | `src/components/questions/question-renderer.tsx:24` — `QuestionRenderer` |
| Отделить выбор и проверку ответа от разметки | `src/components/questions/answer-state.ts:9` — `useSingleAnswer` |
| Преобразовать поля редактора в вопрос и обратно | `src/components/constructor/question-draft.ts:222` — `toQuestion`; строка 345 — `toDraft` |
| Принять вопросы из AI, назначить локальные ID и сохранить | `src/routes/$language.constructor.index.tsx:292` — `addGeneratedQuestions` |
| Извлечь JSON из текста или Markdown | `server/model-json.mjs:1` — `parseModelJson` |
| Привести разные формы ответа к структуре вопроса | `server/question-normalizers.mjs:3` — `normalizeGeneratedResponse` |
| Проверить формат запроса из UI | `src/components/constructor/generate-questions-dialog.test.tsx:78` |
| Проверить JSON с Markdown, лишним текстом и сломанным синтаксисом | `server/model-json.test.mjs:5` |
| Проверить раздельное хранение языков и повреждённый JSON | `src/lib/questions-storage.test.ts:36` и строка 68 |

Короткие ответы, если попросят уточнить:

- Почему localStorage? “For this version, local storage keeps the app simple and account-free. Cross-device sync would require server-side persistence.”
- Где ключ AI? “The browser calls an internal endpoint. The server reads the OpenRouter key from its environment.”
- Почему отдельный парсер? “Model output can contain Markdown or surrounding text. Parsing is separate from question normalization, so both behaviors can be tested independently.”
- Что улучшить дальше? “I'd add stricter runtime validation of generated questions and reject ambiguous answers instead of filling in defaults.” Это предложение о следующем шаге: сейчас нормализатор действительно может назначить первый вариант правильным при отсутствии признака правильности (`server/question-normalizers.mjs:215`).

Корректные формулировки текущего объёма: есть серверные API-маршруты и внешняя AI-интеграция; пользовательские вопросы хранятся в localStorage. TypeScript-модель и нормализация не заменяют полную runtime-валидацию или проверку правильности ответа. В коде есть и отдельный Node-сервер, но показанный UI вызывает встроенный маршрут TanStack Start; в этом сценарии достаточно `pnpm dev`.

**Что проверено 3 ноября 2026 года**

- Браузер: `/en` → выбор `4` → `Check` показывает правильный ответ; переход в `/en/constructor` и открытие `Generate questions` работают.
- `pnpm typecheck` завершился успешно.
- Следующая команда завершилась успешно: 5 файлов, 22 теста.

```bash
pnpm test src/components/questions/question-types.test.ts src/components/constructor/generate-questions-dialog.test.tsx src/lib/questions-storage.test.ts server/model-json.test.mjs server/question-normalizers.test.mjs
```

Тест диалога использует подменённый `fetch`. Реальный платный или бесплатный запрос к OpenRouter в этой проверке не отправлялся. Полный production build и весь набор проверок CI для этой инструкции не запускались.

**Перед отправкой видео**

Проверь, что длительность меньше двух минут, голос слышен, веб-камера видна, код читается. Загрузив видео, проверь ссылку без входа в свой аккаунт: рецензент должен открыть её без запроса доступа. По письму нужно ответить ссылкой до конца воскресенья, 8 ноября 2026 года; часовой пояс в письме не указан, поэтому лучше отправить заранее.

Текст ответа после загрузки:

```text
Hi Anthony,

Thank you for the opportunity. Here is my short walkthrough of Sofinka:
[VIDEO LINK]

Best,
Mykhailo Roshchyna
```
