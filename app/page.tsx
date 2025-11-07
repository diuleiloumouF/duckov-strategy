import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center gap-8 py-16 px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Duckov Strategy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Game Database & Wiki
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link
            href="/inventory"
            className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">📦</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Items
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Browse all game items and equipment
              </p>
            </div>
          </Link>

          <Link
            href="/monsters"
            className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">👾</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Monsters
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400">
                View enemy stats and loot drops
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
