import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Sun() {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <div style={{ position: 'absolute', top: '7%', right: '8%', width: '110px', height: '110px' }}>
      {/* glow ring */}
      <div style={{
        position: 'absolute', inset: '-28px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,224,80,0.38) 0%, transparent 68%)',
      }} />
      {/* rays */}
      {rays.map((deg) => {
        const rad = (deg - 90) * Math.PI / 180;
        const dist = 68;
        const x = Math.cos(rad) * dist;
        const y = Math.sin(rad) * dist;
        return (
          <div key={deg} style={{
            position: 'absolute', width: '5px', height: '20px', borderRadius: '3px',
            background: '#ffd740', top: '50%', left: '50%',
            transform: `translate(${x - 2.5}px, ${y - 10}px) rotate(${deg}deg)`,
          }} />
        );
      })}
      {/* disc */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 35%, #fff8c0, #ffe566)',
        boxShadow: '0 0 22px 8px rgba(255,215,50,0.5)',
      }} />
    </div>
  );
}

function Cloud({ top, left, scale = 1 }) {
  return (
    <div style={{ position: 'absolute', top, left, transform: `scale(${scale})`, transformOrigin: 'left top', pointerEvents: 'none' }}>
      <div style={{ position: 'relative', width: '110px', height: '52px', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px', background: 'rgba(255,255,255,0.9)', borderRadius: '14px' }} />
        <div style={{ position: 'absolute', bottom: '14px', left: '8px',  width: '46px', height: '46px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '18px', left: '34px', width: '42px', height: '42px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '62px', width: '34px', height: '34px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%' }} />
      </div>
    </div>
  );
}

function Birds({ top, left }) {
  return (
    <svg style={{ position: 'absolute', top, left, opacity: 0.5, pointerEvents: 'none' }} width="72" height="28" viewBox="0 0 72 28">
      <path d="M0 14 Q6 5 12 14 Q18 5 24 14"  stroke="#3a4a5a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M30 9 Q35 2 40 9 Q45 2 50 9"   stroke="#3a4a5a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M14 22 Q18 16 22 22 Q26 16 30 22" stroke="#3a4a5a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Vine({ side }) {
  const L = side === 'left';
  return (
    <svg
      style={{ position: 'absolute', top: 0, [L ? 'left' : 'right']: 0, height: '100%', width: '55px', opacity: 0.75, pointerEvents: 'none' }}
      viewBox="0 0 55 700" preserveAspectRatio="none"
    >
      <path
        d={L
          ? 'M8 0 Q28 90 6 180 Q-8 270 14 360 Q32 450 4 540 Q-12 620 8 700'
          : 'M47 0 Q27 90 49 180 Q63 270 41 360 Q23 450 51 540 Q67 620 47 700'}
        stroke="#3d8c2a" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {[90, 210, 340, 470, 600].map((y, i) => (
        <ellipse
          key={y}
          cx={L ? (i % 2 === 0 ? 24 : 4) : (i % 2 === 0 ? 31 : 51)}
          cy={y} rx="13" ry="7"
          fill="#4fa33a"
          transform={`rotate(${L ? (i % 2 === 0 ? -35 : 35) : (i % 2 === 0 ? 35 : -35)},
            ${L ? (i % 2 === 0 ? 24 : 4) : (i % 2 === 0 ? 31 : 51)}, ${y})`}
        />
      ))}
    </svg>
  );
}

function Flower({ left, color, stemH = 22, size = 1, style = {} }) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <div style={{ position: 'absolute', left, transform: `scale(${size})`, transformOrigin: 'bottom center', pointerEvents: 'none', ...style }}>
      <div style={{ position: 'relative', width: '24px', height: '24px', margin: '0 auto' }}>
        {petals.map((a) => (
          <div key={a} style={{
            position: 'absolute', width: '9px', height: '9px', borderRadius: '50%',
            background: color, top: '50%', left: '50%',
            transform: `rotate(${a}deg) translateX(9px) translate(-50%,-50%)`,
          }} />
        ))}
        <div style={{
          position: 'absolute', width: '11px', height: '11px', borderRadius: '50%',
          background: '#ffe566', top: '11px', left: '11px', zIndex: 2,
        }} />
      </div>
      <div style={{ width: '3px', height: `${stemH}px`, background: '#3d8c2a', borderRadius: '2px', marginLeft: '15px' }} />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  function switchName() {
    logout();
    navigate('/login');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">

      {/* background — sky top half, grass bottom half */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #5cc4f2 0%, #bfebff 52%, #8fd86a 52%, #5fae3a 100%)' }} />

      {/* sky decorations */}
      <Sun />
      <Cloud top="5%"  left="7%"  scale={1} />
      <Cloud top="13%" left="52%" scale={0.72} />
      <Cloud top="3%"  left="36%" scale={0.52} />
      <Cloud top="11%" left="74%" scale={0.6} />
      <Birds top="20%" left="18%" />
      <Birds top="9%"  left="64%" />

      {/* vines on both sides */}
      <Vine side="left" />
      <Vine side="right" />

      {/* trees */}
      <div className="absolute left-6 bottom-0 origin-bottom" style={{ transform: 'rotate(-6deg)' }}>
        <div className="mx-auto w-4 h-40 bg-[#7a4a24] rounded-full" />
        <div className="absolute -top-16 -left-6 w-28 h-28 rounded-full bg-[#4fa33a]" />
        <div className="absolute -top-20 left-2 w-24 h-24 rounded-full bg-[#3f8f2f]" />
      </div>
      <div className="absolute right-8 bottom-0 origin-bottom" style={{ transform: 'rotate(5deg)' }}>
        <div className="mx-auto w-5 h-48 bg-[#7a4a24] rounded-full" />
        <div className="absolute -top-18 -right-4 w-32 h-32 rounded-full bg-[#4fa33a]" />
        <div className="absolute -top-22 right-4 w-26 h-26 rounded-full bg-[#3f8f2f]" />
      </div>

      {/* flowers scattered randomly across the grass */}
      <Flower left="5%"  color="#ff6b9d" stemH={20} size={1}    style={{ position:'absolute', bottom:'4%' }}  />
      <Flower left="11%" color="#ff9f40" stemH={16} size={0.8}  style={{ position:'absolute', bottom:'12%' }} />
      <Flower left="18%" color="#c084fc" stemH={22} size={1.05} style={{ position:'absolute', bottom:'2%' }}  />
      <Flower left="26%" color="#ffffff" stemH={18} size={0.9}  style={{ position:'absolute', bottom:'9%' }}  />
      <Flower left="33%" color="#ff6b9d" stemH={20} size={0.85} style={{ position:'absolute', bottom:'5%' }}  />
      <Flower left="44%" color="#ff9f40" stemH={16} size={1}    style={{ position:'absolute', bottom:'14%' }} />
      <Flower left="55%" color="#c084fc" stemH={22} size={0.9}  style={{ position:'absolute', bottom:'3%' }}  />
      <Flower left="63%" color="#ffffff" stemH={18} size={1.1}  style={{ position:'absolute', bottom:'8%' }}  />
      <Flower left="71%" color="#ff9f40" stemH={20} size={0.8}  style={{ position:'absolute', bottom:'13%' }} />
      <Flower left="79%" color="#ff6b9d" stemH={16} size={1}    style={{ position:'absolute', bottom:'2%' }}  />
      <Flower left="87%" color="#c084fc" stemH={22} size={0.9}  style={{ position:'absolute', bottom:'7%' }}  />

      {/* ── sky section: title pinned to bottom of sky ── */}
      <div className="relative z-10 flex items-end justify-center text-center px-6 pop-in" style={{ height: '50vh', paddingBottom: '2vh' }}>
        <h1
          className="font-display font-bold text-6xl md:text-8xl text-white leading-tight"
          style={{
            textShadow: '0 4px 0 #2e7d32, 0 8px 18px rgba(0,0,0,0.22)',
            letterSpacing: '0.1em',
          }}
        >
          <span style={{ display: 'block', marginRight: '0.35em' }}>JUNGLE</span>
          {'SURVIVAL'.split('').map((ch, i) => (
            <span key={i} style={ch === 'V' ? { marginLeft: '0.06em' } : {}}>{ch}</span>
          ))}
        </h1>
      </div>

      {/* ── grass section: description + buttons + playing-as ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-6 gap-5">
        <p className="text-white font-semibold text-lg max-w-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
          Drop into the jungle, grab your blaster, and survive endless waves of monsters. How long can you last?
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to={token ? '/play' : '/login'} className="btn-sun text-lg">
            ▶ Play
          </Link>
          <Link to="/leaderboard" className="btn-ghost text-lg">
            🏆 Leaderboard
          </Link>
        </div>

        {token && (
          <p className="text-white/90 font-semibold text-sm">
            Playing as {user?.name}
            {' · '}
            <button onClick={switchName} className="underline hover:text-white">
              switch name
            </button>
          </p>
        )}
      </div>

    </div>
  );
}
