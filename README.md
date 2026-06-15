# Jungle Survival

A full-stack 3D browser game — survive endless waves of monsters in a third-person arena shooter. Built as a portfolio project to practice modern full-stack JavaScript, real-time WebGL game development, and cloud deployment.

**Live demo:** _coming soon (Vercel + Railway)_

---

## What the game is

- Enter your name → pick a character → pick a weapon → drop into a 3D jungle arena
- Move with **WASD**, look around with the **mouse**, shoot with **left click**
- Survive escalating waves of monsters (grubs, brutes, zippies)
- Heal with med kits scattered around the arena
- Score is saved to a global leaderboard when you die — every connected player's screen updates live via WebSocket

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| UI framework | React 18 + Vite | Fast hot-reload dev, component model for menus and HUD |
| Routing | React Router v6 | Protected routes (must log in before playing) |
| Global state | Zustand | Lightweight store shared between HUD, game canvas, and modals |
| 3D engine | Three.js | WebGL scene graph, lighting, raycasting, game loop |
| Real-time | Socket.io | WebSocket — leaderboard pushes to all clients on every new score |
| Backend | Node.js + Express | REST API for auth and scores |
| Auth | JWT (jsonwebtoken) | Stateless — token carries user identity, no session lookup needed |
| ORM | Prisma | Type-safe database queries; same JS interface whether using Postgres or in-memory fallback |
| Database | PostgreSQL | Persistent scores and users |
| Local DB | Docker | One-command Postgres container, no system install |
| Styling | Tailwind CSS v4 | Utility classes + CSS custom properties via `@theme` |
| Deployment | Vercel + Railway | Auto-deploy on every GitHub push |

---

## Skills practiced

### Full-stack JavaScript
Built both the client and server from scratch in the same language (Node.js/ESM throughout). Learned how a React frontend talks to an Express backend over HTTP and WebSocket.

### 3D game development with Three.js
- **Scene graph** — parent/child mesh groups for characters and monsters
- **Lighting** — hemisphere light (ambient sky/ground) + directional light with shadow maps
- **Game loop** — `requestAnimationFrame` with a fixed `dt` (delta time) so speed is frame-rate independent
- **Hitscan shooting** — `Raycaster` casts a ray from the camera through the screen center; the first monster mesh it hits takes damage (no bullet projectile needed)
- **Pointer Lock API** — captures the mouse so movement feels like a real FPS/TPS
- **Vector math** — yaw angle → forward/right direction vectors so WASD always moves relative to where you're looking
- **Third-person camera** — positioned behind and to the right of the player, looking far ahead so the crosshair aligns with the gun barrel
- **Monster AI** — normalize vector toward player, move along it, attack on contact; a separation pass prevents monsters from perfectly stacking

### Real-time WebSockets with Socket.io
When any player submits a score, the server calls `io.emit('leaderboard_update', top10)` which pushes the new leaderboard to every open browser tab simultaneously.

### REST API + JWT authentication
- `POST /api/auth/login` — name-only login (no passwords); upserts the user record, returns a signed JWT
- `POST /api/scores` — protected by `requireAuth` middleware that verifies the JWT on every request
- `GET /api/leaderboard` — public; returns top 10 scores

### Prisma ORM + PostgreSQL
Schema-first with `schema.prisma`; migrations tracked in git. The data layer (`store.js`) has an in-memory fallback so the app runs fully without a database — useful for quick local dev.

### Docker for local development
```bash
docker run -d \
  --name jungle-survival-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jungle_survival \
  -p 5432:5432 \
  postgres:16
```
One command, no system-level Postgres install. Docker Desktop handles the rest.

---

## Run locally

Requires: **Node.js 20+**. That's it — no database install needed to get started.

```bash
# 1. Clone
git clone https://github.com/weinsbergyuval/jungle-survival.git
cd jungle-survival

# 2. Backend
cd server
npm install
cp .env.example .env   # no changes needed for local play
npm run dev            # http://localhost:3001

# 3. Frontend (new terminal)
cd client
npm install
npm run dev            # http://localhost:5173

# 4. Open http://localhost:5173 and play
```

