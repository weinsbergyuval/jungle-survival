// The game itself runs entirely in the browser, so the socket layer is thin:
// clients connect only to receive live `leaderboard_update` broadcasts, which
// are emitted from the scores route whenever a new high score is saved.
export function registerSocket(io) {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });
}
