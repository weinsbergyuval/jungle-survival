import { Router } from 'express';
import { upsertUser } from '../store.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

function validateName(name) {
  if (!name || typeof name !== 'string') return 'A name is required';
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 16) return 'Name must be 2-16 characters';
  if (!/^[a-zA-Z0-9_ -]+$/.test(trimmed)) return 'Name may use letters, numbers, spaces, _ and -';
  return null;
}

// Name-only login: no passwords. The first time a name is seen we create the
// player; after that we just return a fresh token for the same record.
router.post('/login', async (req, res) => {
  const rawName = req.body?.name;
  const error = validateName(rawName);
  if (error) return res.status(400).json({ error });

  const name = rawName.trim();
  try {
    const user = await upsertUser(name);
    res.json({ token: signToken(user), user: { id: user.id, name: user.name } });
  } catch (err) {
    console.error('login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
