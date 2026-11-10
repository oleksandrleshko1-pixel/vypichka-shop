import { Router } from 'express';
import { readDb, readProducts, writeDb } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/orders — створити замовлення (гість або авторизований користувач).
// Ціни й суму рахуємо на сервері за даними з каталогу, а не довіряємо клієнту.
router.post('/', optionalAuth, (req, res) => {
  const { customer, delivery, address, datetime, comment, items } = req.body ?? {};

  const name = String(customer?.name ?? '').trim();
  const phone = String(customer?.phone ?? '').trim();
  if (!name) return res.status(400).json({ message: "Вкажіть ім'я" });
  if (!/^[+\d\s()-]{9,}$/.test(phone)) return res.status(400).json({ message: 'Вкажіть коректний телефон' });
  if (delivery && !String(address ?? '').trim()) {
    return res.status(400).json({ message: 'Вкажіть адресу доставки' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Кошик порожній' });
  }

  const catalog = readProducts();
  const orderItems = [];
  for (const item of items) {
    const product = catalog.find((p) => p.id === item?.id);
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: `Некоректна позиція в замовленні: ${item?.id}` });
    }
    orderItems.push({ id: product.id, title: product.title, price: product.price, qty });
  }

  const db = readDb();
  const order = {
    id: db.orders.reduce((max, o) => Math.max(max, o.id), 0) + 1,
    userId: req.user?.id ?? null,
    customer: { name, phone },
    delivery: Boolean(delivery),
    address: delivery ? String(address).trim() : null,
    datetime: String(datetime ?? ''),
    comment: String(comment ?? ''),
    items: orderItems,
    total: orderItems.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  writeDb(db);

  res.status(201).json(order);
});

// GET /api/orders — історія замовлень поточного користувача
router.get('/', requireAuth, (req, res) => {
  const mine = readDb().orders.filter((o) => o.userId === req.user.id);
  res.json(mine.reverse());
});

export default router;
