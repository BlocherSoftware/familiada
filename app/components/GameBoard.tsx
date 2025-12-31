"use client";

import { useState, useCallback, useEffect } from "react";
import type { LevelData, GameState, Answer } from "@/app/types/game";
import AnswerTile from "./AnswerTile";
import ScoreBoard from "./ScoreBoard";
import QuestionDisplay from "./QuestionDisplay";
import { useSound } from "@/app/hooks/useSound";

interface GameBoardProps {
  levelData: LevelData;
  onGameEnd: (finalScoreA: number, finalScoreB: number) => void;
}

const MAX_MISTAKES = 3;

export default function GameBoard({ levelData, onGameEnd }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    revealedAnswers: [],
    teamAScore: 0,
    teamBScore: 0,
    currentTeam: "A",
    mistakes: { A: 0, B: 0 },
    roundScore: 0,
    gamePhase: "playing",
  });

  const { play } = useSound();
  const currentRoundData = levelData.rounds[gameState.currentRound];
  const allAnswersRevealed =
    gameState.revealedAnswers.length === currentRoundData?.answers.length;

  // Sprawdź czy gra się skończyła
  useEffect(() => {
    if (gameState.gamePhase === "gameEnd") {
      onGameEnd(gameState.teamAScore, gameState.teamBScore);
    }
  }, [gameState.gamePhase, gameState.teamAScore, gameState.teamBScore, onGameEnd]);

  const calculateRoundScore = useCallback(
    (revealedIndexes: number[], multiplier: number): number => {
      return revealedIndexes.reduce((sum, idx) => {
        const answer = currentRoundData.answers[idx];
        return sum + answer.points * multiplier;
      }, 0);
    },
    [currentRoundData]
  );

  const handleRevealAnswer = useCallback(
    (answerIndex: number) => {
      if (gameState.revealedAnswers.includes(answerIndex)) return;

      // Odtwórz dźwięk poprawnej odpowiedzi
      play("correct");

      const newRevealedAnswers = [...gameState.revealedAnswers, answerIndex];
      const newRoundScore = calculateRoundScore(
        newRevealedAnswers,
        currentRoundData.multiplier
      );

      setGameState((prev) => ({
        ...prev,
        revealedAnswers: newRevealedAnswers,
        roundScore: newRoundScore,
      }));
    },
    [gameState.revealedAnswers, calculateRoundScore, currentRoundData.multiplier, play]
  );

  // Obsługa klawiatury
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignoruj gdy focus jest na elemencie input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;

      // Klawisze 1-9 odkrywają odpowiedzi (indeks 0-8)
      if (key >= "1" && key <= "9") {
        const answerIndex = parseInt(key) - 1;
        if (
          answerIndex < currentRoundData.answers.length &&
          gameState.gamePhase !== "roundEnd" &&
          !gameState.revealedAnswers.includes(answerIndex)
        ) {
          handleRevealAnswer(answerIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentRoundData,
    gameState.gamePhase,
    gameState.revealedAnswers,
    handleRevealAnswer,
  ]);

  const handleMistake = useCallback(() => {
    // Odtwórz dźwięk błędu
    play("wrong");

    const currentTeam = gameState.currentTeam;
    const newMistakes = {
      ...gameState.mistakes,
      [currentTeam]: gameState.mistakes[currentTeam] + 1,
    };

    // Jeśli drużyna ma 3 błędy
    if (newMistakes[currentTeam] >= MAX_MISTAKES) {
      if (gameState.gamePhase === "playing") {
        // Przejście do fazy kradzieży
        const otherTeam = currentTeam === "A" ? "B" : "A";
        setGameState((prev) => ({
          ...prev,
          mistakes: newMistakes,
          currentTeam: otherTeam,
          gamePhase: "stealing",
        }));
      } else if (gameState.gamePhase === "stealing") {
        // Drużyna kradnąca też się pomyliła - punkty idą do przeciwnika
        const scoringTeam = currentTeam === "A" ? "B" : "A";
        setGameState((prev) => ({
          ...prev,
          mistakes: newMistakes,
          [`team${scoringTeam}Score`]:
            prev[`team${scoringTeam}Score` as keyof GameState] as number +
            prev.roundScore,
          gamePhase: "roundEnd",
        }));
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        mistakes: newMistakes,
      }));
    }
  }, [gameState, play]);

  const handlePassRound = useCallback(() => {
    const otherTeam = gameState.currentTeam === "A" ? "B" : "A";
    setGameState((prev) => ({
      ...prev,
      currentTeam: otherTeam,
      mistakes: { A: 0, B: 0 },
    }));
  }, [gameState.currentTeam]);

  const handleWinRound = useCallback(() => {
    const scoringTeam = gameState.currentTeam;
    const scoreKey = `team${scoringTeam}Score` as "teamAScore" | "teamBScore";

    setGameState((prev) => ({
      ...prev,
      [scoreKey]: prev[scoreKey] + prev.roundScore,
      gamePhase: "roundEnd",
    }));
  }, [gameState.currentTeam]);

  const handleNextRound = useCallback(() => {
    const nextRound = gameState.currentRound + 1;

    if (nextRound >= levelData.rounds.length) {
      setGameState((prev) => ({
        ...prev,
        gamePhase: "gameEnd",
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        currentRound: nextRound,
        revealedAnswers: [],
        mistakes: { A: 0, B: 0 },
        roundScore: 0,
        gamePhase: "playing",
        currentTeam: nextRound % 2 === 0 ? "A" : "B",
      }));
    }
  }, [gameState.currentRound, levelData.rounds.length]);

  const handleRevealAll = useCallback(() => {
    const allIndexes = currentRoundData.answers.map((_, i) => i);
    const newRoundScore = calculateRoundScore(
      allIndexes,
      currentRoundData.multiplier
    );

    setGameState((prev) => ({
      ...prev,
      revealedAnswers: allIndexes,
      roundScore: newRoundScore,
    }));
  }, [currentRoundData, calculateRoundScore]);

  if (!currentRoundData) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="game-board p-6 md:p-8 max-w-4xl mx-auto">
      {/* Pytanie */}
      <QuestionDisplay
        question={currentRoundData.question}
        roundNumber={gameState.currentRound + 1}
        totalRounds={levelData.rounds.length}
        multiplier={currentRoundData.multiplier}
      />

      {/* Tablica wyników */}
      <div className="mb-8">
        <ScoreBoard
          teamAScore={gameState.teamAScore}
          teamBScore={gameState.teamBScore}
          currentTeam={gameState.currentTeam}
          mistakesA={gameState.mistakes.A}
          mistakesB={gameState.mistakes.B}
          roundScore={gameState.roundScore}
        />
      </div>

      {/* Odpowiedzi */}
      <div className="grid gap-3 mb-4">
        {currentRoundData.answers.map((answer: Answer, index: number) => (
          <AnswerTile
            key={`${currentRoundData.id}-${index}`}
            answer={answer}
            index={index}
            isRevealed={gameState.revealedAnswers.includes(index)}
            onReveal={() => handleRevealAnswer(index)}
            disabled={gameState.gamePhase === "roundEnd"}
            multiplier={currentRoundData.multiplier}
          />
        ))}
      </div>

      {/* Podpowiedź o skrótach klawiszowych */}
      {gameState.gamePhase !== "roundEnd" && (
        <div className="text-center text-gray-500 text-sm mb-6">
          <span className="inline-flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 text-gray-400 font-mono text-xs">
              1
            </kbd>
            <span>-</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 text-gray-400 font-mono text-xs">
              {currentRoundData.answers.length}
            </kbd>
            <span className="ml-1">odkryj odpowiedź</span>
          </span>
        </div>
      )}

      {/* Kontrolki gry */}
      <div className="flex flex-wrap justify-center gap-4">
        {gameState.gamePhase === "playing" && (
          <>
            <button
              onClick={handleMistake}
              className="btn-secondary flex items-center gap-2"
            >
              <span className="text-red-400 text-xl">✕</span>
              Błąd ({gameState.mistakes[gameState.currentTeam]}/3)
            </button>
            <button onClick={handlePassRound} className="btn-secondary">
              Przekaż drużynie{" "}
              {gameState.currentTeam === "A" ? "B" : "A"}
            </button>
            {allAnswersRevealed && (
              <button onClick={handleWinRound} className="btn-primary">
                Drużyna {gameState.currentTeam} wygrywa rundę!
              </button>
            )}
          </>
        )}

        {gameState.gamePhase === "stealing" && (
          <>
            <div className="w-full text-center text-yellow-400 font-bold text-lg mb-2">
              🎯 Drużyna {gameState.currentTeam} próbuje ukraść punkty!
            </div>
            <button
              onClick={handleMistake}
              className="btn-secondary flex items-center gap-2"
            >
              <span className="text-red-400 text-xl">✕</span>
              Błędna odpowiedź
            </button>
            <button onClick={handleWinRound} className="btn-primary">
              Prawidłowa odpowiedź - kradną punkty!
            </button>
          </>
        )}

        {gameState.gamePhase === "roundEnd" && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-2xl font-bold text-green-400">
              ✓ Runda zakończona!
            </div>
            {!allAnswersRevealed && (
              <button onClick={handleRevealAll} className="btn-secondary">
                Pokaż wszystkie odpowiedzi
              </button>
            )}
            <button onClick={handleNextRound} className="btn-primary text-xl">
              {gameState.currentRound + 1 >= levelData.rounds.length
                ? "Zakończ grę"
                : "Następna runda →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

