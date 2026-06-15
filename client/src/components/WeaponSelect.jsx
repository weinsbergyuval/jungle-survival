import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WEAPONS } from '../data/weapons';
import { useGameStore } from '../store/gameStore';
import WeaponArt from './WeaponArt';

export default function WeaponSelect() {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.selectedCharacter);
  const selected = useGameStore((s) => s.selectedWeapon);
  const setSelected = useGameStore((s) => s.setSelectedWeapon);

  // Can't pick a weapon without first picking a character.
  useEffect(() => {
    if (!character) navigate('/play');
  }, [character, navigate]);

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: 'linear-gradient(#5cc4f2, #cdeeff)' }}>
      <div className="max-w-4xl mx-auto">
        <Link to="/play" className="text-ink/70 font-semibold hover:text-ink">
          ← back
        </Link>
        <h1
          className="font-display font-bold text-4xl md:text-5xl text-center text-white mt-2"
          style={{ textShadow: '0 3px 0 #2e7d32' }}
        >
          Pick your weapon
        </h1>
        <p className="text-center text-white font-semibold mt-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
          They all pack the same punch — choose your style.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          {WEAPONS.map((w) => {
            const isSel = selected?.id === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                className="panel p-6 flex flex-col items-center transition-transform duration-150 hover:-translate-y-1.5 cursor-pointer"
                style={{
                  outline: isSel ? '4px solid var(--color-sun)' : '4px solid transparent',
                  outlineOffset: '-2px',
                }}
              >
                <div className="relative w-full flex justify-center">
                  {isSel && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sun text-[#4a2e08] text-xs font-bold px-3 py-1 rounded-full">
                      Equipped
                    </span>
                  )}
                  <WeaponArt id={w.id} className="w-44 h-28" />
                </div>
                <h2 className="font-display font-bold text-2xl text-ink mt-3">{w.name}</h2>
                <p className="text-ink/60 font-semibold text-sm">{w.note}</p>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button disabled={!selected} onClick={() => navigate('/game')} className="btn-sun text-xl px-12">
            {selected ? 'Drop in!' : 'Pick a weapon'}
          </button>
        </div>
      </div>
    </div>
  );
}
