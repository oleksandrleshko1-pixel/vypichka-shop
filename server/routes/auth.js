import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { readDb, writeDb } from '../db.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

// POST /api/auth/register — реєстрація
router.post('/register', (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!name) return res.status(400).json({ message: "Вкажіть ім'я" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Вкажіть коректну пошту' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'Пароль має містити щонайменше 6 символів' });
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'Користувач із такою поштою вже існує' });
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

// POST /api/auth/login — вхід
router.post('/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  const user = readDb().users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Невірна пошта або пароль' });
  }

  res.json({ user: publicUser(user), token: signToken(user) });
});

// GET /api/auth/me — поточний користувач за токеном
router.get('/me', requireAuth, (req, res) => {
  const user = readDb().users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json({ user: publicUser(user) });
});

export default router;
