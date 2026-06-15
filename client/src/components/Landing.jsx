import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  function switchName() {
    logout();
    navigate('/login');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* sky → jungle backdrop */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(#5cc4f2, #bfebff 55%, #8fd86a 55%, #5fae3a)' }} />
      <div className="absolute left-6 bottom-0 w-40 h-64 origin-bottom" style={{ transform: 'rotate(-6deg)' }}>
        <div className="mx-auto w-4 h-40 bg-[#7a4a24] rounded-full" />
      </div>
      <div className="absolute right-8 bottom-0 w-44 h-72 origin-bottom" style={{ transform: 'rotate(5deg)' }}>
        <div className="mx-auto w-5 h-48 bg-[#7a4a24] rounded-full" />
      </div>
      <div className="absolute left-2 bottom-32 w-32 h-32 rounded-full bg-[#4fa33a]" />
      <div className="absolute right-4 bottom-44 w-36 h-36 rounded-full bg-[#3f8f2f]" />
      <div className="absolute top-10 right-12 w-24 h-24 rounded-full bg-[#ffe07a]" />

      <div className="relative z-10 text-center px-6 pop-in">
        <h1
          className="font-display font-bold text-6xl md:text-8xl text-white leading-none"
          style={{ textShadow: '0 4px 0 #2e7d32, 0 8px 18px rgba(0,0,0,0.25)' }}
        >
          JUNGLE
          <br />
          SURVIVAL
        </h1>
        <p className="mt-6 text-white font-semibold text-lg max-w-md mx-auto" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          Drop into the jungle, grab your blaster, and survive endless waves of
          monsters. How long can you last?
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link to={token ? '/play' : '/login'} className="btn-sun text-lg">
            ▶ Play
          </Link>
          <Link to="/leaderboard" className="btn-ghost text-lg">
            🏆 Leaderboard
          </Link>
        </div>

        {token && (
          <p className="mt-8 text-white/90 font-semibold text-sm">
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
