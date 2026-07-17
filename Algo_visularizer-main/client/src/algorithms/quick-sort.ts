import type { Algorithm } from '../types';

export const QUICK_SORT: Algorithm = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  description: 'A divide and conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot.',
  complexity: {
    time: 'O(n log n)',
    space: 'O(log n)',
  },
  pseudocode: [
    'procedure quickSort(A, low, high)',
    '    if low < high then',
    '        pi := partition(A, low, high)',
    '        quickSort(A, low, pi - 1)',
    '        quickSort(A, pi + 1, high)',
    'end procedure',
    '',
    'procedure partition(A, low, high)',
    '    pivot := A[high]',
    '    i := low - 1',
    '    for j := low to high - 1 do',
    '        if A[j] <= pivot then',
    '            i := i + 1',
    '            swap(A[i], A[j])',
    '    swap(A[i + 1], A[high])',
    '    return i + 1',
    'end procedure'
  ]
};
