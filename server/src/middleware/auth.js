import jwt from 'jsonwebtoken';

// The token embeds userId + name directly in its payload (signed with JWT_SECRET).
// The server can verify any future request without hitting the database — it just
// checks the signature. Anyone without the secret can't forge a valid token.
export function signToken(user) {
  return jwt.sign(
    { userId: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Express middleware: requires a valid `Authorization: Bearer <jwt>` header.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
