// src/components/StepControls.jsx

export default function StepControls({ total, current, onChange }) {
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="flex flex-col items-center gap-4 my-6">

      {/* Step counter */}
      <p className="text-sm text-gray-400">
        Step <span className="text-white font-semibold">{current + 1}</span> of{" "}
        <span className="text-white font-semibold">{total}</span>
      </p>

      {/* Prev / Next buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => onChange(current - 1)}
          disabled={isFirst}
          className="px-5 py-2 rounded bg-gray-700 text-white font-medium
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-gray-600 transition-colors"
        >
          ← Prev
        </button>

        <button
          onClick={() => onChange(current + 1)}
          disabled={isLast}
          className="px-5 py-2 rounded bg-blue-600 text-white font-medium
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-blue-500 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Slider to jump to any step */}
      <input
        type="range"
        min={0}
        max={total - 1}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-md accent-blue-500"
      />
    </div>
  );
}
