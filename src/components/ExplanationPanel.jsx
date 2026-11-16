// src/components/ExplanationPanel.jsx

// Maps each action string to a color so the label is scannable at a glance.
const ACTION_COLORS = {
  initialize:  "bg-gray-600 text-gray-200",
  move_low:    "bg-blue-700 text-blue-100",
  move_high:   "bg-purple-700 text-purple-100",
  found:       "bg-green-700 text-green-100",
  not_found:   "bg-red-700 text-red-100",
};

// Human-readable labels for each action key.
const ACTION_LABELS = {
  initialize:  "Initialize",
  move_low:    "Eliminate Left Half",
  move_high:   "Eliminate Right Half",
  found:       "Target Found ✓",
  not_found:   "Target Not Found ✗",
};

export default function ExplanationPanel({ step }) {
  if (!step) return null;

  const colorClass = ACTION_COLORS[step.action] ?? "bg-gray-700 text-gray-200";
  const label = ACTION_LABELS[step.action] ?? step.action;

  return (
    <div className="max-w-2xl mx-auto mt-4 rounded-lg overflow-hidden border border-gray-700">

      {/* Action badge — quick visual summary of what just happened */}
      <div className={`px-4 py-2 text-sm font-semibold tracking-wide ${colorClass}`}>
        {label}
      </div>

      {/* Explanation — this is the main focus, WHY not just WHAT */}
      <div className="bg-gray-800 px-5 py-4 text-gray-200 text-sm leading-relaxed">
        {step.explanation}
      </div>

    </div>
  );
}
