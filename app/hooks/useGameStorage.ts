"use client";

import { useCallback } from "react";
import type { GameState } from "@/app/types/game";

type GameStatus = "ready" | "playing" | "finished";

interface GameResult {
  teamAScore: number;
  teamBScore: number;
  winner: "A" | "B" | "tie";
}

interface StoredGameData {
  gameStatus: GameStatus;
  gameResult: GameResult | null;
  gameState: GameState | null;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = "familiada_game_";
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 godziny

export function useGameStorage(levelId: number) {
  const storageKey = `${STORAGE_KEY_PREFIX}${levelId}`;

  const saveGame = useCallback(
    (data: Omit<StoredGameData, "timestamp">) => {
      try {
        const storageData: StoredGameData = {
          ...data,
          timestamp: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(storageData));
      } catch (error) {
        console.warn("Nie można zapisać stanu gry:", error);
      }
    },
    [storageKey]
  );

  const loadGame = useCallback((): StoredGameData | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const data: StoredGameData = JSON.parse(stored);

      // Sprawdź czy dane nie wygasły
      if (Date.now() - data.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(storageKey);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("Nie można wczytać stanu gry:", error);
      return null;
    }
  }, [storageKey]);

  const clearGame = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("Nie można wyczyścić stanu gry:", error);
    }
  }, [storageKey]);

  const hasStoredGame = useCallback((): boolean => {
    const data = loadGame();
    return data !== null && data.gameStatus === "playing";
  }, [loadGame]);

  return { saveGame, loadGame, clearGame, hasStoredGame };
}

