import bcrypt from 'bcryptjs';
import prisma from './db.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

const DEFAULT_ALGORITHMS = [
  {
    name: 'Bubble Sort',
    identifier: 'bubble_sort',
    category: 'SORTING' as const,
    description: 'A simple comparison-based sorting algorithm that repeatedly swaps adjacent elements if they are in the wrong order.',
    pseudocode: [
      'function bubbleSort(arr):',
      '  n = length(arr)',
      '  for i from 0 to n-1:',
      '    for j from 0 to n-i-2:',
      '      if arr[j] > arr[j+1]:',
      '        swap(arr[j], arr[j+1])',
      '  return arr'
    ],
    isActive: true
  },
  {
    name: 'Quick Sort',
    identifier: 'quick_sort',
    category: 'SORTING' as const,
    description: 'A fast, recursive, divide-and-conquer algorithm that picks a pivot and partitions the array around it.',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pi = partition(arr, low, high)',
      '    quickSort(arr, low, pi-1)',
      '    quickSort(arr, pi+1, high)',
      '',
      'function partition(arr, low, high):',
      '  pivot = arr[high]',
      '  i = low - 1',
      '  for j from low to high-1:',
      '    if arr[j] <= pivot:',
      '      i = i + 1',
      '      swap(arr[i], arr[j])',
      '  swap(arr[i+1], arr[high])',
      '  return i+1'
    ],
    isActive: true
  },
  {
    name: 'Merge Sort',
    identifier: 'merge_sort',
    category: 'SORTING' as const,
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them, and merges them back together.',
    pseudocode: [
      'function mergeSort(arr):',
      '  if length(arr) > 1:',
      '    mid = length(arr) // 2',
      '    left = arr[:mid]',
      '    right = arr[mid:]',
      '    mergeSort(left)',
      '    mergeSort(right)',
      '    merge(arr, left, right)',
      '',
      'function merge(arr, left, right):',
      '  i = j = k = 0',
      '  while i < length(left) and j < length(right):',
      '    if left[i] < right[j]:',
      '      arr[k] = left[i]',
      '      i += 1',
      '    else:',
      '      arr[k] = right[j]',
      '      j += 1',
      '    k += 1'
    ],
    isActive: true
  },
  {
    name: 'Breadth-First Search',
    identifier: 'bfs',
    category: 'GRAPH' as const,
    description: 'A graph traversal algorithm that explores all the vertices at the present depth before moving on to vertices at the next depth level.',
    pseudocode: [
      'function BFS(graph, start):',
      '  visited = empty set',
      '  queue = empty queue',
      '  queue.enqueue(start)',
      '  visited.add(start)',
      '  while queue not empty:',
      '    node = queue.dequeue()',
      '    for neighbor in graph[node]:',
      '      if neighbor not in visited:',
      '        visited.add(neighbor)',
      '        queue.enqueue(neighbor)'
    ],
    isActive: true
  },
  {
    name: 'Depth-First Search',
    identifier: 'dfs',
    category: 'GRAPH' as const,
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    pseudocode: [
      'function DFS(graph, start, visited=None):',
      '  if visited is None:',
      '    visited = empty set',
      '  visited.add(start)',
      '  for neighbor in graph[start]:',
      '    if neighbor not in visited:',
      '      DFS(graph, neighbor, visited)'
    ],
    isActive: true
  },
  {
    name: 'Dijkstra\'s Algorithm',
    identifier: 'dijkstra',
    category: 'GRAPH' as const,
    description: 'Finds the shortest path between nodes in a graph with non-negative edge weights.',
    pseudocode: [
      'function dijkstra(graph, start):',
      '  distances = {vertex: infinity for vertex in graph}',
      '  distances[start] = 0',
      '  unvisited = all vertices',
      '  while unvisited not empty:',
      '    u = vertex with min distance',
      '    remove u from unvisited',
      '    for neighbor in graph[u]:',
      '      alt = distances[u] + weight(u, neighbor)',
      '      if alt < distances[neighbor]:',
      '        distances[neighbor] = alt'
    ],
    isActive: true
  }
];

async function seed() {
  console.log('🔍 Checking for existing admin user...');

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { username: ADMIN_USERNAME },
        { email: ADMIN_EMAIL },
      ],
    },
  });

  if (!existingAdmin) {
    console.log('🔐 Creating default admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await prisma.user.create({
      data: {
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('👤 Username:', ADMIN_USERNAME);
    console.log('🔑 Password:', ADMIN_PASSWORD);
  } else {
    console.log('✅ Admin user already exists!');
  }

  console.log('\n🔍 Checking for existing algorithms...');
  const existingAlgorithms = await prisma.algorithm.count();
  
  if (existingAlgorithms === 0) {
    console.log('📝 Creating default algorithms...');
    
    for (const algo of DEFAULT_ALGORITHMS) {
      await prisma.algorithm.create({
        data: {
          ...algo,
          pseudocode: JSON.stringify(algo.pseudocode)
        }
      });
    }
    
    console.log(`✅ Created ${DEFAULT_ALGORITHMS.length} default algorithms!`);
  } else {
    console.log('✅ Algorithms already exist!');
  }

  console.log('\n⚠️  Remember to change the default password in production!');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