The server automatically falls back to in-memory storage when no database is found — the game is fully playable immediately. Scores reset when the server restarts, but everything else works.

**Want persistent scores locally?** Install [Docker Desktop](https://www.docker.com/products/docker-desktop), then run:

```bash
docker run -d \
  --name jungle-survival-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=jungle_survival \
  -p 5432:5432 \
  postgres:16

cd server && npx prisma migrate deploy
```

---

## Deploy (shared leaderboard for everyone — free)

All three services below have free tiers and no credit card required.

| Service | Hosts | Free tier |
|---|---|---|
| [Vercel](https://vercel.com) | React frontend | Free forever |
| [Render](https://render.com) | Express backend | Free (sleeps after 15 min idle, ~30s cold start) |
| [Neon](https://neon.tech) | PostgreSQL database | Free, 0.5 GB storage |

### 1. Database → Neon

1. Sign up at [neon.tech](https://neon.tech) → New Project
2. Copy the connection string — it looks like `postgresql://user:pass@host/dbname`

### 2. Backend → Render

1. Push to GitHub (this repo)
2. [render.com](https://render.com) → New Web Service → connect your repo → root directory: `server`
3. Build command: `npm install && npx prisma migrate deploy`
4. Start command: `npm start`
5. Set env vars: `DATABASE_URL` (from Neon), `JWT_SECRET` (any long random string), `CLIENT_URL` (your Vercel URL — set this after step 3)
6. Deploy — Render gives you a URL like `https://jungle-survival.onrender.com`

### 3. Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `client`
3. Add env var: `VITE_API_URL` = your Render backend URL
4. Deploy — Vercel rebuilds automatically on every future push to `main`

Once deployed, every player who opens your Vercel link plays in the same world and shares the same leaderboard. Scores update live on all screens via WebSocket.

---

## Project structure

```
jungle-survival/
├── client/                   # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── GameCanvas.jsx   # entire Three.js game engine
│       │   ├── Game.jsx         # pointer-lock, HUD, game-over modal
│       │   ├── HUD.jsx          # health bar, ammo, wave counter
│       │   ├── Landing.jsx      # post-login home screen
│       │   ├── Leaderboard.jsx  # live leaderboard via Socket.io
│       │   ├── Login.jsx        # name-only login form
│       │   ├── CharacterSelect.jsx
│       │   └── WeaponSelect.jsx
│       ├── data/
│       │   ├── characters.js    # Finn / Luna / Pip definitions
│       │   └── weapons.js       # Blaster / Zapper / Flare definitions
│       ├── hooks/useAuth.js     # Zustand auth store (token, user, logout)
│       ├── store/gameStore.js   # Zustand game state (character, weapon, HUD, gameOver)
│       └── lib/api.js           # fetch wrapper that attaches the JWT
└── server/                   # Node.js + Express backend
    ├── src/
    │   ├── index.js             # Express + Socket.io server setup
    │   ├── store.js             # Prisma / in-memory data layer
    │   ├── middleware/auth.js   # signToken, verifyToken, requireAuth
    │   ├── routes/
    │   │   ├── auth.js          # POST /api/auth/login
    │   │   └── scores.js        # GET /api/leaderboard, POST /api/scores
    │   └── socket/
    │       └── leaderboardSocket.js
    └── prisma/
        └── schema.prisma        # User + Score models
```

---

## Characters and weapons

| Character | Trait |
|---|---|
| Finn | Curly hair |
| Luna | Long hair |
| Pip | Explorer hat |

| Weapon | Color |
|---|---|
| Blaster | Green |
| Zapper | Blue |
| Flare | Orange |

All characters and weapons are cosmetic — same stats for everyone.

---

## License

MIT

---

Built with [Claude Opus](https://anthropic.com) (Anthropic) as an AI pair-programming assistant.
