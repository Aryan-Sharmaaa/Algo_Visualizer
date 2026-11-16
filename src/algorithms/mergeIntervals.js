// src/algorithms/mergeIntervals.js

/**
 * mergeIntervalsSteps(intervals)
 *
 * Given a list of intervals (each an array [start, end]), merges all
 * overlapping intervals and returns them as a sorted, non-overlapping list.
 *
 * Example:
 *   Input:  [[1,3],[2,6],[8,10],[15,18]]
 *   Output: [[1,6],[8,10],[15,18]]
 *
 * Algorithm:
 *   1. Sort intervals by their start value.
 *      After sorting, any interval that overlaps with the previous one
 *      MUST have a start ≤ the previous interval's end — so we only ever
 *      need to compare with the last interval in our result list.
 *   2. Walk through the sorted intervals one by one.
 *      - If the result list is empty, push the first interval directly.
 *      - Otherwise, compare the current interval's start with the last
 *        merged interval's end:
 *          • start ≤ last.end  → they overlap; extend last.end if needed.
 *          • start >  last.end → no overlap; push as a new separate interval.
 *
 * Time:  O(n log n) — dominated by the sort.
 * Space: O(n)       — the output list in the worst case holds all intervals.
 *
 * ─── Step shape (mirrors binarySearch.js conventions) ────────────────────────
 * {
 *   stepNumber  : number,
 *   state: {
 *     sorted        : [number, number][],   // full sorted input, never changes
 *     merged        : [number, number][],   // result list built so far (snapshot)
 *     currentIndex  : number | null,        // index into `sorted` being examined
 *     current       : [number, number] | null, // interval at currentIndex
 *     last          : [number, number] | null, // last interval in `merged`
 *     overlaps      : boolean | null,       // does current overlap with last?
 *     resultInterval: [number, number] | null, // interval written to merged this step
 *   },
 *   action      : string,   // machine-readable label (see ACTION list below)
 *   explanation : string,   // WHY — reasoning, not just what happened
 * }
 *
 * Actions:
 *   "initialize"      — array sorted, first state shown before processing
 *   "pick"            — we have selected the next interval to examine
 *   "first_interval"  — result list is empty; push without comparison
 *   "check_overlap"   — comparing current.start with last.end
 *   "merge"           — overlap detected; extending last.end
 *   "no_merge"        — no overlap; appending as a new separate interval
 *   "complete"        — all intervals processed; final result shown
 */
