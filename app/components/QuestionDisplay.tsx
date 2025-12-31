"use client";

interface QuestionDisplayProps {
  question: string;
  roundNumber: number;
  totalRounds: number;
  multiplier: number;
  isHidden: boolean;
  onReveal: () => void;
}

export default function QuestionDisplay({
  question,
  roundNumber,
  totalRounds,
  multiplier,
  isHidden,
  onReveal,
}: QuestionDisplayProps) {
  return (
    <div className="text-center mb-8">
      {/* Informacja o rundzie */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-sm text-gray-400 uppercase tracking-wider">
          Runda {roundNumber} z {totalRounds}
        </div>
        {multiplier > 1 && (
          <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
            <span className="text-yellow-400 font-bold text-sm">
              ×{multiplier}
            </span>
          </div>
        )}
      </div>

      {/* Pytanie */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-xl" />
        {isHidden ? (
          <button
            onClick={onReveal}
            className="relative group w-full py-6 px-8 bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-2 border-dashed border-yellow-500/40 rounded-xl hover:border-yellow-500 transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">❓</span>
              <span className="text-xl text-gray-400 group-hover:text-yellow-400 transition-colors">
                Kliknij aby pokazać pytanie
              </span>
              <kbd className="px-3 py-1 bg-gray-700 rounded border border-gray-600 text-gray-400 font-mono text-sm">
                Q
              </kbd>
            </div>
          </button>
        ) : (
          <h2 className="relative text-3xl md:text-4xl font-bold text-white leading-tight px-4 animate-in fade-in zoom-in-95 duration-300">
            {question}
          </h2>
        )}
      </div>

      {/* Dekoracyjna linia */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
      </div>
    </div>
  );
}
