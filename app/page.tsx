import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import type { LevelData, LevelInfo } from "@/app/types/game";

async function getLevels(): Promise<LevelInfo[]> {
  const dataDir = path.join(process.cwd(), "public", "data");

  try {
    const files = await fs.readdir(dataDir);
    const levelFiles = files.filter(
      (f) => f.startsWith("level-") && f.endsWith(".json")
    );

    const levels: LevelInfo[] = await Promise.all(
      levelFiles.map(async (file) => {
        const filePath = path.join(dataDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const data: LevelData = JSON.parse(content);

        return {
          id: data.level,
          name: data.name,
          description: `${data.rounds.length} rund`,
          roundsCount: data.rounds.length,
        };
      })
    );

    return levels.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Błąd wczytywania poziomów:", error);
    return [];
  }
}

export default async function HomePage() {
  const levels = await getLevels();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg">
              FAMILIADA
            </span>
          </h1>
          <div className="absolute -inset-4 bg-yellow-500/20 blur-3xl -z-10 rounded-full" />
        </div>
        <p className="mt-4 text-xl text-gray-400 font-medium">
          Klasyczny teleturniej rodzinny
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-300">
            Wybierz poziom
          </h2>

          {levels.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl">Brak dostępnych poziomów</p>
              <p className="mt-2 text-sm">
                Dodaj pliki JSON z pytaniami do folderu{" "}
                <code className="bg-gray-800 px-2 py-1 rounded">
                  public/data/
                </code>
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levels.map((level) => (
                <Link
                  key={level.id}
                  href={`/level/${level.id}`}
                  className="group relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative game-board p-6 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-5xl font-bold text-yellow-500/30">
                        {level.id}
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium">
                        {level.roundsCount} rund
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {level.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{level.description}</p>
                    <div className="mt-4 flex items-center text-yellow-400 font-medium group-hover:translate-x-2 transition-transform">
                      Graj
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Instrukcja */}
        <section className="game-board p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            Jak grać?
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-gray-300">
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-500/20 rounded-full text-yellow-400 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Wybierz poziom</h3>
                <p className="text-sm">
                  Każdy poziom zawiera kilka rund z różnymi pytaniami.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-500/20 rounded-full text-yellow-400 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Odpowiadaj na pytania</h3>
                <p className="text-sm">
                  Klikaj na kafelki, aby odkryć odpowiedzi ankietowanych.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-500/20 rounded-full text-yellow-400 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Unikaj błędów</h3>
                <p className="text-sm">
                  3 błędne odpowiedzi i przeciwnik może ukraść punkty!
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-500/20 rounded-full text-yellow-400 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white">Zbieraj punkty</h3>
                <p className="text-sm">
                  Wygrywa drużyna z większą liczbą punktów na koniec gry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>
          Familiada – Teleturniej | Stworzone z ❤️ w Next.js
        </p>
      </footer>
    </div>
  );
}
