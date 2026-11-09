import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import s from './Home.module.css';

const categories = ['Усе', 'Торти', 'Тістечка', 'Хліб', 'Печиво'];

const news = [
  { emoji: '🍰', title: 'Наполеон', desc: 'Листкове тісто, заварний крем', price: 180 },
  { emoji: '🥐', title: 'Круасан з мигдалем', desc: 'Масляний, 90 г', price: 65 },
  { emoji: '🍪', title: 'Вівсяне печиво', desc: 'Набір із 6 штук', price: 95 },
  { emoji: '🥖', title: 'Багет на заквасці', desc: 'Випікається щодня зранку', price: 70 },
];

export default function Home() {
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
      <div className={s.grid}>
        {news.map((p) => (
          <ProductCard key={p.title} {...p} />
        ))}
      </div>
    </main>
  );
}
