import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../lib/api';

// Module-level singleton socket. The only thing it carries is the live
// `leaderboard_update` broadcast — the game itself is fully client-side.
let socket = null;

function getSocket() {
  if (!socket) socket = io(API_URL, { autoConnect: true });
  return socket;
}

export function useLeaderboardSocket(onUpdate) {
  const cbRef = useRef(onUpdate);
  cbRef.current = onUpdate;

  useEffect(() => {
    const s = getSocket();
    const handler = (rows) => cbRef.current?.(rows);
    s.on('leaderboard_update', handler);
    return () => s.off('leaderboard_update', handler);
  }, []);
}
