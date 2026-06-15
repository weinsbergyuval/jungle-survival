import { useNavigate, Link } from 'react-router-dom';
import { CHARACTERS } from '../data/characters';
import { useGameStore } from '../store/gameStore';
import CharacterArt from './CharacterArt';

export default function CharacterSelect() {
  const navigate = useNavigate();
  const selected = useGameStore((s) => s.selectedCharacter);
  const setSelected = useGameStore((s) => s.setSelectedCharacter);

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: 'linear-gradient(#5cc4f2, #cdeeff)' }}>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-ink/70 font-semibold hover:text-ink">
          ← back
        </Link>
        <h1
          className="font-display font-bold text-4xl md:text-5xl text-center text-white mt-2"
          style={{ textShadow: '0 3px 0 #2e7d32' }}
        >
          Choose your slayer
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
          {CHARACTERS.map((c) => {
            const isSel = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="panel p-5 flex flex-col items-center transition-transform duration-150 hover:-translate-y-1.5 cursor-pointer"
                style={{
                  outline: isSel ? '4px solid var(--color-sun)' : '4px solid transparent',
                  outlineOffset: '-2px',
                }}
              >
                <div className="relative">
                  {isSel && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sun text-[#4a2e08] text-xs font-bold px-3 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                  <CharacterArt id={c.id} className="w-36 h-52" />
                </div>
                <h2 className="font-display font-bold text-2xl text-ink mt-2">{c.name}</h2>
                <p className="text-ink/60 font-semibold text-sm">{c.trait}</p>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <button disabled={!selected} onClick={() => navigate('/weapon')} className="btn-sun text-xl px-12">
            {selected ? `Play as ${selected.name}` : 'Pick a character'}
          </button>
        </div>
      </div>
    </div>
  );
}
