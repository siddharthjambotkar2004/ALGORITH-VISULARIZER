import type { Algorithm } from '../types';

export const INSERTION_SORT: Algorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure insertionSort(A : list of sortable items)',
    '    for i := 1 to length(A) - 1 do',
    '        key := A[i]',
    '        j := i - 1',
    '        while j >= 0 and A[j] > key do',
    '            A[j + 1] := A[j]',
    '            j := j - 1',
    '        A[j + 1] := key',
    'end procedure'
  ]
};
