import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { products } from '../../data/products';
import s from './ProductPage.module.css';

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className={s.page}>
        <h1>Товар не знайдено</h1>
        <Link to="/catalog" className={s.back}>
          ← Назад до каталогу
        </Link>
      </main>
    );
  }

  return (
    <main className={s.page}>
      <Link to="/catalog" className={s.back}>
        ← Назад до каталогу
      </Link>
      <div className={s.card}>
        <div className={s.img}>{product.emoji}</div>
        <div className={s.info}>
          <h1>{product.title}</h1>
          <p>{product.desc}</p>
          <strong className={s.price}>{product.price} ₴</strong>
          <Button variant="accent">Додати в кошик</Button>
        </div>
      </div>
    </main>
  );
}
