import type { Algorithm } from '../types';

export const BUBBLE_SORT: Algorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure bubbleSort(A : list of sortable items)',
    '    n := length(A)',
    '    repeat',
    '        swapped := false',
    '        for i := 1 to n-1 inclusive do',
    '            if A[i-1] > A[i] then',
    '                swap(A[i-1], A[i])',
    '                swapped := true',
    '        n := n - 1',
    '    until not swapped',
    'end procedure'
  ]
};
