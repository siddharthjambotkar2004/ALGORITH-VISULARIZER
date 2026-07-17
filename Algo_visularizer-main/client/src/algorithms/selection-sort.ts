import type { Algorithm } from '../types';

export const SELECTION_SORT: Algorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  description: 'A simple sorting algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure selectionSort(A)',
    '    n := length(A)',
    '    for i := 0 to n - 2 do',
    '        minIdx := i',
    '        for j := i + 1 to n - 1 do',
    '            if A[j] < A[minIdx] then',
    '                minIdx := j',
    '        if minIdx != i then',
    '            swap(A[i], A[minIdx])',
    'end procedure'
  ]
};
