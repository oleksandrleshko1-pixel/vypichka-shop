import ProductCard from '../../components/ProductCard/ProductCard';
import s from './Catalog.module.css';

const products = [
  { emoji: '🎂', title: 'Медовик', desc: '1 кг', price: 420 },
  { emoji: '🍰', title: 'Чізкейк ягідний', desc: '800 г', price: 480 },
  { emoji: '🍫', title: 'Шоколадний трюфель', desc: '1,2 кг', price: 560 },
  { emoji: '🍓', title: 'Полуничний', desc: '1 кг', price: 510 },
  { emoji: '🥕', title: 'Морквяний', desc: '900 г, веган', price: 390 },
  { emoji: '🍋', title: 'Лимонний', desc: '800 г', price: 440 },
];

const categories = ['Торти', 'Тістечка', 'Хліб', 'Печиво'];
const diets = ['Без глютену', 'Веган', 'Без горіхів'];

export default function Catalog() {
  return (
    <main className={s.page}>
      <aside className={s.filters}>
        <section className={s.box}>
          <h3>Категорія</h3>
          {categories.map((c) => (
            <label key={c} className={s.check}>
              <input type="checkbox" defaultChecked={c === 'Торти'} /> {c}
            </label>
          ))}
        </section>

        <section className={s.box}>
          <h3>Ціна</h3>
          <div className={s.price}>
            <span>від 50 ₴</span>
            <span>до 1500 ₴</span>
          </div>
        </section>

        <section className={s.box}>
          <h3>Дієта та алергени</h3>
          {diets.map((d) => (
            <label key={d} className={s.check}>
              <input type="checkbox" /> {d}
            </label>
          ))}
        </section>
      </aside>

      <section className={s.content}>
        <div className={s.top}>
          <strong>Торти · {products.length} товарів</strong>
          <button type="button" className={s.sort}>
            Сортувати: за популярністю
          </button>
        </div>
        <div className={s.grid}>
          {products.map((p) => (
            <ProductCard key={p.title} {...p} />
          ))}
        </div>
      </section>
    </main>
  );
}
