// Stylized side-view of each weapon, drawn as inline SVG (barrel points right).
// Three distinct shapes/colors that all behave the same in-game.
export default function WeaponArt({ id, className }) {
  return (
    <svg viewBox="0 0 180 110" className={className} role="img" aria-label={`${id} weapon`}>
      {id === 'blaster' && (
        <>
          <polygon points="48,72 72,72 66,104 42,104" fill="#3f8a2c" />
          <path d="M70 74 q-10 16 10 20" stroke="#3f8a2c" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="36" y="44" width="86" height="30" rx="10" fill="#5fbf3f" />
          <rect x="44" y="50" width="50" height="7" rx="3" fill="#3f8a2c" opacity="0.6" />
          <rect x="70" y="36" width="12" height="9" rx="2" fill="#3f8a2c" />
          <rect x="118" y="50" width="44" height="16" rx="6" fill="#5fbf3f" />
          <rect x="156" y="47" width="9" height="22" rx="3" fill="#3f8a2c" />
        </>
      )}

      {id === 'zapper' && (
        <>
          <polygon points="52,72 74,72 70,104 48,104" fill="#2f8fb5" />
          <rect x="40" y="46" width="64" height="28" rx="14" fill="#5cc4f2" />
          <polygon points="64,46 84,46 74,34" fill="#2f8fb5" />
          <rect x="100" y="52" width="52" height="12" rx="6" fill="#5cc4f2" />
          <ellipse cx="112" cy="58" rx="6" ry="12" fill="none" stroke="#2f8fb5" strokeWidth="3" />
          <ellipse cx="126" cy="58" rx="6" ry="12" fill="none" stroke="#2f8fb5" strokeWidth="3" />
          <ellipse cx="140" cy="58" rx="6" ry="12" fill="none" stroke="#2f8fb5" strokeWidth="3" />
          <circle cx="158" cy="58" r="11" fill="#2f8fb5" />
          <circle cx="158" cy="58" r="5" fill="#aee6ff" />
        </>
      )}

      {id === 'flare' && (
        <>
          <polygon points="54,74 76,74 72,106 50,106" fill="#c47e23" />
          <rect x="92" y="76" width="36" height="12" rx="6" fill="#c47e23" />
          <rect x="44" y="42" width="58" height="34" rx="12" fill="#f2a33c" />
          <rect x="50" y="48" width="42" height="8" rx="3" fill="#c47e23" />
          <polygon points="100,40 150,32 150,86 100,78" fill="#f2a33c" />
          <ellipse cx="150" cy="59" rx="6" ry="24" fill="#c47e23" />
          <ellipse cx="150" cy="59" rx="3" ry="15" fill="#5a3a10" />
        </>
      )}
    </svg>
  );
}
