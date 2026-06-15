import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function NameLogin() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(name);
      navigate('/play');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(#5cc4f2, #bfebff)' }}
    >
      <div className="panel w-full max-w-sm p-8 pop-in text-center">
        <Link to="/" className="block font-display font-bold text-3xl text-jungle mb-1">
          Jungle Survival
        </Link>
        <p className="text-ink/70 font-semibold mb-8">Pick a name to claim your spot on the board.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            maxLength={16}
            className="w-full rounded-xl bg-white border-2 border-[#e0d2ae] px-4 py-3 text-center text-lg font-semibold text-ink outline-none focus:border-leaf transition-colors"
          />
          {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}
          <button type="submit" disabled={busy || name.trim().length < 2} className="btn-leaf w-full text-lg">
            {busy ? '...' : "Let's go!"}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-block text-sm text-ink/60 font-semibold hover:text-ink">
          ← back
        </Link>
      </div>
    </div>
  );
}
