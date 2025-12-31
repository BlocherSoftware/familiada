# 🎯 Familiada - Teleturniej

Aplikacja webowa inspirowana kultowym polskim teleturniejem "Familiada". Zbudowana w **Next.js 16.1.1** z TypeScript i Tailwind CSS.

## 🚀 Technologie

- **Next.js 16.1.1** - App Router
- **React 19** - Functional components, hooks
- **TypeScript** - Pełne typowanie
- **Tailwind CSS 4** - Stylowanie

## 📁 Struktura projektu

```
familiada/
├── app/
│   ├── page.tsx                    # Strona główna (menu)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Style globalne + Tailwind
│   ├── components/
│   │   ├── GameBoard.tsx           # Główna plansza gry
│   │   ├── AnswerTile.tsx          # Kafelek odpowiedzi
│   │   ├── ScoreBoard.tsx          # Tablica wyników
│   │   └── QuestionDisplay.tsx     # Wyświetlanie pytania
│   ├── types/
│   │   └── game.ts                 # Typy TypeScript
│   └── level/
│       └── [id]/
│           ├── page.tsx            # Strona poziomu (server component)
│           ├── GameClient.tsx      # Logika gry (client component)
│           └── not-found.tsx       # Strona 404 dla poziomu
├── public/
│   └── data/
│       ├── level-1.json            # Pytania poziomu 1
│       ├── level-2.json            # Pytania poziomu 2
│       └── level-3.json            # Pytania poziomu 3
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## 📊 Format danych JSON

Każdy poziom to plik JSON w `public/data/level-X.json`:

```json
{
  "level": 1,
  "name": "Poziom 1 – Łatwy",
  "rounds": [
    {
      "id": 1,
      "question": "Czego ludzie szukają w lodówce o północy?",
      "answers": [
        { "text": "Sera", "points": 35 },
        { "text": "Wędliny", "points": 28 },
        { "text": "Jogurtu", "points": 18 },
        { "text": "Wody", "points": 12 },
        { "text": "Owoców", "points": 7 }
      ],
      "multiplier": 1
    }
  ]
}
```

### Struktura danych

| Pole | Typ | Opis |
|------|-----|------|
| `level` | number | Numer poziomu |
| `name` | string | Nazwa poziomu |
| `rounds` | Round[] | Lista rund |
| `rounds[].id` | number | ID rundy |
| `rounds[].question` | string | Pytanie |
| `rounds[].answers` | Answer[] | Lista odpowiedzi (posortowane wg punktów) |
| `rounds[].multiplier` | number | Mnożnik punktów (1, 2, lub 3) |
| `answers[].text` | string | Treść odpowiedzi |
| `answers[].points` | number | Punkty za odpowiedź |

## 🎮 Zasady gry

1. **Dwie drużyny** rywalizują o punkty
2. **Odpowiedzi** są ukryte - kliknij, aby odkryć
3. **3 błędy** = przeciwnik może ukraść punkty
4. **Mnożniki** - niektóre rundy mają punkty pomnożone (×2, ×3)
5. Wygrywa drużyna z większą liczbą punktów

## 🛠️ Instalacja i uruchomienie

```bash
# Instalacja zależności
pnpm install

# Tryb deweloperski
pnpm dev

# Build produkcyjny
pnpm build

# Uruchomienie produkcyjne
pnpm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## ➕ Dodawanie nowych poziomów

1. Utwórz nowy plik `public/data/level-X.json`
2. Wypełnij zgodnie z formatem powyżej
3. Poziom automatycznie pojawi się w menu!

## 🎨 Personalizacja

### Zmiana kolorów
Edytuj zmienne CSS w `app/globals.css`:

```css
:root {
  --familiada-blue: #0a1628;
  --familiada-gold: #ffd700;
  --familiada-red: #dc2626;
  --familiada-green: #16a34a;
}
```

## 📝 Licencja

MIT License - używaj dowolnie!
