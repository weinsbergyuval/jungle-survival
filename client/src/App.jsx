import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Landing from './components/Landing';
import NameLogin from './components/NameLogin';
import CharacterSelect from './components/CharacterSelect';
import WeaponSelect from './components/WeaponSelect';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

// `pointer: coarse` = touch screen (phone/tablet). The game needs pointer-lock
// and a physical keyboard, so these devices can't play.
const isMobile = window.matchMedia('(pointer: coarse)').matches;

function MobileWall() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-sky-300 to-green-400 p-6">
      <div className="bg-white/90 rounded-3xl shadow-xl px-8 py-10 text-center max-w-xs">
        <div className="text-6xl mb-4">🖥️</div>
        <h1 className="font-display font-bold text-2xl text-jungle mb-2">Open on a computer</h1>
        <p className="text-ink/70 font-semibold text-sm leading-relaxed">
          Jungle Survival needs a mouse and keyboard to play.<br />
          Grab a laptop or desktop and come back!
        </p>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const token = useAuth((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  if (isMobile) return <MobileWall />;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<NameLogin />} />
      <Route
        path="/play"
        element={
          <Protected>
            <CharacterSelect />
          </Protected>
        }
      />
      <Route
        path="/weapon"
        element={
          <Protected>
            <WeaponSelect />
          </Protected>
        }
      />
      <Route
        path="/game"
        element={
          <Protected>
            <Game />
          </Protected>
        }
      />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
