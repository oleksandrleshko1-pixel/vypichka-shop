import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useCart } from '../../context/CartContext';
import useProducts from '../../hooks/useProducts';
import s from './ProductPage.module.css';

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <main className={s.page}>
        <p>Завантаження…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className={s.page}>
        <h1>{error ? 'Не вдалося завантажити товар' : 'Товар не знайдено'}</h1>
        <Link to="/catalog" className={s.back}>
          ← Назад до каталогу
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
  };

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
          <Button variant="accent" onClick={handleAdd}>
            Додати в кошик
          </Button>
          {added && (
            <span className={s.ok}>
              Додано! <Link to="/cart">Перейти в кошик</Link>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
