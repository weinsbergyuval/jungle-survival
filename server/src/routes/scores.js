import { Router } from 'express';
import { createScore, topScores } from '../store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const CHARACTERS = new Set(['finn', 'luna', 'pip']);

router.get('/leaderboard', async (_req, res) => {
  try {
    res.json(await topScores());
  } catch (err) {
    console.error('leaderboard failed:', err);
    res.status(500).json({ error: 'Could not load leaderboard' });
  }
});

router.post('/scores', requireAuth, async (req, res) => {
  const { character, score, wave } = req.body ?? {};
  if (!CHARACTERS.has(character) || !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: 'Invalid score payload' });
  }

  try {
    const saved = await createScore({
      userId: req.user.userId,
      character,
      score,
      wave: Number.isInteger(wave) && wave > 0 ? wave : 1,
    });

    // io.emit() broadcasts to ALL connected browser tabs at once over WebSocket —
    // every player's leaderboard updates live without anyone refreshing the page.
    const io = req.app.get('io');
    io.emit('leaderboard_update', await topScores());

    res.status(201).json(saved);
  } catch (err) {
    console.error('save score failed:', err);
    res.status(500).json({ error: 'Could not save score' });
  }
});

export default router;
