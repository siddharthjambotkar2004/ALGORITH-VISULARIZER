import type { Algorithm } from '../types';

export const HEAP_SORT: Algorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  description: 'A comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end.',
  complexity: {
    time: 'O(n log n)',
    space: 'O(1)',
  },
  pseudocode: [
    'procedure heapSort(A)',
    '    n := length(A)',
    '    buildMaxHeap(A, n)',
    '    for i := n - 1 down to 1 do',
    '        swap(A[0], A[i])',
    '        heapify(A, i, 0)',
    'end procedure',
    '',
    'procedure heapify(A, n, i)',
    '    largest := i',
    '    l := 2*i + 1, r := 2*i + 2',
    '    if l < n and A[l] > A[largest] largest := l',
    '    if r < n and A[r] > A[largest] largest := r',
    '    if largest != i then',
    '        swap(A[i], A[largest])',
    '        heapify(A, n, largest)',
    'end procedure'
  ]
};
