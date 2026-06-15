import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const hud = useGameStore((s) => s.hud);
  if (!hud) return null;

  const hpPct = Math.max(0, Math.min(100, (hud.hp / hud.maxHp) * 100));
  const hpColor = hpPct > 50 ? '#5fbf3f' : hpPct > 25 ? '#f2a33c' : '#ef4444';

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* Top center: wave + score */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 panel px-6 py-2 text-center">
        <p className="font-display font-bold text-2xl text-jungle leading-none">Wave {hud.wave}</p>
        <p className="text-ink/70 font-bold text-sm mt-0.5">
          {hud.score.toLocaleString()} pts · {hud.kills} kills
        </p>
      </div>

      {/* Bottom left: health */}
      <div className="absolute bottom-4 left-4 panel px-4 py-3 w-56">
        <div className="flex justify-between text-xs font-bold text-ink/60 mb-1">
          <span>HEALTH</span>
          <span>{hud.hp}/{hud.maxHp}</span>
        </div>
        <div className="h-3 rounded-full bg-black/15 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${hpPct}%`, background: hpColor }}
          />
        </div>
      </div>

      {/* Bottom right: ammo */}
      <div className="absolute bottom-4 right-4 panel px-5 py-3 text-right">
        <p className="font-display font-bold text-3xl text-ink leading-none">
          {hud.reloading ? '↻' : hud.ammo}
          <span className="text-ink/40 text-lg"> / {hud.maxAmmo}</span>
        </p>
        <p className="text-ink/60 font-bold text-xs mt-0.5">
          {hud.reloading ? 'Reloading…' : 'R to reload'}
        </p>
      </div>

      {/* Center: intermission countdown */}
      {hud.intermission > 0 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
          <p className="font-display font-bold text-3xl text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Next wave in {hud.intermission}…
          </p>
        </div>
      )}
    </div>
  );
}
