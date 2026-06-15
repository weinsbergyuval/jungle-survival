// Front-facing stylized portrait for each character, drawn as inline SVG so it
// scales crisply in the select menu. cx is centered at 80 in a 160x230 box.
const SKIN = '#f1c49a';
const SKIN_SHADE = '#e8b488';

function Body({ color, accent, legs }) {
  return (
    <>
      <ellipse cx="80" cy="214" rx="42" ry="9" fill="#134e2a" opacity="0.16" />
      <rect x="62" y="170" width="16" height="44" rx="4" fill={legs} />
      <rect x="82" y="170" width="16" height="44" rx="4" fill={legs} />
      <rect x="58" y="208" width="24" height="11" rx="4" fill="#2a3550" opacity="0.85" />
      <rect x="78" y="208" width="24" height="11" rx="4" fill="#2a3550" opacity="0.85" />
      <rect x="34" y="96" width="16" height="58" rx="8" fill={accent} />
      <rect x="110" y="96" width="16" height="58" rx="8" fill={accent} />
      <circle cx="42" cy="156" r="9" fill={SKIN} />
      <circle cx="118" cy="156" r="9" fill={SKIN} />
      <rect x="48" y="90" width="64" height="86" rx="18" fill={color} />
      <rect x="72" y="74" width="16" height="18" fill={SKIN_SHADE} />
    </>
  );
}

function Face() {
  return (
    <>
      <circle cx="70" cy="50" r="4.5" fill="#fff" />
      <circle cx="70" cy="51" r="2.2" fill="#222" />
      <circle cx="90" cy="50" r="4.5" fill="#fff" />
      <circle cx="90" cy="51" r="2.2" fill="#222" />
      <path d="M70 62 Q80 71 90 62" stroke="#6b4226" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  );
}

export default function CharacterArt({ id, className }) {
  return (
    <svg viewBox="0 0 160 230" className={className} role="img" aria-label={`${id} character`}>
      {id === 'finn' && (
        <>
          <Body color="#e8743c" accent="#cf5e2a" legs="#2e8b8b" />
          <circle cx="80" cy="52" r="30" fill={SKIN} />
          <Face />
          <circle cx="58" cy="36" r="14" fill="#5b3a22" />
          <circle cx="74" cy="23" r="15" fill="#5b3a22" />
          <circle cx="92" cy="24" r="14" fill="#5b3a22" />
          <circle cx="105" cy="37" r="13" fill="#5b3a22" />
          <circle cx="50" cy="52" r="11" fill="#5b3a22" />
          <circle cx="110" cy="52" r="11" fill="#5b3a22" />
          <circle cx="68" cy="29" r="6" fill="#6e4a2c" />
          <circle cx="96" cy="31" r="6" fill="#6e4a2c" />
        </>
      )}

      {id === 'luna' && (
        <>
          <path d="M48 50 Q46 110 56 162 L104 162 Q114 110 112 50 Q96 40 80 42 Q64 40 48 50 z" fill="#7a4a24" />
          <Body color="#d94f86" accent="#be3f71" legs="#3a4a6b" />
          <circle cx="80" cy="52" r="30" fill={SKIN} />
          <path d="M50 48 Q48 22 80 20 Q112 22 110 48 Q96 38 80 40 Q64 38 50 48 z" fill="#7a4a24" />
          <Face />
        </>
      )}

      {id === 'pip' && (
        <>
          <Body color="#4fa33a" accent="#3c8a2c" legs="#6b5430" />
          <circle cx="80" cy="52" r="30" fill={SKIN} />
          <Face />
          <ellipse cx="80" cy="32" rx="40" ry="11" fill="#c2a24a" />
          <path d="M60 32 Q58 4 80 2 Q102 4 100 32 z" fill="#c9ab55" />
          <rect x="59" y="24" width="42" height="9" rx="3" fill="#8a6d2e" />
        </>
      )}
    </svg>
  );
}
