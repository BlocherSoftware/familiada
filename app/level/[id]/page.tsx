import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LevelData } from "@/app/types/game";
import GameClient from "./GameClient";

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

async function getLevelData(levelId: string): Promise<LevelData | null> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `level-${levelId}.json`
  );

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as LevelData;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const dataDir = path.join(process.cwd(), "public", "data");

  try {
    const files = await fs.readdir(dataDir);
    const levelFiles = files.filter(
      (f) => f.startsWith("level-") && f.endsWith(".json")
    );

    return levelFiles.map((file) => ({
      id: file.replace("level-", "").replace(".json", ""),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: LevelPageProps) {
  const { id } = await params;
  const levelData = await getLevelData(id);

  if (!levelData) {
    return {
      title: "Poziom nie znaleziony | Familiada",
    };
  }

  return {
    title: `${levelData.name} | Familiada`,
    description: `Zagraj w ${levelData.name} - ${levelData.rounds.length} rund pytań!`,
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { id } = await params;
  const levelData = await getLevelData(id);

  if (!levelData) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between border-b border-yellow-500/20">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Powrót do menu
        </Link>
        <h1 className="text-2xl font-bold text-yellow-400">FAMILIADA</h1>
        <div className="w-32" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <GameClient levelData={levelData} />
      </main>
    </div>
  );
}

