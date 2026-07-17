import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Selection Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n²) in all cases (best, average, worst).
 * - Space: O(1) auxiliary.
 */
export function getSelectionSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n },
    description: 'Starting Selection Sort'
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...array],
      activeLine: 2,
      variables: { i, minIdx, n },
      description: `Assume element at index ${i} is minimum`
    });

    for (let j = i + 1; j < n; j++) {
      const v1 = array[j];
      const v2 = array[minIdx];

      steps.push({
        array: [...array],
        comparing: [j, minIdx],
        activeLine: 4,
        variables: { i, minIdx, j, n },
        description: `Comparing A[j] (${v1}) with current minimum A[minIdx] (${v2})`
      });

      if (v1 !== undefined && v2 !== undefined && v1 < v2) {
        minIdx = j;
        steps.push({
          array: [...array],
          activeLine: 5,
          variables: { i, minIdx, j, n },
          description: `New minimum found at index ${minIdx}`
        });
      }
    }

    if (minIdx !== i) {
      const val1 = array[i];
      const val2 = array[minIdx];
      if (val1 !== undefined && val2 !== undefined) {
        array[i] = val2;
        array[minIdx] = val1;
        steps.push({
          array: [...array],
          swapping: [i, minIdx],
          activeLine: 8,
          variables: { i, minIdx, n },
          description: `Swap minimum element ${val2} with element at index ${i}`
        });
      }
    }
    
    const lastStep = steps[steps.length - 1];
    const lastSorted = lastStep?.sorted || [];
    steps.push({
      array: [...array],
      sorted: [...lastSorted, i],
      activeLine: 9,
      variables: { i, n },
      description: `Element at index ${i} is now sorted`
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 10,
    variables: {},
    description: 'Selection Sort completed!'
  });

  return steps;
}
