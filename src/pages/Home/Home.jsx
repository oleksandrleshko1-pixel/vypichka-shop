import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import useProducts from '../../hooks/useProducts';
import s from './Home.module.css';

const categories = ['Усе', 'Торти', 'Тістечка', 'Хліб', 'Печиво'];

export default function Home() {
  const { products, loading, error } = useProducts();
  const news = products.filter((p) => p.isNew);

  return (
    <main className={s.page}>
      <section className={s.hero}>
        <div>
          <h1>Свіжа випічка до вашого столу</h1>
          <p>Обирайте час доставки, і ми привеземо тепле саме тоді, коли треба.</p>
          <Link to="/catalog" className={s.cta}>
            Зробити замовлення
          </Link>
        </div>
        <div className={s.heroImg}>🥐</div>
      </section>

      <div className={s.chips}>
        {categories.map((c, i) => (
          <button key={c} type="button" className={i === 0 ? s.chipActive : s.chip}>
            {c}
          </button>
        ))}
      </div>

      <h2 className={s.title}>Новинки</h2>
      {loading && <p>Завантаження…</p>}
      {error && <p>Не вдалося завантажити товари: {error}</p>}
      <div className={s.grid}>
        {news.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
