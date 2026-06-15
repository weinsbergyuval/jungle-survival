import jwt from 'jsonwebtoken';

// called once at login - creates and return a JWT for the given user
export function signToken(user) {
  return jwt.sign(
    { userId: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

//Called on every protected request - checks the signature, returns the payload if valid, throws if not.
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Express middleware: requires a valid token. 
// If existing and valid, attaches the payload to req.user. If not, responds with 401.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' }); //401 - not logged in
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
