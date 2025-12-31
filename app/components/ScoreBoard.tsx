"use client";

interface ScoreBoardProps {
  teamAScore: number;
  teamBScore: number;
  currentTeam: "A" | "B";
  mistakesA: number;
  mistakesB: number;
  roundScore: number;
}

export default function ScoreBoard({
  teamAScore,
  teamBScore,
  currentTeam,
  mistakesA,
  mistakesB,
  roundScore,
}: ScoreBoardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Wynik rundy na górze */}
      <div className="text-center">
        <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
          Punkty do zdobycia
        </div>
        <div className="text-5xl font-bold text-yellow-400 animate-pulse-gold inline-block px-8 py-2 rounded-lg bg-black/30 border-2 border-yellow-500/30">
          {roundScore}
        </div>
      </div>

      {/* Drużyny */}
      <div className="flex justify-center gap-8">
        {/* Drużyna A */}
        <div
          className={`score-display min-w-[180px] transition-all duration-300 ${
            currentTeam === "A"
              ? "ring-4 ring-yellow-400 scale-105"
              : "opacity-80"
          }`}
        >
          <div className="text-lg font-semibold text-gray-300 mb-2">
            DRUŻYNA A
          </div>
          <div className="score-number">{teamAScore}</div>
          <div className="mistakes-container mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`mistake-indicator ${
                  i < mistakesA ? "active" : ""
                }`}
              >
                {i < mistakesA && <span className="mistake-x">✕</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Drużyna B */}
        <div
          className={`score-display min-w-[180px] transition-all duration-300 ${
            currentTeam === "B"
              ? "ring-4 ring-yellow-400 scale-105"
              : "opacity-80"
          }`}
        >
          <div className="text-lg font-semibold text-gray-300 mb-2">
            DRUŻYNA B
          </div>
          <div className="score-number">{teamBScore}</div>
          <div className="mistakes-container mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`mistake-indicator ${
                  i < mistakesB ? "active" : ""
                }`}
              >
                {i < mistakesB && <span className="mistake-x">✕</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

