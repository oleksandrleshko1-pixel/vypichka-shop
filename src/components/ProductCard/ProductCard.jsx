import s from './ProductCard.module.css';

export default function ProductCard({ emoji, title, desc, price }) {
  return (
    <article className={s.card}>
      <div className={s.img}>{emoji}</div>
      <div className={s.body}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className={s.row}>
          <strong>{price} ₴</strong>
          <button className={s.add} type="button">
            +
          </button>
        </div>
      </div>
    </article>
  );
}
