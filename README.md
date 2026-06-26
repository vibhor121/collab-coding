# CodeCollab

Real-time collaborative coding platform — multiple people edit the same file live using **React**, **Monaco Editor**, **Yjs**, and **Socket.io**.

## Features

- Live collaborative editing (2+ users)
- Colored remote cursors
- Room-based invite links
- JavaScript code runner with console output
- Auto-unique display names when duplicates join

## Project structure

```
collab-coding/
├── backend/     # Express + Socket.io + Yjs sync server
├── frontend/    # React + Vite + Monaco editor UI
└── package.json # Helper scripts
```

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Runs on **http://localhost:3000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173**

### 3. Use the app

1. Open http://localhost:5173
2. Enter your name → **Create new room**
3. Copy invite link → open in another tab or share with a friend
4. Code together in real time
5. Click **Run** (or Ctrl+Enter) to execute JavaScript

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Monaco Editor |
| Real-time sync | Yjs, y-monaco, y-socket.io |
| Backend | Node.js, Express, Socket.io |
| Database | None (in-memory while server runs) |

## Environment

Create `frontend/.env`:

```
VITE_SERVER_URL=http://localhost:3000
```

## Notes

- No database — code is stored in server memory while the room is active
- Restarting the backend clears all rooms
- Run button works for **JavaScript** only
