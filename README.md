# Permis B1 — Code de la route

PWA для підготовки до теоретичного іспиту ETG (Code de la route) у Франції.
Питання французькою, з кнопкою «Переклад» на українську.

## Запуск

```bash
npm install
npm run dev          # локальний сервер розробки
npm run build        # продакшн-збірка в dist/
npm run check:data   # перевірка JSON-файлів з питаннями
npm run fetch:signs  # завантажити знаки з Wikimedia Commons у public/signs/
```

## Розділи

- **Accueil** — прогрес за темами, «Продовжити», дні поспіль, останній іспит, кількість помилок
- **Thèmes** — 10 тем ETG по 15 питань, пояснення після кожної відповіді
- **Examen blanc** — 40 питань (по 4 з кожної теми), 20 с на питання, прохідний бал 35/40, розбір у кінці
- **Mes erreurs** — питання з помилками; зникають після 3 правильних відповідей поспіль
- **Panneaux** — 41 знак: картки, що перевертаються, і тест на 10 питань
- **Stats** — графік результатів іспитів, найслабші теми, скидання прогресу

## Деплой на GitHub Pages

1. У репозиторії: **Settings → Pages → Source: GitHub Actions**.
2. Злити зміни в `main` — workflow `.github/workflows/deploy.yml` збере проєкт,
   завантажить знаки з Wikimedia Commons і опублікує сайт.
3. Адреса: `https://<user>.github.io/<repo>/`. На телефоні — «Встановити застосунок»
   (Android/Chrome) або «Поділитися → На початковий екран» (iPhone/Safari).

Збірка також запускається на кожен push в інші гілки (без публікації) — як перевірка.

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
scripts/
  validate-questions.mjs # перевірка питань
  fetch-signs.mjs        # завантаження знаків з Wikimedia Commons
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
- [x] 2. Пробний іспит + таймер
- [x] 3. Мої помилки + статистика
- [x] 4. Дорожні знаки + PWA + деплой

## Ліцензії

Зображення дорожніх знаків — Wikimedia Commons (французькі дорожні знаки, суспільне надбання).
