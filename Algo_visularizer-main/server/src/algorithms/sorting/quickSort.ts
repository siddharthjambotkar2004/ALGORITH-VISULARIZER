import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Quick Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n log n) average case, O(n²) worst case.
 * - Space: O(log n) auxiliary (recursion stack).
 */
export function getQuickSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n },
    description: 'Starting Quick Sort'
  });

  function partition(arr: number[], low: number, high: number): number {
    const pivotVal = arr[high];
    if (pivotVal === undefined) return low;
    
    let pivot = low;
    steps.push({
      array: [...arr],
      activeLine: 10,
      variables: { low, high, pivot, pivotVal },
      description: `Selecting pivot: ${pivotVal} at index ${high}`
    });

    for (let i = low; i < high; i++) {
      const v = arr[i];
      if (v !== undefined) {
        steps.push({
          array: [...arr],
          comparing: [i, high],
          activeLine: 15,
          variables: { low, high, pivot, pivotVal, i },
          description: `Comparing ${v} with pivot ${pivotVal}`
        });

        if (v <= pivotVal) {
          const val1 = arr[i];
          const val2 = arr[pivot];
          
          if (val1 !== undefined && val2 !== undefined) {
            arr[i] = val2;
            arr[pivot] = val1;
            
            steps.push({
              array: [...arr],
              swapping: [i, pivot],
              activeLine: 20,
              variables: { low, high, pivot, pivotVal, i },
              description: `Swapping ${val1} and ${val2}`
            });
            pivot++;
          }
        }
      }
    }

    const val1 = arr[pivot];
    const val2 = arr[high];
    
    if (val1 !== undefined && val2 !== undefined) {
      arr[pivot] = val2;
      arr[high] = val1;
      
      steps.push({
        array: [...arr],
        swapping: [pivot, high],
        activeLine: 25,
        variables: { low, high, pivot, pivotVal },
        description: `Moving pivot ${pivotVal} to final position ${pivot}`
      });
    }

    return pivot;
  }

  function solve(arr: number[], low: number, high: number) {
    if (low >= high) return;

    steps.push({
      array: [...arr],
      activeLine: 5,
      variables: { low, high },
      description: `Partitioning subarray from ${low} to ${high}`
    });

    const pi = partition(arr, low, high);
    solve(arr, low, pi - 1);
    solve(arr, pi + 1, high);
  }

  solve(array, 0, n - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 30,
    variables: {},
    description: 'Quick Sort completed!'
  });

  return steps;
}
