import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import s from './ProductCard.module.css';

export default function ProductCard({ id, emoji, title, desc, price }) {
  const { addItem } = useCart();

  return (
    <article className={s.card}>
      <Link to={`/catalog/${id}`} className={s.img}>
        {emoji}
      </Link>
      <div className={s.body}>
        <h3>
          <Link to={`/catalog/${id}`} className={s.title}>
            {title}
          </Link>
        </h3>
        <p>{desc}</p>
        <div className={s.row}>
          <strong>{price} ₴</strong>
          <button
            className={s.add}
            type="button"
            aria-label={`Додати в кошик: ${title}`}
            onClick={() => addItem({ id, emoji, title, price })}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
