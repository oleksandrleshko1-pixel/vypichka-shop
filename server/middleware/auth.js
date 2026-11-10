import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vypichka-dev-secret';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

// Обов'язкова авторизація: без дійсного токена повертаємо 401
export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: 'Потрібна авторизація' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Недійсний або прострочений токен' });
  }
}

// Необов'язкова авторизація: якщо токен є і він дійсний — підставляємо користувача
export function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      /* гість */
    }
  }
  next();
}
