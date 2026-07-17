import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Bubble Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n²) in worst and average cases, O(n) in best case (with optimization).
 * - Space: O(1) auxiliary.
 */
export function getBubbleSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;
  
  // Initial state
  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n, swapped: false },
    description: 'Starting Bubble Sort'
  });

  let swapped: boolean = false;
  let currentN = n;
  
  steps.push({
    array: [...array],
    activeLine: 1,
    variables: { n: currentN },
    description: 'Set n to length of array'
  });

  do {
    swapped = false;
    steps.push({
      array: [...array],
      activeLine: 3,
      variables: { n: currentN, swapped: false },
      description: 'Reset swapped flag'
    });

    for (let i = 1; i < currentN; i++) {
      const v1 = array[i - 1];
      const v2 = array[i];

      steps.push({
        array: [...array],
        comparing: [i - 1, i],
        activeLine: 4,
        variables: { n: currentN, swapped, i },
        description: `Comparing ${v1} and ${v2}`
      });

      if (v1 !== undefined && v2 !== undefined && v1 > v2) {
          array[i - 1] = v2;
          array[i] = v1;
          swapped = true;
          
          steps.push({
            array: [...array],
            swapping: [i - 1, i],
            activeLine: 6,
            variables: { n: currentN, swapped, i },
            description: `Swap ${v1} and ${v2}`
          });
          
          steps.push({
            array: [...array],
            activeLine: 7,
            variables: { n: currentN, swapped, i },
            description: 'Set swapped to true'
          });
      }
    }
    
    currentN--;
    const lastStep = steps[steps.length - 1];
    const lastSorted = lastStep?.sorted || [];
    steps.push({
      array: [...array],
      sorted: [...lastSorted, currentN],
      activeLine: 8,
      variables: { n: currentN, swapped },
      description: `Decrement n to ${currentN}`
    });

  } while (swapped && currentN > 0);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 11,
    variables: { n: currentN, swapped },
    description: 'Sorting completed!'
  });

  return steps;
}
