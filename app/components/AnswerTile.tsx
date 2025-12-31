"use client";

import { useState, useEffect } from "react";
import type { Answer } from "@/app/types/game";

interface AnswerTileProps {
  answer: Answer;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
  disabled: boolean;
  multiplier: number;
}

export default function AnswerTile({
  answer,
  index,
  isRevealed,
  onReveal,
  disabled,
  multiplier,
}: AnswerTileProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(isRevealed);

  useEffect(() => {
    if (isRevealed && !showContent) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, showContent]);

  const handleClick = () => {
    if (!disabled && !isRevealed) {
      onReveal();
    }
  };

  const displayPoints = answer.points * multiplier;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isRevealed}
      className={`
        answer-tile w-full py-4 px-6 flex items-center justify-between
        ${isRevealed ? "revealed" : ""}
        ${isAnimating ? "animate-flip" : ""}
        ${!disabled && !isRevealed ? "cursor-pointer" : "cursor-default"}
        transition-all duration-300
      `}
    >
      <div className="flex items-center gap-4">
        <span className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 rounded-full text-yellow-400 font-bold">
          {index + 1}
        </span>
        <span className="text-xl font-semibold tracking-wide">
          {showContent ? answer.text : "• • • • •"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {showContent ? (
          <span className="text-2xl font-bold text-yellow-400 animate-score">
            {displayPoints}
          </span>
        ) : (
          !disabled && (
            <kbd className="px-2 py-1 bg-gray-800/50 rounded border border-gray-600 text-gray-400 font-mono text-sm opacity-60">
              {index + 1}
            </kbd>
          )
        )}
      </div>
    </button>
  );
}

