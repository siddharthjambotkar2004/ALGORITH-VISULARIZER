import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Heap Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n log n) in all cases (best, average, worst).
 * - Space: O(1) auxiliary.
 */
export function getHeapSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n },
    description: 'Starting Heap Sort'
  });

  function heapify(arr: number[], length: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      array: [...arr],
      activeLine: 5,
      variables: { i, largest, left, right, length },
      description: `Heapifying index ${i}`
    });

    const leftVal = arr[left];
    const largestVal = arr[largest];
    if (left < length && leftVal !== undefined && largestVal !== undefined && leftVal > largestVal) {
      largest = left;
    }

    const rightVal = arr[right];
    const largestVal2 = arr[largest];
    if (right < length && rightVal !== undefined && largestVal2 !== undefined && rightVal > largestVal2) {
      largest = right;
    }

    if (largest !== i) {
      const val1 = arr[i];
      const val2 = arr[largest];
      if (val1 !== undefined && val2 !== undefined) {
        arr[i] = val2;
        arr[largest] = val1;
        
        steps.push({
          array: [...arr],
          swapping: [i, largest],
          activeLine: 10,
          variables: { i, largest, left, right, length },
          description: `Swapping ${val1} and ${val2}`
        });
        
        heapify(arr, length, largest);
      }
    }
  }

  // Build max heap
  steps.push({
    array: [...array],
    activeLine: 15,
    variables: { n },
    description: 'Building max heap'
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i);
  }

  // Extract elements from heap
  steps.push({
    array: [...array],
    activeLine: 20,
    variables: { n },
    description: 'Extracting elements from heap'
  });

  for (let i = n - 1; i > 0; i--) {
    const val1 = array[0];
    const val2 = array[i];
    if (val1 !== undefined && val2 !== undefined) {
      array[0] = val2;
      array[i] = val1;

      steps.push({
        array: [...array],
        swapping: [0, i],
        activeLine: 25,
        variables: { i, n },
        description: `Swap root ${val1} with element at index ${i}`
      });

      const lastStep = steps[steps.length - 1];
      const lastSorted = lastStep?.sorted || [];
      steps.push({
        array: [...array],
        sorted: [...lastSorted, i],
        activeLine: 26,
        variables: { i, n },
        description: `Element at index ${i} is now sorted`
      });

      heapify(array, i, 0);
    }
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 30,
    variables: {},
    description: 'Heap Sort completed!'
  });

  return steps;
}
