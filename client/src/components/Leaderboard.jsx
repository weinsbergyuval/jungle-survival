import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useLeaderboardSocket } from '../hooks/useSocket';
import { getCharacter } from '../data/characters';

export default function Leaderboard() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  // Live updates: the server broadcasts the new top 10 whenever a score lands.
  useLeaderboardSocket(setRows);

  useEffect(() => {
    api('/api/leaderboard')
      .then(setRows)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(#5cc4f2, #cdeeff)' }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-ink/70 font-semibold hover:text-ink">
          ← back
        </Link>
        <h1
          className="font-display font-bold text-4xl md:text-5xl text-center text-white mt-2 mb-8"
          style={{ textShadow: '0 3px 0 #2e7d32' }}
        >
          🏆 Top Survivors
        </h1>

        {error && <p className="text-center text-red-700 font-semibold">{error}</p>}
        {!rows && !error && <p className="text-center text-ink/70 font-semibold">Loading scores…</p>}

        {rows && rows.length === 0 && (
          <p className="text-center text-ink/70 font-semibold">
            No survivors yet. <Link to="/login" className="text-jungle underline">Be the first!</Link>
          </p>
        )}

        {rows && rows.length > 0 && (
          <div className="panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-ink/60 text-xs uppercase tracking-wide border-b border-[#e0d2ae]">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Hero</th>
                  <th className="px-4 py-3 text-right">Wave</th>
                  <th className="px-4 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="font-semibold">
                {rows.map((row) => (
                  <tr
                    key={`${row.rank}-${row.name}-${row.score}`}
                    className="border-b border-[#e0d2ae]/60 last:border-0"
                  >
                    <td className="px-4 py-3 font-display text-sun">{row.rank === 1 ? '👑' : row.rank}</td>
                    <td className="px-4 py-3 text-ink">{row.name}</td>
                    <td className="px-4 py-3 text-ink/70 capitalize">
                      {getCharacter(row.character)?.name ?? row.character}
                    </td>
                    <td className="px-4 py-3 text-right text-ink/70">{row.wave}</td>
                    <td className="px-4 py-3 text-right text-ink">{row.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
