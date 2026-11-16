// src/algorithms/rotatedBinarySearch.js

/**
 * rotatedBinarySearchSteps(arr, target)
 *
 * Searches for `target` in a sorted array that has been rotated at some
 * unknown pivot — e.g. [4, 5, 6, 7, 0, 1, 2] is [0,1,2,4,5,6,7] rotated.
 *
 * Key insight:
 *   Even after rotation, splitting at mid ALWAYS produces at least one half
 *   that is fully sorted. We identify which half is sorted, check whether
 *   the target falls inside that sorted range, and discard the other half.
 *   This preserves the O(log n) complexity of binary search.
 *
 * Each step shape (identical to binarySearch.js, with `target` added to state):
 * {
 *   stepNumber : number,
 *   state      : { arr, low, high, mid, found, target },
 *   action     : string,
 *   explanation: string,
 * }
 *
 * `found` is:
 *   null  → still searching
 *   >= 0  → index where target was found
 *   -1    → target does not exist in the array
 *
 * Actions used (same set as binarySearch.js so ExplanationPanel colors match):
 *   "initialize" — starting state
 *   "found"      — target located at mid
 *   "move_low"   — eliminate left half, advance low
 *   "move_high"  — eliminate right half, retreat high
 *   "not_found"  — search space exhausted
 */
export function rotatedBinarySearchSteps(arr, target) {
  const steps = [];

  let low  = 0;
  let high = arr.length - 1;

  // ── Step 0: Initialization ────────────────────────────────────────────────
  steps.push({
    stepNumber: 0,
    state: { arr, low, high, mid: null, found: null, target },
    action: "initialize",
    explanation:
      `We start with the full array in scope: low = 0, high = ${high}, target = ${target}. ` +
      `The array was originally sorted but has been rotated at an unknown pivot, ` +
      `so we cannot simply compare arr[mid] with target and discard a half — ` +
      `the usual rule only works on fully sorted halves. ` +
      `The trick: splitting at mid ALWAYS leaves at least one half that is ` +
      `still sorted (its left value ≤ its right value). We will identify that ` +
      `sorted half each iteration, check if target belongs there, and discard ` +
      `the other half — keeping O(log n) time.`,
  });

  // ── Main loop ─────────────────────────────────────────────────────────────
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // ── Case 1: Found ────────────────────────────────────────────────────────
    if (arr[mid] === target) {
      steps.push({
        stepNumber: steps.length,
        state: { arr, low, high, mid, found: mid, target },
        action: "found",
        explanation:
          `arr[${mid}] = ${arr[mid]}, which equals the target ${target}. ` +
          `Search complete — target found at index ${mid}.`,
      });
      return steps;
    }

    // ── Identify which half is sorted ─────────────────────────────────────
    // If arr[low] <= arr[mid], the LEFT half [low..mid] is fully sorted
    // (the rotation point, if any, lies in the right half).
    // Otherwise, the RIGHT half [mid..high] is fully sorted.

    const leftSorted = arr[low] <= arr[mid];

    if (leftSorted) {
      // ── Left half [low..mid] is sorted ──────────────────────────────────

      if (target >= arr[low] && target < arr[mid]) {
        // Target lies strictly inside the sorted left half →  discard right
        steps.push({
          stepNumber: steps.length,
          state: { arr, low, high, mid, found: null, target },
          action: "move_high",
          explanation:
            `arr[${low}] = ${arr[low]} ≤ arr[${mid}] = ${arr[mid]}, so the LEFT half ` +
            `[${low}..${mid}] is fully sorted. ` +
            `Target ${target} falls in the range [${arr[low]}, ${arr[mid] - 1}], ` +
            `which means it must be somewhere in that sorted left half. ` +
            `We eliminate the right half entirely by setting high = mid - 1 = ${mid - 1}. ` +
            `Search window shrinks to [${low}, ${mid - 1}].`,
        });
        high = mid - 1;
      } else {
        // Target is outside the sorted left half → it can only be in the right half
        steps.push({
          stepNumber: steps.length,
          state: { arr, low, high, mid, found: null, target },
          action: "move_low",
          explanation:
            `arr[${low}] = ${arr[low]} ≤ arr[${mid}] = ${arr[mid]}, so the LEFT half ` +
            `[${low}..${mid}] is fully sorted. ` +
            `Target ${target} does NOT fall in the sorted range [${arr[low]}, ${arr[mid] - 1}], ` +
            `so it cannot be in the left half. ` +
            `We eliminate the left half entirely by setting low = mid + 1 = ${mid + 1}. ` +
            `Search window shrinks to [${mid + 1}, ${high}].`,
        });
        low = mid + 1;
      }
    } else {
      // ── Right half [mid..high] is sorted ────────────────────────────────

      if (target > arr[mid] && target <= arr[high]) {
        // Target lies strictly inside the sorted right half → discard left
        steps.push({
          stepNumber: steps.length,
          state: { arr, low, high, mid, found: null, target },
          action: "move_low",
          explanation:
            `arr[${low}] = ${arr[low]} > arr[${mid}] = ${arr[mid]}, so the RIGHT half ` +
            `[${mid}..${high}] is fully sorted. ` +
            `Target ${target} falls in the range [${arr[mid] + 1}, ${arr[high]}], ` +
            `which means it must be somewhere in that sorted right half. ` +
            `We eliminate the left half entirely by setting low = mid + 1 = ${mid + 1}. ` +
            `Search window shrinks to [${mid + 1}, ${high}].`,
        });
        low = mid + 1;
      } else {
        // Target is outside the sorted right half → it can only be in the left half
        steps.push({
          stepNumber: steps.length,
          state: { arr, low, high, mid, found: null, target },
          action: "move_high",
          explanation:
            `arr[${low}] = ${arr[low]} > arr[${mid}] = ${arr[mid]}, so the RIGHT half ` +
            `[${mid}..${high}] is fully sorted. ` +
            `Target ${target} does NOT fall in the sorted range [${arr[mid] + 1}, ${arr[high]}], ` +
            `so it cannot be in the right half. ` +
            `We eliminate the right half entirely by setting high = mid - 1 = ${mid - 1}. ` +
            `Search window shrinks to [${low}, ${mid - 1}].`,
        });
        high = mid - 1;
      }
    }
  }

  // ── Not Found ──────────────────────────────────────────────────────────────
  // low has crossed high — every possible index has been eliminated.
  steps.push({
    stepNumber: steps.length,
    state: { arr, low, high, mid: null, found: -1, target },
    action: "not_found",
    explanation:
      `low (${low}) is now greater than high (${high}). ` +
      `Every index in the array has been ruled out — each iteration we ` +
      `identified the sorted half and confirmed the target could not be there, ` +
      `then discarded it. No positions remain. ` +
      `Target ${target} does not exist in this array — we return -1.`,
  });

  return steps;
}
