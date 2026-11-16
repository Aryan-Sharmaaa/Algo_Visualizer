import { useState, useEffect } from "react";

export default function InputPanel({
  problemKey,
  defaultInput,
  onRun,
}) {
  const [arrText, setArrText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [intervalsText, setIntervalsText] = useState("");
  const [error, setError] = useState("");

  // Reset inputs whenever algorithm changes
  useEffect(() => {
    setError("");

    if (problemKey === "merge") {
      const formattedIntervals = defaultInput.intervals
        .map(([start, end]) => `${start},${end}`)
        .join("; ");

      setIntervalsText(formattedIntervals);
      setArrText("");
      setTargetText("");
      return;
    }

    setArrText(defaultInput.arr.join(", "));
    setTargetText(defaultInput.target ?? "");
    setIntervalsText("");
  }, [defaultInput, problemKey]);

  function handleRun() {
    setError("");

    // -----------------------------------------
    // MERGE INTERVALS
    // -----------------------------------------
    if (problemKey === "merge") {
      if (!intervalsText.trim()) {
        setError("Please enter at least one interval.");
        return;
      }

      try {
        const intervals = intervalsText
          .split(";")
          .map((interval) => {
            const values = interval
              .split(",")
              .map((x) => Number(x.trim()));

            if (
              values.length !== 2 ||
              values.some((x) => Number.isNaN(x))
            ) {
              throw new Error();
            }

            if (values[0] > values[1]) {
              throw new Error();
            }

            return values;
          });

        onRun({
          intervals,
        });
      } catch {
        setError(
          "Invalid intervals. Use the format: 1,3; 2,6; 8,10; 15,18"
        );
      }

      return;
    }

    // -----------------------------------------
    // ARRAY-BASED ALGORITHMS
    // -----------------------------------------
    const arr = arrText
      .split(",")
      .map((x) => Number(x.trim()));

    if (
      !arrText.trim() ||
      arr.length === 0 ||
      arr.some((x) => Number.isNaN(x))
    ) {
      setError("Array contains invalid numbers.");
      return;
    }

    // -----------------------------------------
    // BINARY SEARCH / ROTATED BINARY SEARCH
    // -----------------------------------------
    if (
      problemKey === "binary" ||
      problemKey === "rotated"
    ) {
      const target = Number(targetText);

      if (Number.isNaN(target)) {
        setError("Please enter a valid target.");
        return;
      }

      if (problemKey === "binary") {
        onRun({
          arr: [...arr].sort((a, b) => a - b),
          target,
        });
      } else {
        onRun({
          arr,
          target,
        });
      }

      return;
    }

    // -----------------------------------------
    // DUTCH NATIONAL FLAG
    // -----------------------------------------
    if (problemKey === "dutch") {
      for (const x of arr) {
        if (x !== 0 && x !== 1 && x !== 2) {
          setError(
            "Dutch National Flag only accepts 0, 1 and 2."
          );
          return;
        }
      }

      onRun({
        arr,
      });
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">

      {/* MERGE INTERVALS INPUT */}
      {problemKey === "merge" ? (
        <>
          <label className="block mb-2 font-semibold">
            Intervals
          </label>

          <input
            className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700 mb-4"
            value={intervalsText}
            onChange={(e) => setIntervalsText(e.target.value)}
            placeholder="1,3; 2,6; 8,10; 15,18"
          />

          <p className="text-sm text-gray-400 mb-4">
            Enter intervals separated by semicolons.
            Example: 1,3; 2,6; 8,10; 15,18
          </p>
        </>
      ) : (
        <>
          {/* ARRAY INPUT */}
          <label className="block mb-2 font-semibold">
            Array
          </label>

          <input
            className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700 mb-4"
            value={arrText}
            onChange={(e) => setArrText(e.target.value)}
          />

          {/* TARGET INPUT */}
          {(problemKey === "binary" ||
            problemKey === "rotated") && (
            <>
              <label className="block mb-2 font-semibold">
                Target
              </label>

              <input
                className="w-full rounded bg-gray-900 px-3 py-2 border border-gray-700 mb-4"
                value={targetText}
                onChange={(e) =>
                  setTargetText(e.target.value)
                }
              />
            </>
          )}

          {/* BINARY SEARCH HELP */}
          {problemKey === "binary" && (
            <p className="text-sm text-gray-400 mb-4">
              Array will be sorted automatically before
              running Binary Search.
            </p>
          )}

          {/* ROTATED BINARY SEARCH HELP */}
          {problemKey === "rotated" && (
            <p className="text-sm text-gray-400 mb-4">
              Enter a rotated sorted array.
              Example: 4, 5, 6, 7, 0, 1, 2
            </p>
          )}

          {/* DUTCH NATIONAL FLAG HELP */}
          {problemKey === "dutch" && (
            <p className="text-sm text-gray-400 mb-4">
              Enter only 0, 1 and 2 values.
            </p>
          )}
        </>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* RUN BUTTON */}
      <button
        onClick={handleRun}
        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded font-semibold"
      >
        Run
      </button>

    </div>
  );
}