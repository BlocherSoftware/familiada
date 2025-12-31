import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="game-board p-8 max-w-md text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Poziom nie znaleziony
        </h2>
        <p className="text-gray-400 mb-6">
          Przepraszamy, ale nie znaleźliśmy poziomu, którego szukasz.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Wróć do menu
        </Link>
      </div>
    </div>
  );
}

