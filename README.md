# Permis B1 — Code de la route

PWA для підготовки до теоретичного іспиту ETG (Code de la route) у Франції.
Питання французькою, з кнопкою «Переклад» на українську.

## Запуск

```bash
npm install
npm run dev          # локальний сервер розробки
npm run build        # продакшн-збірка в dist/
npm run check:data   # перевірка JSON-файлів з питаннями
```

## Структура

```
src/
  data/
    themes.ts            # 10 офіційних тем ETG
    questions/*.json     # питання, один файл на тему
    questions.ts         # завантаження та перевірка відповідей
  lib/
    storage.ts           # прогрес у localStorage (статистика питань, дні поспіль)
    settings.ts          # світла/темна тема
  components/            # QuestionCard, Layout, ProgressBar
  pages/                 # Home, Themes, ThemeStudy, ...
scripts/validate-questions.mjs
```

## Формат питання

```json
{
  "id": "q001",
  "theme": "circulation",
  "image": null,
  "question_fr": "...",
  "question_uk": "...",
  "answers": [{ "id": "A", "fr": "...", "uk": "..." }],
  "correct": ["A", "C"],
  "explanation_fr": "...",
  "explanation_uk": "..."
}
```

Питання складені самостійно за правилами Code de la route — не скопійовані з платних баз.

## Етапи

- [x] 1. Структура проєкту + навчання за темою
- [ ] 2. Пробний іспит + таймер
- [ ] 3. Мої помилки + статистика
- [ ] 4. Дорожні знаки + PWA + деплой
