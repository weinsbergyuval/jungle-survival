import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';
import { registerSocket } from './socket/leaderboardSocket.js';
import { initStore } from './store.js';

const app = express();
// Socket.io needs the raw Node http.Server — it intercepts the WebSocket "upgrade"
// request before Express sees it. HTTP and WebSocket traffic share one port this way.
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: { origin: clientUrl, methods: ['GET', 'POST'] },
});

app.use(cors({ origin: clientUrl }));
app.use(express.json());
app.set('io', io);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api', scoreRoutes); // /api/leaderboard, /api/scores

registerSocket(io);

const PORT = process.env.PORT || 3001;
await initStore();
server.listen(PORT, () => {
  console.log(`🌴 Jungle Survival server listening on port ${PORT}`);
});
