// src/algorithms/binarySearch.js

/**
 * binarySearchSteps(arr, target)
 *
 * Runs binary search and records every decision as a step.
 * Returns an array of step objects — the UI walks through them one by one.
 *
 * Each step shape:
 * {
 *   stepNumber  : number,
 *   state       : { arr, low, high, mid, found },
 *   action      : string,   // short machine-readable label
 *   explanation : string,   // WHY this is happening, not just what
 * }
 *
 * `found` is:
 *   null  → still searching
 *   >= 0  → index where target was found
 *   -1    → target does not exist in the array
 */
export function binarySearchSteps(arr, target) {
  const steps = [];

  let low  = 0;
  let high = arr.length - 1;

  // ── Step 0: Initialization ────────────────────────────────────────────────
  // We record this before any comparison so the user can see the starting state.
  steps.push({
    stepNumber: 0,
    state: {
      arr,
      low,
      high,
      mid: null,   // no mid yet — we haven't picked one
      found: null,
    },
    action: "initialize",
    explanation:
      `We start with the entire array in scope: low = 0, high = ${high}. ` +
      `Binary search works by repeatedly halving the search space. ` +
      `This is only valid because the array is sorted — ` +
      `so we can confidently discard any half that cannot contain the target.`,
  });

  // ── Main loop ─────────────────────────────────────────────────────────────
  while (low <= high) {
    // Pick the middle index. Using Math.floor((low + high) / 2) avoids the
    // integer-overflow bug you'd get with (low + high) >> 1 in some languages.
    const mid = Math.floor((low + high) / 2);

    // ── Case 1: Found ────────────────────────────────────────────────────
    if (arr[mid] === target) {
      steps.push({
        stepNumber: steps.length,
        state: { arr, low, high, mid, found: mid },
        action: "found",
        explanation:
          `arr[${mid}] = ${arr[mid]}, which equals our target ${target}. ` +
          `The search is complete — the target exists at index ${mid}.`,
      });
      return steps; // early exit, no need to continue
    }

    // ── Case 2: Mid is too small → eliminate the entire left half ────────
    if (arr[mid] < target) {
      steps.push({
        stepNumber: steps.length,
        state: { arr, low, high, mid, found: null },
        action: "move_low",
        explanation:
          `arr[${mid}] = ${arr[mid]}, which is less than target ${target}. ` +
          `Because the array is sorted, every element to the LEFT of mid ` +
          `(indices 0 – ${mid}) is also smaller than ${target} — ` +
          `so we safely eliminate all of them at once. ` +
          `We set low = mid + 1 = ${mid + 1}, shrinking the search window to [${mid + 1}, ${high}].`,
      });
      low = mid + 1;
    }

    // ── Case 3: Mid is too large → eliminate the entire right half ───────
    else {
      steps.push({
        stepNumber: steps.length,
        state: { arr, low, high, mid, found: null },
        action: "move_high",
        explanation:
          `arr[${mid}] = ${arr[mid]}, which is greater than target ${target}. ` +
          `Because the array is sorted, every element to the RIGHT of mid ` +
          `(indices ${mid} – ${high}) is also larger than ${target} — ` +
          `so we safely eliminate all of them at once. ` +
          `We set high = mid - 1 = ${mid - 1}, shrinking the search window to [${low}, ${mid - 1}].`,
      });
      high = mid - 1;
    }
  }

  // ── Not Found ─────────────────────────────────────────────────────────────
  // low has crossed high — every possible index has been eliminated.
  steps.push({
    stepNumber: steps.length,
    state: {
      arr,
      low,
      high,
      mid: null,
      found: -1,   // -1 is the conventional "not found" signal
    },
    action: "not_found",
    explanation:
      `low (${low}) is now greater than high (${high}). ` +
      `This means every index in the array has been ruled out as a possible position for ${target}. ` +
      `The target does not exist in this array — we return -1.`,
  });

  return steps;
}
