# AlgoVisual Laboratory

> An interactive algorithm visualization platform with step-by-step animations, built with **React + TypeScript** (frontend) and **Express + Prisma** (backend).

---

## ✨ Features

- 🎬 **Step-by-step playback** — play, pause, rewind, jump to any step
- 📊 **Sorting visualizer** — animated bars with glow effects for compare/swap/sorted states
- 🕸️ **Graph visualizer** — SVG-based circular layout with animated edge traversal
- 📜 **Pseudocode sync** — active line highlighted in real time as the algorithm runs
- 🔍 **State inspector** — live variable watch panel showing algorithm internals
- 📋 **Execution log** — clickable step history panel; click any entry to jump directly to it
- ⌨️ **Keyboard shortcuts** — Space (play/pause), Arrow keys (step), Shift+Arrow (jump to start/end)
- 🎨 **4 themes** — Midnight, Cyberpunk, Forest, Deep Sea
- 🌐 **4 background patterns** — Mesh, Grid, Dots, Solid
- ⚡ **Server-side trace generation** — algorithm logic runs on the backend for consistency and security
- 🔐 **Authentication** — sign in to save and view your algorithm run history
- 📈 **Run History** — revisit and replay your past algorithm visualizations
- 🛠️ **Admin Panel** — manage algorithms and users (admin-only)


---

## 🗂️ Project Structure

```
algorithm-visualiser/
├── client/                         # React + TypeScript frontend (Vite)
│   └── src/
│       ├── algorithms/             # Algorithm metadata & pseudocode (client-side)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── TopBar.tsx      # Playback controls, speed, theme & background switchers
│       │   │   ├── MainCanvas.tsx  # Animated step badge + visualizer viewport
│       │   │   ├── Sidebar.tsx     # Algorithm browser with search
│       │   │   ├── RightPanel.tsx  # Pseudocode, state variables, complexity
│       │   │   ├── StepLog.tsx     # Clickable execution history log
│       │   │   └── ErrorBoundary.tsx
│       │   ├── visualizers/
│       │   │   ├── SortingVisualizer.tsx   # Bar chart with spring animations
│       │   │   └── GraphVisualizer.tsx     # SVG graph with animated edges/nodes
│       │   └── ui/
│       │       ├── Button.tsx
│       │       └── ShortcutModal.tsx
│       ├── context/
│       │   └── ThemeContext.tsx    # Theme + background pattern state (persisted)
│       ├── hooks/
│       │   └── useIsMobile.ts
│       ├── types/index.ts          # Shared TypeScript types
│       ├── utils/cn.ts             # Tailwind class merger
│       ├── config.ts               # API base URL
│       ├── App.tsx                 # Root component & playback engine
│       └── index.css               # Tailwind + CSS variables + glass styles
│
├── server/                         # Express + TypeScript backend
│   └── src/
│       ├── algorithms/
│       │   ├── sorting/            # Bubble, Insertion, Selection, Heap, Merge, Quick Sort
│       │   └── graph/              # BFS, DFS, Dijkstra, Kruskal, Bellman-Ford, Floyd-Warshall
│       ├── controllers/
│       │   └── traceController.ts  # Dispatches trace generation per algorithm
│       ├── routes/
│       │   └── traceRoutes.ts      # POST /api/trace (rate limited)
│       ├── schemas/
│       │   └── traceSchema.ts      # Zod input validation
│       ├── types/index.ts          # TraceStep & related types
│       ├── utils/
│       │   ├── logger.ts           # Pino structured logger
│       │   └── redis.ts            # Optional Redis caching client
│       ├── db.ts                   # Prisma client singleton
│       └── index.ts                # Express app entry point
│
├── database/
│   └── prisma/
│       ├── schema.prisma           # MySQL schema
│       └── migrations/             # SQL migration history
│
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## 🧩 Supported Algorithms

### Sorting
| Algorithm      | Time Complexity       | Space |
|----------------|-----------------------|-------|
| Bubble Sort    | O(n²)                 | O(1)  |
| Insertion Sort | O(n²)                 | O(1)  |
| Selection Sort | O(n²)                 | O(1)  |
| Heap Sort      | O(n log n)            | O(1)  |
| Merge Sort     | O(n log n)            | O(n)  |
| Quick Sort     | O(n log n) avg        | O(log n) |

### Graph
| Algorithm       | Time Complexity  | Use Case                    |
|-----------------|------------------|-----------------------------|
| BFS             | O(V + E)         | Shortest path (unweighted)  |
| DFS             | O(V + E)         | Cycle detection / topology  |
| Dijkstra        | O(E + V log V)   | Shortest path (weighted)    |
| Kruskal's       | O(E log E)       | Minimum Spanning Tree       |
| Bellman-Ford    | O(VE)            | Negative weight edges       |
| Floyd-Warshall  | O(V³)            | All-pairs shortest path     |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **XAMPP** installed and running (Apache + MySQL)

---

### Step 1 — Database Setup

1. Open **XAMPP Control Panel** → Start **Apache** and **MySQL**
2. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
3. Click **New** → create a database named `algo_visualiser`
4. Set collation to `utf8mb4_unicode_ci` → click **Create**

---

### Step 2 — Environment File

Copy the example env file to create your `.env`:

```bash
cp .env.example .env
```

The default `.env` works with XAMPP's default (no password):

```env
PORT=5001
JWT_SECRET=change_this_to_a_long_random_string
DATABASE_URL="mysql://root:@localhost:3306/algo_visualiser?connection_limit=5"
```

> If you set a MySQL root password, update `DATABASE_URL` accordingly.

---

### Step 3 — Install Dependencies

```bash
# Root dependencies (Playwright / Prisma CLI)
npm install

# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

---

### Step 4 — Run Database Migration

```bash
cd server
npx prisma migrate deploy --schema=../database/prisma/schema.prisma
cd ..
```

---

### Step 5 — Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
> Server starts at `http://localhost:5001`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
> App opens at `http://localhost:5173`

---

## ⌨️ Keyboard Shortcuts

| Key              | Action              |
|------------------|---------------------|
| `Space`          | Play / Pause        |
| `→`              | Next step           |
| `←`              | Previous step       |
| `Shift + →`      | Jump to end         |
| `Shift + ←`      | Jump to start       |
| `?`              | Toggle shortcut help |

---

## 🏗️ Architecture Overview

```
Browser (React)
    │
    │  POST /api/trace  { algorithmId, inputData }
    ▼
Express Server
    │
    ├── Zod validation
    ├── Redis cache lookup (optional)
    ├── Algorithm trace generation (pure TypeScript)
    └── Returns: { algorithmId, steps: TraceStep[] }
                         │
                         ▼
              React playback engine
          (timer loop, step by step rendering)
```

The **trace-based model** means all algorithm logic runs server-side. The frontend receives a pre-computed array of snapshots (`steps`) and replays them as an animation — ensuring correctness, consistency, and security.

---

## 🛠️ Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS       |
| Animation | Framer Motion                                  |
| Icons     | Lucide React                                   |
| Backend   | Node.js, Express, TypeScript                   |
| Validation| Zod                                            |
| ORM       | Prisma                                         |
| Database  | MySQL (XAMPP)                                  |
| Caching   | Redis (optional)                               |
| Logging   | Pino                                           |

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| Graph not rendering | Check the SVG `viewBox`; ensure nodes exist in `adjList` |
| Trace not loading | Confirm the backend is running on port 5001 |
| DB connection error | Make sure XAMPP MySQL is started and `DATABASE_URL` is correct |
| Prisma client error | Run `npx prisma generate` inside the `server` directory |
| CORS error | Verify frontend runs on `http://localhost:5173` |
