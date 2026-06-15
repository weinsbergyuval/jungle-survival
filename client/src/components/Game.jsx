import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import GameCanvas from './GameCanvas';
import HUD from './HUD';

export default function Game() {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.selectedCharacter);
  const weapon = useGameStore((s) => s.selectedWeapon);
  const setHud = useGameStore((s) => s.setHud);
  const setGameOver = useGameStore((s) => s.setGameOver);
  const gameOver = useGameStore((s) => s.gameOver);
  const [locked, setLocked] = useState(false);
  const [runId, setRunId] = useState(0); // bump to restart the arena
  const savedRef = useRef(false);

  useEffect(() => {
    if (!character) navigate('/play');
    else if (!weapon) navigate('/weapon');
  }, [character, weapon, navigate]);

  // Fresh run state on mount / restart.
  useEffect(() => {
    savedRef.current = false;
    useGameStore.getState().resetGame();
  }, [runId]);

  const onLockChange = useCallback((isLocked) => setLocked(isLocked), []);
  const onHud = useCallback((h) => setHud(h), [setHud]);

  // Persist the score exactly once when the run ends.
  const onGameOver = useCallback(
    (result) => {
      setGameOver(result);
      if (savedRef.current) return;
      savedRef.current = true;
      api('/api/scores', {
        method: 'POST',
        token: useAuth.getState().token,
        body: { character: character.id, score: result.score, wave: result.wave },
      }).catch((err) => console.error('Failed to save score:', err.message));
    },
    [character, setGameOver]
  );

  // Pointer lock must be triggered from a real click; the prompt overlay sits
  // over the canvas, so it requests the lock itself.
  const requestLock = () => document.querySelector('canvas')?.requestPointerLock?.();

  if (!character || !weapon) return null;

  return (
    <div className="fixed inset-0 overflow-hidden">
      <GameCanvas key={runId} character={character} weapon={weapon} onLockChange={onLockChange} onHud={onHud} onGameOver={onGameOver} />

      {!gameOver && <HUD />}

      {/* Crosshair while aiming */}
      {locked && !gameOver && (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
          <div className="relative w-6 h-6">
            <span className="absolute left-1/2 top-0 -translate-x-1/2 h-2 w-0.5 bg-white/90" />
            <span className="absolute left-1/2 bottom-0 -translate-x-1/2 h-2 w-0.5 bg-white/90" />
            <span className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-0.5 bg-white/90" />
            <span className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-0.5 bg-white/90" />
          </div>
        </div>
      )}

      {/* Pointer-lock prompt (before first lock) */}
      {!locked && !gameOver && (
        <div
          onClick={requestLock}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 cursor-pointer"
        >
          <div className="panel px-8 py-7 text-center pop-in max-w-sm">
            <h2 className="font-display font-bold text-3xl text-jungle">Enter the jungle</h2>
            <p className="text-ink/70 font-semibold mt-3">Click anywhere to take control.</p>
            <div className="mt-4 text-sm text-ink/70 font-semibold space-y-1">
              <p><span className="text-ink">WASD</span> — move</p>
              <p><span className="text-ink">Mouse</span> — look · <span className="text-ink">Click</span> — shoot</p>
              <p><span className="text-ink">R</span> — reload · <span className="text-ink">Esc</span> — release cursor</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/weapon');
              }}
              className="btn-ghost mt-5 text-sm"
            >
              ← change loadout
            </button>
          </div>
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="panel px-10 py-8 text-center pop-in max-w-sm">
            <h2 className="font-display font-bold text-4xl text-red-600">You died</h2>
            <p className="text-ink/70 font-semibold mt-2">The jungle got you on wave {gameOver.wave}.</p>
            <p className="font-display font-bold text-5xl text-ink mt-5">{gameOver.score.toLocaleString()}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">points · {gameOver.kills} kills</p>
            <div className="mt-7 flex justify-center gap-3">
              <button onClick={() => setRunId((n) => n + 1)} className="btn-sun">
                ▶ Play again
              </button>
              <Link to="/leaderboard" className="btn-ghost">
                🏆 Leaderboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
