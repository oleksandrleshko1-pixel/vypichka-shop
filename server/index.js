import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

// Невідомий маршрут API
app.use('/api', (req, res) => res.status(404).json({ message: 'Маршрут не знайдено' }));

// Загальний обробник помилок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
});

app.listen(PORT, () => {
  console.log(`API сервер запущено: http://localhost:${PORT}/api`);
});
