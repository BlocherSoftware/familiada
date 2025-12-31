"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { LevelData, GameState } from "@/app/types/game";
import GameBoard from "@/app/components/GameBoard";
import { useSound } from "@/app/hooks/useSound";
import { useGameStorage } from "@/app/hooks/useGameStorage";

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
  const [initialGameState, setInitialGameState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { play, stop } = useSound();
  const { saveGame, loadGame, clearGame, hasStoredGame } = useGameStorage(levelData.level);

  // Wczytaj zapisany stan gry przy starcie
  useEffect(() => {
    const storedData = loadGame();
    if (storedData) {
      setGameStatus(storedData.gameStatus);
      setGameResult(storedData.gameResult);
      if (storedData.gameState) {
        setInitialGameState(storedData.gameState);
      }
    }
    setIsLoaded(true);
  }, [loadGame]);

  // Zapisuj stan gry przy każdej zmianie statusu (ale nie gameState - to robi GameBoard)
  useEffect(() => {
    if (isLoaded) {
      // Zapisujemy tylko gdy gra jest zakończona (gameState jest w GameBoard)
      if (gameStatus === "finished" || gameStatus === "ready") {
        saveGame({
          gameStatus,
          gameResult,
          gameState: null,
        });
      }
    }
  }, [gameStatus, gameResult, saveGame, isLoaded]);

  // Odtwarzaj intro na ekranie startowym
  useEffect(() => {
    if (gameStatus === "ready" && isLoaded) {
      play("intro");
    }
    return () => {
      stop("intro");
    };
  }, [gameStatus, isLoaded, play, stop]);

  const handleStartGame = () => {
    stop("intro");
    clearGame(); // Wyczyść poprzedni zapis przy nowej grze
    setInitialGameState(null);
    setGameStatus("playing");
    setGameResult(null);
  };

  const handleContinueGame = () => {
    stop("intro");
    setGameStatus("playing");
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

    const result = {
      teamAScore: finalScoreA,
      teamBScore: finalScoreB,
      winner,
    };

    setGameResult(result);
    setGameStatus("finished");
    clearGame(); // Wyczyść zapis po zakończeniu gry
  }, [clearGame]);

  const handlePlayAgain = () => {
    clearGame();
    setInitialGameState(null);
    setGameStatus("ready");
    setGameResult(null);
  };

  // Callback do zapisywania stanu gry z GameBoard
  const handleGameStateChange = useCallback(
    (newGameState: GameState) => {
      saveGame({
        gameStatus: "playing",
        gameResult: null,
        gameState: newGameState,
      });
    },
    [saveGame]
  );

  // Pokaż loader podczas wczytywania
  if (!isLoaded) {
    return (
      <div className="game-board p-8 max-w-2xl mx-auto text-center">
        <div className="text-2xl text-gray-400">Ładowanie...</div>
      </div>
    );
  }

  // Ekran startowy
  if (gameStatus === "ready") {
    const hasSavedGame = hasStoredGame();

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

        <div className="flex flex-col gap-4">
          {hasSavedGame && (
            <button
              onClick={handleContinueGame}
              className="btn-primary text-xl px-12 py-4"
            >
              ▶️ Kontynuuj grę
            </button>
          )}
          <button
            onClick={handleStartGame}
            className={`${hasSavedGame ? "btn-secondary" : "btn-primary text-xl"} px-12 py-4`}
          >
            {hasSavedGame ? "🔄 Nowa gra" : "Rozpocznij grę!"}
          </button>
        </div>
      </div>
    );
  }

  // Ekran gry
  if (gameStatus === "playing") {
    return (
      <GameBoard
        levelData={levelData}
        onGameEnd={handleGameEnd}
        initialState={initialGameState}
        onStateChange={handleGameStateChange}
      />
    );
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
