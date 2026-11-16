// src/components/visualizers/MergeIntervalsVisualizer.jsx

export default function MergeIntervalsVisualizer({ step }) {
  if (!step || !step.state) return null;

  const {
    sorted = [],
    merged = [],
    currentIndex,
    current,
    last,
    overlaps,
  } = step.state;

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-5">

      {/* Sorted input intervals */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">

        <h3 className="text-lg font-semibold mb-4">
          Intervals
        </h3>

        <div className="flex flex-wrap gap-3">

          {sorted.map((interval, index) => {

            const isCurrent = index === currentIndex;

            return (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg border font-mono transition-all duration-300 ${
                  isCurrent
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-300 scale-105"
                    : "border-gray-600 bg-gray-900 text-gray-200"
                }`}
              >
                [{interval[0]}, {interval[1]}]
              </div>
            );
          })}

        </div>

      </div>

      {/* Comparison */}
      {current && last && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">

          <h3 className="text-lg font-semibold mb-4">
            Current Comparison
          </h3>

          <div className="flex items-center gap-4">

            <div className="px-5 py-3 rounded-lg bg-blue-500/20 border border-blue-400 text-blue-300 font-mono">
              [{last[0]}, {last[1]}]
            </div>

            <span className="text-gray-400 text-xl">
              {overlaps ? "↔" : "✕"}
            </span>

            <div className="px-5 py-3 rounded-lg bg-yellow-500/20 border border-yellow-400 text-yellow-300 font-mono">
              [{current[0]}, {current[1]}]
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-400">
            {overlaps
              ? "These intervals overlap and can be merged."
              : "These intervals do not overlap and remain separate."}
          </p>

        </div>
      )}

      {/* Merged result */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">

        <h3 className="text-lg font-semibold mb-4">
          Merged Intervals
        </h3>

        {merged.length === 0 ? (
          <p className="text-gray-500">
            No intervals added yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">

            {merged.map((interval, index) => (
              <div
                key={index}
                className="px-4 py-3 rounded-lg bg-green-500/20 border border-green-400 text-green-300 font-mono"
              >
                [{interval[0]}, {interval[1]}]
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}