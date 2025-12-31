"use client";

import { useState, useEffect, useCallback } from "react";
import { useSound } from "@/app/hooks/useSound";

interface BuzzerModalProps {
  isOpen: boolean;
  onClose: (winner: "A" | "B" | null) => void;
}

export default function BuzzerModal({ isOpen, onClose }: BuzzerModalProps) {
  const [winner, setWinner] = useState<"A" | "B" | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const { play } = useSound();

  // Reset stanu gdy modal się otwiera
  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setIsWaiting(true);
    }
  }, [isOpen]);

  // Obsługa klawiszy
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen || !isWaiting) return;

      if (event.key === "Enter") {
        event.preventDefault();
        play("buzzer");
        setWinner("A");
        setIsWaiting(false);
      } else if (event.key === " ") {
        event.preventDefault();
        play("buzzer");
        setWinner("B");
        setIsWaiting(false);
      }
    },
    [isOpen, isWaiting, play]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleConfirm = () => {
    onClose(winner);
  };

  const handleCancel = () => {
    onClose(null);
  };

  const handleReset = () => {
    setWinner(null);
    setIsWaiting(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative game-board p-8 max-w-lg w-full mx-4 text-center animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          🔔 Kto pierwszy?
        </h2>

        {isWaiting ? (
          <>
            <div className="text-xl text-gray-300 mb-8">
              Czekam na zgłoszenie drużyny...
            </div>

            <div className="flex justify-center gap-8 mb-8">
              {/* Drużyna A */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-blue-600/30 border-4 border-blue-500 flex items-center justify-center mb-3 mx-auto animate-pulse">
                  <span className="text-4xl font-bold text-blue-400">A</span>
                </div>
                <kbd className="px-4 py-2 bg-gray-800 rounded border border-gray-600 text-gray-300 font-mono text-lg">
                  Enter
                </kbd>
              </div>

              {/* Drużyna B */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-red-600/30 border-4 border-red-500 flex items-center justify-center mb-3 mx-auto animate-pulse">
                  <span className="text-4xl font-bold text-red-400">B</span>
                </div>
                <kbd className="px-4 py-2 bg-gray-800 rounded border border-gray-600 text-gray-300 font-mono text-lg">
                  Spacja
                </kbd>
              </div>
            </div>

            <button onClick={handleCancel} className="btn-secondary">
              Anuluj
            </button>
          </>
        ) : (
          <>
            <div className="mb-8">
              <div
                className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center border-4 ${
                  winner === "A"
                    ? "bg-blue-600/50 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    : "bg-red-600/50 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                }`}
              >
                <span
                  className={`text-6xl font-bold ${
                    winner === "A" ? "text-blue-300" : "text-red-300"
                  }`}
                >
                  {winner}
                </span>
              </div>
              <div className="text-3xl font-bold text-white">
                Drużyna {winner} była pierwsza!
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={handleReset} className="btn-secondary">
                🔄 Powtórz
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                ✓ Zatwierdź
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

