// src/components/visualizers/ArrayVisualizer.jsx

/**
 * ArrayVisualizer
 *
 * Renders one row of boxes — one per array element.
 * Works for both Binary Search and Dutch National Flag (and future algorithms)
 * by reading only the state fields that are present in each step.
 *
 * Binary Search state:  { arr, low, high, mid, found }
 * Dutch National Flag:  { arr, low, mid, high, found }
 *
 * The component adapts automatically — it checks which fields are defined
 * rather than being wired to one algorithm's shape.
 *
 * Highlight priority (highest to lowest):
 *   found  → green    Binary Search: target located here
 *   mid    → yellow   both: the pointer being actively examined
 *   low    → blue     both: left boundary
 *   high   → purple   both: right boundary
 *   inside unsorted window → normal (gray-700)
 *   outside window (Binary Search) → faded/dimmed
 *
 * Note on DNF coloring:
 *   In DNF, elements are never truly "eliminated" — every element is either
 *   sorted into a partition or still unsorted. So we do NOT fade elements
 *   outside [low..high] the way Binary Search does.  Instead we show the
 *   full array at normal brightness so the partition boundaries are visible.
 *   The action field on the step tells us which mode to use.
 */
export default function ArrayVisualizer({ step }) {
  if (!step) return null;

  const { arr, low, high, mid, found } = step.state;

  // Determine which algorithm this step belongs to by checking the action name.
  const isDNF = DNF_ACTIONS.has(step.action);

  return (
    <div className="max-w-2xl mx-auto my-8">

      {/* ── Legend — adapts to algorithm ── */}
      <div className="flex flex-wrap gap-4 justify-center mb-5 text-xs text-gray-400">
        <LegendItem color="bg-blue-500"   label="low"  />
        <LegendItem color="bg-yellow-400" label="mid"  />
        <LegendItem color="bg-purple-500" label="high" />
        {isDNF  && <LegendItem color="bg-green-700"  label="sorted ✓"   />}
        {!isDNF && <LegendItem color="bg-green-500"  label="found ✓"    />}
        {!isDNF && <LegendItem color="bg-gray-800 opacity-40" label="eliminated" />}
      </div>

      {/* ── Array boxes ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {arr.map((value, idx) => {
          const { boxClass, labelText } = isDNF
            ? getDNFBoxStyle(idx, { low, mid, high, action: step.action })
            : getBSBoxStyle(idx, { low, high, mid, found });

          return (
            <div key={idx} className="flex flex-col items-center gap-1">

              {/* Value box */}
              <div className={`w-12 h-12 flex items-center justify-center rounded
                              text-base font-bold border border-gray-600
                              transition-colors duration-150 ${boxClass}`}>
                {value}
              </div>

              {/* Label below the box */}
              <span className="text-xs text-gray-400 h-4">
                {labelText ?? idx}
              </span>

            </div>
          );
        })}
      </div>

      {/* ── Footer summary — different text per algorithm ── */}
      {isDNF
        ? <DNFSummary low={low} mid={mid} high={high} total={arr.length} action={step.action} />
        : <BSSummary  low={low} high={high} found={found} arr={arr} />
      }

    </div>
  );
}

// ─── Action sets ─────────────────────────────────────────────────────────────

// All action strings used by DNF. Used to detect which algorithm a step is from.
const DNF_ACTIONS = new Set([
  "swap_low",
  "increment_low_mid",
  "increment_mid",
  "swap_high",
  "decrement_high",
  "complete",
]);

// ─── Binary Search box styling ───────────────────────────────────────────────

/**
 * getBSBoxStyle
 * Priority: found > mid > low > high > in-window > out-of-window
 */
function getBSBoxStyle(idx, { low, high, mid, found }) {
  if (idx === found) {
    return { boxClass: "bg-green-500 text-white",     labelText: "✓ found" };
  }
  if (idx === mid) {
    return { boxClass: "bg-yellow-400 text-gray-900", labelText: "mid" };
  }
  if (idx === low) {
    return { boxClass: "bg-blue-500 text-white",      labelText: "low" };
  }
  if (idx === high) {
    return { boxClass: "bg-purple-500 text-white",    labelText: "high" };
  }
  if (low !== null && high !== null && idx > low && idx < high) {
    return { boxClass: "bg-gray-700 text-white",      labelText: null };
  }
  // Outside the active window — dimmed to show it's been eliminated
  return { boxClass: "bg-gray-800 text-gray-600 opacity-40", labelText: null };
}

