import { Router } from 'express';
import { readProducts } from '../db.js';

const router = Router();

// GET /api/products?category=cakes — список товарів (з необов'язковим фільтром)
router.get('/', (req, res) => {
  const { category } = req.query;
  const products = readProducts();
  res.json(category ? products.filter((p) => p.category === category) : products);
});

// GET /api/products/:id — один товар
router.get('/:id', (req, res) => {
  const product = readProducts().find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Товар не знайдено' });
  res.json(product);
});

export default router;