export function mergeIntervalsSteps(intervals) {
  const steps = [];

  // ── Guard: nothing to process ─────────────────────────────────────────────
  if (!intervals || intervals.length === 0) {
    steps.push({
      stepNumber: 0,
      state: {
        sorted: [],
        merged: [],
        currentIndex: null,
        current: null,
        last: null,
        overlaps: null,
        resultInterval: null,
      },
      action: "complete",
      explanation: "The input is empty — there are no intervals to merge.",
    });
    return steps;
  }

  // ── Sort by start value ───────────────────────────────────────────────────
  // We sort first so that any two intervals that could possibly overlap are
  // always adjacent in the list. This means we only ever need to look at the
  // LAST interval in our result — we never have to backtrack.
  const sorted = [...intervals]
    .map(iv => [iv[0], iv[1]])          // defensive copy of each pair
    .sort((a, b) => a[0] - b[0]);       // ascending by start

  // Working result list — we mutate this as we go, but snapshot it into every
  // step so each step's state is independent and safe to read later.
  let merged = [];

  // ── Step 0: Initialization ────────────────────────────────────────────────
  steps.push({
    stepNumber: 0,
    state: {
      sorted:         sorted,
      merged:         [],
      currentIndex:   null,
      current:        null,
      last:           null,
      overlaps:       null,
      resultInterval: null,
    },
    action: "initialize",
    explanation:
      `We start by sorting all ${sorted.length} interval${sorted.length !== 1 ? "s" : ""} ` +
      `by their start values: [${sorted.map(iv => `[${iv}]`).join(", ")}]. ` +
      `Sorting is the key step — once intervals are ordered by start, ` +
      `any overlap can only occur between an interval and the one immediately before it. ` +
      `This means we only ever need to compare with the LAST interval in our result list, ` +
      `giving us a simple single-pass O(n) merge after the O(n log n) sort.`,
  });

  // ── Main pass ─────────────────────────────────────────────────────────────
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // ── Pick step — announce which interval we are about to examine ─────────
    steps.push({
      stepNumber: steps.length,
      state: {
        sorted,
        merged:         [...merged],
        currentIndex:   i,
        current:        current,
        last:           merged.length > 0 ? merged[merged.length - 1] : null,
        overlaps:       null,
        resultInterval: null,
      },
      action: "pick",
      explanation:
        `We pick interval [${current}] (index ${i} in the sorted list). ` +
        (merged.length === 0
          ? `The result list is still empty, so there is nothing to compare against yet.`
          : `The last interval in our result is [${merged[merged.length - 1]}]. ` +
            `We will now check whether [${current}] overlaps with it.`),
    });

    // ── Special case: result list is empty — push directly ─────────────────
    if (merged.length === 0) {
      const added = [...current];   // snapshot
      merged.push(added);

      steps.push({
        stepNumber: steps.length,
        state: {
          sorted,
          merged:         [...merged],
          currentIndex:   i,
          current:        current,
          last:           null,           // there was no "last" before this push
          overlaps:       null,           // no comparison was needed
          resultInterval: added,
        },
        action: "first_interval",
        explanation:
          `The result list is empty, so we add [${current}] directly — ` +
          `there is nothing to overlap with. ` +
          `[${current}] becomes the starting point for our result.`,
      });

      continue;
    }

    // ── last is always the final element of merged ───────────────────────────
    const last = merged[merged.length - 1];

    // ── Check overlap ────────────────────────────────────────────────────────
    // Two intervals overlap when the current interval's START is at or before
    // the last merged interval's END.
    // Because we sorted by start, current.start >= last.start is always true,
    // so we only need this one comparison.
    const overlaps = current[0] <= last[1];

    steps.push({
      stepNumber: steps.length,
      state: {
        sorted,
        merged:         [...merged],
        currentIndex:   i,
        current:        current,
        last:           [...last],
        overlaps:       overlaps,
        resultInterval: null,
      },
      action: "check_overlap",
      explanation: overlaps
        ? `Current interval starts at ${current[0]}, and the last merged interval ends at ${last[1]}. ` +
          `Because ${current[0]} ≤ ${last[1]}, the two intervals overlap — ` +
          `they share at least the point ${current[0]}. ` +
          `We do NOT add a new interval; instead we extend the last one.`
        : `Current interval starts at ${current[0]}, and the last merged interval ends at ${last[1]}. ` +
          `Because ${current[0]} > ${last[1]}, there is a gap between them — they do NOT overlap. ` +
          `We must add [${current}] as a completely separate interval in the result.`,
    });

    if (overlaps) {
      // ── Merge: extend last.end if current reaches further right ──────────
      // We only update the END — the start stays the same because sorted order
      // guarantees current.start >= last.start.
      const oldEnd    = last[1];
      const newEnd    = Math.max(last[1], current[1]);
      last[1]         = newEnd;                 // mutate in-place inside merged[]
      const merged_iv = [...last];              // snapshot after update

      steps.push({
        stepNumber: steps.length,
        state: {
          sorted,
          merged:         [...merged],
          currentIndex:   i,
          current:        current,
          last:           merged_iv,
          overlaps:       true,
          resultInterval: merged_iv,
        },
        action: "merge",
        explanation:
          `[${current}] overlaps with the last merged interval. ` +
          `We extend the last interval's end from ${oldEnd} to ${newEnd} ` +
          `(taking the maximum of ${oldEnd} and ${current[1]}). ` +
          `We use max() because the current interval might be fully contained ` +
          `within the last one — in that case the end does not grow. ` +
          `The merged interval is now [${merged_iv}].`,
      });
    } else {
      // ── No overlap: append as a new separate interval ─────────────────────
      const added = [...current];
      merged.push(added);

      steps.push({
        stepNumber: steps.length,
        state: {
          sorted,
          merged:         [...merged],
          currentIndex:   i,
          current:        current,
          last:           added,
          overlaps:       false,
          resultInterval: added,
        },
        action: "no_merge",
        explanation:
          `[${current}] does not overlap with the last merged interval. ` +
          `The gap between ${last[1]} and ${current[0]} means these are two ` +
          `distinct ranges with no shared points. ` +
          `We append [${current}] to the result as its own separate interval. ` +
          `Result now has ${merged.length} interval${merged.length !== 1 ? "s" : ""}.`,
      });
    }
  }

  // ── Completion ─────────────────────────────────────────────────────────────
  steps.push({
    stepNumber: steps.length,
    state: {
      sorted,
      merged:         [...merged],
      currentIndex:   null,
      current:        null,
      last:           null,
      overlaps:       null,
      resultInterval: null,
    },
    action: "complete",
    explanation:
      `All ${sorted.length} interval${sorted.length !== 1 ? "s" : ""} have been processed. ` +
      `The final merged result contains ${merged.length} ` +
      `non-overlapping interval${merged.length !== 1 ? "s" : ""}: ` +
      `[${merged.map(iv => `[${iv}]`).join(", ")}]. ` +
      `Every pair of adjacent intervals in this result has a gap between them, ` +
      `so no further merging is possible.`,
  });

  return steps;
}
