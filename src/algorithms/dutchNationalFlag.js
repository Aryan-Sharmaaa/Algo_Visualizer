// src/algorithms/dutchNationalFlag.js

/**
 * dutchNationalFlagSteps(arr)
 *
 * Implements the Dutch National Flag algorithm (Dijkstra's 3-way partition).
 * Sorts an array containing only 0s, 1s, and 2s in a single pass — O(n) time,
 * O(1) space — without counting or using extra arrays.
 *
 * Three pointers divide the array into four regions at all times:
 *
 *   [0 .. low-1]   → confirmed 0s  (left partition)
 *   [low .. mid-1] → confirmed 1s  (middle partition)
 *   [mid .. high]  → unsorted / unknown
 *   [high+1 .. n-1]→ confirmed 2s  (right partition)
 *
 * mid is the "cursor" that walks forward. We only advance mid when the
 * element at mid is placed correctly (0 or 1). When we find a 2, we swap
 * it to the back and shrink high — mid does NOT advance yet, because the
 * element that came from high is still unexamined.
 *
 * Each state shape:
 * {
 *   arr   : number[],   // snapshot of the array at this moment
 *   low   : number,     // left boundary pointer
 *   mid   : number,     // current scanning pointer
 *   high  : number,     // right boundary pointer
 *   found : null,       // always null — keeps ArrayVisualizer compatible
 * }
 *
 * `found` is always null here. ArrayVisualizer checks for `found` to decide
 * whether to show the "window summary" footer — null means "still running",
 * which is correct for every step including the final one (we never "find" a
 * target; we just finish sorting).
 */
export function dutchNationalFlagSteps(arr) {
  // Work on a copy so we never mutate the caller's array.
  const a = [...arr];
  const steps = [];

  let low  = 0;
  let mid  = 0;
  let high = a.length - 1;

  // ── Step 0: Initialization ───────────────────────────────────────────────
  steps.push({
    stepNumber: 0,
    state: { arr: [...a], low, mid, high, found: null },
    action: "initialize",
    explanation:
      `We place three pointers: low = 0, mid = 0, high = ${high}. ` +
      `Everything before low is a confirmed 0. Everything between low and mid is a confirmed 1. ` +
      `Everything after high is a confirmed 2. ` +
      `Mid is our scanner — it moves forward through the unknown region [mid..high] ` +
      `and places each element into the correct partition.`,
  });

  // ── Main loop ─────────────────────────────────────────────────────────────
  while (mid <= high) {

    if (a[mid] === 0) {
      // ── Swap with low ────────────────────────────────────────────────────
      // arr[mid] is 0, but mid is inside the "confirmed 1s" zone.
      // We need to push this 0 into the left partition by swapping with low.
      // After the swap, arr[low] is 0 (correct) and arr[mid] is now a 1
      // (because low..mid-1 held only 1s before this). Both pointers advance.
      steps.push({
        stepNumber: steps.length,
        state: { arr: [...a], low, mid, high, found: null },
        action: "swap_low",
        explanation:
          `arr[mid] = arr[${mid}] is 0, but it sits inside the unsorted region. ` +
          `0 belongs in the left partition, so we swap arr[${mid}] with arr[low] (arr[${low}] = ${a[low]}). ` +
          `This extends the confirmed-0 region. ` +
          `The element that moved to mid is guaranteed to be a 1 (low..mid-1 held only 1s), ` +
          `so both low and mid can safely advance.`,
      });

      // Perform the swap
      [a[low], a[mid]] = [a[mid], a[low]];
      low++;
      mid++;

      steps.push({
        stepNumber: steps.length,
        state: { arr: [...a], low, mid, high, found: null },
        action: "increment_low_mid",
        explanation:
          `After the swap, arr[${low - 1}] is now a confirmed 0 and arr[${mid - 1}] is a confirmed 1. ` +
          `We advance low to ${low} (expanding the 0-zone boundary) ` +
          `and mid to ${mid} (moving the scanner forward to the next unknown element).`,
      });

    } else if (a[mid] === 1) {
      // ── 1 is already in the right place — just advance mid ───────────────
      // The middle partition [low..mid-1] holds confirmed 1s.
      // arr[mid] = 1 means it already belongs exactly where it is.
      // No swap needed — just grow the confirmed-1 region by moving mid forward.
      steps.push({
        stepNumber: steps.length,
        state: { arr: [...a], low, mid, high, found: null },
        action: "increment_mid",
        explanation:
          `arr[mid] = arr[${mid}] is 1, which belongs in the middle partition. ` +
          `No swap is needed — 1 is already in the correct zone. ` +
          `We simply advance mid from ${mid} to ${mid + 1} to include this element ` +
          `in the confirmed-1 region and move on to the next unknown element.`,
      });

      mid++;

    } else {
      // a[mid] === 2
      // ── Swap with high ───────────────────────────────────────────────────
      // arr[mid] is 2, which belongs at the far right.
      // We swap it with arr[high] and shrink the unsorted window by decrementing high.
      // Crucially, mid does NOT advance — the element that came from high is unknown
      // and must be examined in the next iteration.
      steps.push({
        stepNumber: steps.length,
        state: { arr: [...a], low, mid, high, found: null },
        action: "swap_high",
        explanation:
          `arr[mid] = arr[${mid}] is 2, which belongs in the right partition. ` +
          `We swap arr[${mid}] with arr[high] (arr[${high}] = ${a[high]}) ` +
          `to push this 2 into the confirmed-2 zone. ` +
          `high shrinks from ${high} to ${high - 1} because index ${high} is now confirmed. ` +
          `mid does NOT advance — the element just moved to arr[${mid}] came from the ` +
          `unsorted region and is still unknown; we must re-examine it next iteration.`,
      });

      // Perform the swap
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;

      steps.push({
        stepNumber: steps.length,
        state: { arr: [...a], low, mid, high, found: null },
        action: "decrement_high",
        explanation:
          `After the swap, index ${high + 1} is now a confirmed 2. ` +
          `high moves to ${high}, shrinking the unsorted window to [${mid}..${high}]. ` +
          `mid stays at ${mid} because we haven't inspected the new arr[${mid}] yet.`,
      });
    }
  }

  // ── Completion ────────────────────────────────────────────────────────────
  // mid has crossed high — the unsorted region is empty.
  // Every element is in its correct partition.
  steps.push({
    stepNumber: steps.length,
    state: { arr: [...a], low, mid, high, found: null },
    action: "complete",
    explanation:
      `mid (${mid}) has crossed high (${high}), so the unsorted region is empty. ` +
      `All 0s are at indices 0–${low - 1}, all 1s at indices ${low}–${mid - 1}, ` +
      `and all 2s at indices ${mid}–${a.length - 1}. ` +
      `The array is fully sorted in a single pass — O(n) time, O(1) space.`,
  });

  return steps;
}
