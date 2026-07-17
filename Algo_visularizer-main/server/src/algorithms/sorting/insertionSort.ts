import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Insertion Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n²) in worst and average cases, O(n) in best case.
 * - Space: O(1) auxiliary.
 */
export function getInsertionSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { i: 0 },
    description: 'Starting Insertion Sort'
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    if (key === undefined) continue;
    
    steps.push({
      array: [...array],
      activeLine: 1,
      variables: { i, key },
      description: `Selecting element at index ${i} (value: ${key}) as key`
    });

    steps.push({
      array: [...array],
      activeLine: 2,
      variables: { i, key },
      description: `Key is ${key}`
    });

    let j = i - 1;
    steps.push({
      array: [...array],
      activeLine: 3,
      variables: { i, key, j },
      description: `Set j to i - 1 (${j})`
    });

    while (j >= 0) {
      const valJ = array[j];
      if (valJ === undefined) break;
      
      if (valJ > key) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          activeLine: 4,
          variables: { i, key, j },
          description: `Comparing A[j] (${valJ}) > key (${key})`
        });

        array[j + 1] = valJ;
        
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          activeLine: 5,
          variables: { i, key, j },
          description: `Shifting A[j] (${valJ}) to the right`
        });

        j = j - 1;
        steps.push({
          array: [...array],
          activeLine: 6,
          variables: { i, key, j },
          description: `Decrementing j to ${j}`
        });
      } else {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          activeLine: 4,
          variables: { i, key, j },
          description: `Comparing A[j] (${valJ}) <= key (${key}), stopping shift`
        });
        break;
      }
    }

    array[j + 1] = key;
    steps.push({
      array: [...array],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      activeLine: 7,
      variables: { i, key, j },
      description: `Inserting key (${key}) at index ${j + 1}`
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, k) => k),
    activeLine: 8,
    variables: {},
    description: 'Sorting completed!'
  });

  return steps;
}