// ─── Dutch National Flag box styling ─────────────────────────────────────────

/**
 * getDNFBoxStyle
 *
 * Colors each box based on which partition it belongs to:
 *   idx < low          → confirmed 0 partition  (green-900, dark)
 *   low <= idx < mid   → confirmed 1 partition  (gray-600)
 *   mid <= idx <= high → unsorted               (gray-700)
 *   idx > high         → confirmed 2 partition  (indigo-900, dark)
 *
 * Pointer labels (low, mid, high) take visual precedence over partition color
 * so the user always knows where the boundaries are.
 *
 * On the "complete" action we show the full sorted array in partition colors
 * without any pointer highlights.
 */
function getDNFBoxStyle(idx, { low, mid, high, action }) {
  const isComplete = action === "complete";

  // ── Pointer highlights (only when not complete) ──
  if (!isComplete) {
    // A single index can be both low AND mid — mid label wins.
    if (idx === mid && idx === low) {
      return { boxClass: "bg-yellow-400 text-gray-900", labelText: "low/mid" };
    }
    if (idx === mid) {
      return { boxClass: "bg-yellow-400 text-gray-900", labelText: "mid" };
    }
    if (idx === low) {
      return { boxClass: "bg-blue-500 text-white",      labelText: "low" };
    }
    if (idx === high) {
      return { boxClass: "bg-purple-500 text-white",    labelText: "high" };
    }
  }

  // ── Partition coloring ──
  if (idx < low) {
    // Confirmed 0 — left partition
    return { boxClass: "bg-green-900 text-green-300", labelText: null };
  }
  if (idx < mid) {
    // Confirmed 1 — middle partition
    return { boxClass: "bg-gray-600 text-white",      labelText: null };
  }
  if (idx <= high) {
    // Unsorted — unknown region
    return { boxClass: "bg-gray-700 text-white",      labelText: null };
  }
  // Confirmed 2 — right partition
  return { boxClass: "bg-indigo-900 text-indigo-300", labelText: null };
}

// ─── Shared helper components ─────────────────────────────────────────────────

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}

/**
 * BSSummary — shows the active window size for Binary Search.
 */
function BSSummary({ low, high, found, arr }) {
  if (found !== null) return null;

  const windowSize = high - low + 1;

  if (windowSize <= 0) {
    return (
      <p className="text-center text-sm text-gray-500 mt-4">
        Search window is empty — all indices eliminated.
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-gray-500 mt-4">
      Active window: indices{" "}
      <span className="text-blue-400 font-semibold">{low}</span>
      {" "}–{" "}
      <span className="text-purple-400 font-semibold">{high}</span>
      {" "}({windowSize} element{windowSize !== 1 ? "s" : ""} remaining)
    </p>
  );
}

/**
 * DNFSummary — shows the three partition sizes for Dutch National Flag.
 */
function DNFSummary({ low, mid, high, total, action }) {
  if (action === "complete") {
    return (
      <p className="text-center text-sm text-green-500 mt-4 font-medium">
        ✓ Array fully sorted — single pass complete.
      </p>
    );
  }

  const zeros    = low;
  const ones     = Math.max(0, mid - low);
  const unsorted = Math.max(0, high - mid + 1);
  const twos     = Math.max(0, total - high - 1);

  return (
    <p className="text-center text-sm text-gray-500 mt-4">
      <span className="text-green-400">{zeros} zero{zeros !== 1 ? "s" : ""}</span>
      {" · "}
      <span className="text-gray-300">{ones} one{ones !== 1 ? "s" : ""}</span>
      {" · "}
      <span className="text-yellow-400">{unsorted} unsorted</span>
      {" · "}
      <span className="text-indigo-400">{twos} two{twos !== 1 ? "s" : ""}</span>
    </p>
  );
}
