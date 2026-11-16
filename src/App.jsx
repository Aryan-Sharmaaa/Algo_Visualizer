// src/App.jsx
import { useState } from "react";

import { binarySearchSteps } from "./algorithms/binarySearch";
import { dutchNationalFlagSteps } from "./algorithms/dutchNationalFlag";
import { rotatedBinarySearchSteps } from "./algorithms/rotatedBinarySearch";
import { mergeIntervalsSteps } from "./algorithms/mergeIntervals";

import InputPanel from "./components/InputPanel";
import ArrayVisualizer from "./components/visualizers/ArrayVisualizer";
import MergeIntervalsVisualizer from "./components/visualizers/MergeIntervalsVisualizer";
import StepControls from "./components/StepControls";
import ExplanationPanel from "./components/ExplanationPanel";

const PROBLEMS = {
  binary: {
    label: "Binary Search",
    defaultInput: {
      arr: [1, 3, 5, 7, 9, 11, 13, 15],
      target: 7,
    },
    run: ({ arr, target }) => binarySearchSteps(arr, target),
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      explanation:
        "Each iteration halves the remaining search space.",
    },
  },

  rotated: {
    label: "Rotated Binary Search",
    defaultInput: {
      arr: [4, 5, 6, 7, 0, 1, 2],
      target: 0,
    },
    run: ({ arr, target }) =>
      rotatedBinarySearchSteps(arr, target),
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      explanation:
        "Each iteration finds the sorted half and eliminates the other half.",
    },
  },

  dutch: {
    label: "Dutch National Flag",
    defaultInput: {
      arr: [2, 0, 2, 1, 1, 0],
    },
    run: ({ arr }) => dutchNationalFlagSteps(arr),
    complexity: {
      time: "O(n)",
      space: "O(1)",
      explanation:
        "Three pointers partition the array into 0s, 1s and 2s in one pass.",
    },
  },

  merge: {
    label: "Merge Intervals",
    defaultInput: {
      intervals: [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ],
    },
    run: ({ intervals }) => mergeIntervalsSteps(intervals),
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
      explanation:
        "Intervals are sorted by start value and then merged in a single pass.",
    },
  },
};

export default function App() {
  const [problemKey, setProblemKey] = useState("binary");

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const problem = PROBLEMS[problemKey];

  function handleRun(input) {
    const generated = problem.run(input);

    setSteps(generated);
    setCurrentStep(0);
  }

  const step = steps[currentStep];

  const isMergeIntervals = problemKey === "merge";

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Algorithm Visualizer
        </h1>

        <p className="text-gray-400 mb-8">
          Learn algorithms visually, one step at a time.
        </p>

        <div className="mb-6">

          <label className="block mb-2 font-semibold">
            Choose Algorithm
          </label>

          <select
            value={problemKey}
            onChange={(e) => {
              setProblemKey(e.target.value);
              setSteps([]);
              setCurrentStep(0);
            }}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
          >
            <option value="binary">
              Binary Search
            </option>

            <option value="rotated">
              Rotated Binary Search
            </option>

            <option value="dutch">
              Dutch National Flag
            </option>

            <option value="merge">
              Merge Intervals
            </option>
          </select>

        </div>

        <InputPanel
          problemKey={problemKey}
          defaultInput={problem.defaultInput}
          onRun={handleRun}
        />

        <div className="mt-6 mb-6 text-sm">

          <span className="text-green-400 mr-5">
            Time: {problem.complexity.time}
          </span>

          <span className="text-yellow-400 mr-5">
            Space: {problem.complexity.space}
          </span>

          <div className="mt-2 text-gray-400">
            {problem.complexity.explanation}
          </div>

        </div>

        {steps.length > 0 && (
          <>
            {isMergeIntervals ? (
              <MergeIntervalsVisualizer step={step} />
            ) : (
              <ArrayVisualizer step={step} />
            )}

            <StepControls
              total={steps.length}
              current={currentStep}
              onChange={setCurrentStep}
            />

            <ExplanationPanel
              step={step}
            />
          </>
        )}

      </div>

    </div>
  );
}