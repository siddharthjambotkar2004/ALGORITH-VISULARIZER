import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Merge Sort algorithm.
 * 
 * @param inputArray - The array of numbers to be sorted.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(n log n) in all cases (best, average, worst).
 * - Space: O(n) auxiliary.
 */
export function getMergeSortTrace(inputArray: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const array = [...inputArray];
  const n = array.length;

  steps.push({
    array: [...array],
    activeLine: 0,
    variables: { n },
    description: 'Starting Merge Sort'
  });

  function merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({
      array: [...arr],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      activeLine: 10,
      variables: { left, mid, right, leftArr, rightArr },
      description: `Merging sub-arrays [${left}...${mid}] and [${mid + 1}...${right}]`
    });

    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      const v1 = leftArr[i];
      const v2 = rightArr[j];
      
      if (v1 !== undefined && v2 !== undefined) {
        steps.push({
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          activeLine: 15,
          variables: { i, j, k, leftArr, rightArr },
          description: `Comparing ${v1} and ${v2}`
        });

        if (v1 <= v2) {
          arr[k] = v1;
          i++;
        } else {
          arr[k] = v2;
          j++;
        }
        
        steps.push({
          array: [...arr],
          swapping: [k],
          activeLine: 20,
          variables: { i, j, k, leftArr, rightArr },
          description: `Placing ${arr[k]} at index ${k}`
        });
        k++;
      }
    }

    while (i < leftArr.length) {
      const v = leftArr[i];
      if (v !== undefined) {
        arr[k] = v;
        steps.push({
          array: [...arr],
          swapping: [k],
          activeLine: 25,
          variables: { i, j, k, leftArr, rightArr },
          description: `Copying remaining element ${v} from left array`
        });
        i++;
        k++;
      }
    }

    while (j < rightArr.length) {
      const v = rightArr[j];
      if (v !== undefined) {
        arr[k] = v;
        steps.push({
          array: [...arr],
          swapping: [k],
          activeLine: 30,
          variables: { i, j, k, leftArr, rightArr },
          description: `Copying remaining element ${v} from right array`
        });
        j++;
        k++;
      }
    }
  }

  function solve(arr: number[], left: number, right: number) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: [...arr],
      activeLine: 5,
      variables: { left, mid, right },
      description: `Dividing array at index ${mid}`
    });

    solve(arr, left, mid);
    solve(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  solve(array, 0, n - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    activeLine: 35,
    variables: {},
    description: 'Merge Sort completed!'
  });

  return steps;
}
