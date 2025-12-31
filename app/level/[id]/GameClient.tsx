"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { LevelData } from "@/app/types/game";
import GameBoard from "@/app/components/GameBoard";
import { useSound } from "@/app/hooks/useSound";

interface GameClientProps {
  levelData: LevelData;
}

type GameStatus = "ready" | "playing" | "finished";

interface GameResult {
  teamAScore: number;
  teamBScore: number;
  winner: "A" | "B" | "tie";
}

export default function GameClient({ levelData }: GameClientProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("ready");
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const { play, stop } = useSound();

  // Odtwarzaj intro na ekranie startowym
  useEffect(() => {
    if (gameStatus === "ready") {
      play("intro");
    }
    return () => {
      stop("intro");
    };
  }, [gameStatus, play, stop]);

  const handleStartGame = () => {
    stop("intro");
    setGameStatus("playing");
    setGameResult(null);
  };

  const handleGameEnd = useCallback((finalScoreA: number, finalScoreB: number) => {
    let winner: "A" | "B" | "tie";
    if (finalScoreA > finalScoreB) {
      winner = "A";
    } else if (finalScoreB > finalScoreA) {
      winner = "B";
    } else {
      winner = "tie";
    }

    setGameResult({
      teamAScore: finalScoreA,
      teamBScore: finalScoreB,
      winner,
    });
    setGameStatus("finished");
  }, []);

  const handlePlayAgain = () => {
    setGameStatus("ready");
    setGameResult(null);
  };

  // Ekran startowy
  if (gameStatus === "ready") {
    return (
      <div className="game-board p-8 max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-6xl">🎯</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{levelData.name}</h2>
        <p className="text-gray-400 mb-8">
          {levelData.rounds.length} rund do rozegrania
        </p>

        <div className="bg-black/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Przegląd rund
          </h3>
          <div className="space-y-2 text-left">
            {levelData.rounds.map((round, index) => (
              <div
                key={round.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-400">
                  Runda {index + 1}:{" "}
                  <span className="text-gray-300">{round.answers.length} odpowiedzi</span>
                </span>
                {round.multiplier > 1 && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 rounded text-yellow-400 text-xs">
                    ×{round.multiplier}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="btn-primary text-xl px-12 py-4"
        >
          Rozpocznij grę!
        </button>
      </div>
    );
  }

  // Ekran gry
  if (gameStatus === "playing") {
    return <GameBoard levelData={levelData} onGameEnd={handleGameEnd} />;
  }

  // Ekran końcowy
  if (gameStatus === "finished" && gameResult) {
    return (
      <div className="game-board p-8 max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-6xl">
            {gameResult.winner === "tie" ? "🤝" : "🏆"}
          </span>
        </div>

        <h2 className="text-4xl font-bold text-white mb-4">
          {gameResult.winner === "tie"
            ? "Remis!"
            : `Drużyna ${gameResult.winner} wygrywa!`}
        </h2>

        <p className="text-gray-400 mb-8">Dziękujemy za grę w Familiadę!</p>

        <div className="flex justify-center gap-8 mb-8">
          <div className="score-display">
            <div className="text-lg font-semibold text-gray-300 mb-2">
              DRUŻYNA A
            </div>
            <div
              className={`score-number ${
                gameResult.winner === "A" ? "text-green-400" : ""
              }`}
            >
              {gameResult.teamAScore}
            </div>
            {gameResult.winner === "A" && (
              <div className="mt-2 text-green-400 font-bold">ZWYCIĘZCA!</div>
            )}
          </div>

          <div className="score-display">
            <div className="text-lg font-semibold text-gray-300 mb-2">
              DRUŻYNA B
            </div>
            <div
              className={`score-number ${
                gameResult.winner === "B" ? "text-green-400" : ""
              }`}
            >
              {gameResult.teamBScore}
            </div>
            {gameResult.winner === "B" && (
              <div className="mt-2 text-green-400 font-bold">ZWYCIĘZCA!</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handlePlayAgain} className="btn-primary">
            Zagraj ponownie
          </button>
          <Link href="/" className="btn-secondary inline-block">
            Wróć do menu
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

