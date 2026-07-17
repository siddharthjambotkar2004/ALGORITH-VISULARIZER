import type { Algorithm } from '../types';

export const MERGE_SORT: Algorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
  complexity: {
    time: 'O(n log n)',
    space: 'O(n)',
  },
  pseudocode: [
    'procedure mergeSort(A, left, right)',
    '    if left >= right return',
    '    mid := (left + right) / 2',
    '    mergeSort(A, left, mid)',
    '    mergeSort(A, mid + 1, right)',
    '    merge(A, left, mid, right)',
    'end procedure',
    '',
    'procedure merge(A, left, mid, right)',
    '    // Merging logic...',
    'end procedure'
  ]
};
