import { useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import useProducts from '../../hooks/useProducts';
import s from './Catalog.module.css';

const categories = [
  { key: 'cakes', label: 'Торти' },
  { key: 'pastry', label: 'Тістечка' },
  { key: 'bread', label: 'Хліб' },
  { key: 'cookies', label: 'Печиво' },
];
const diets = ['Без глютену', 'Веган', 'Без горіхів'];

const sorters = {
  popular: null,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
};

export default function Catalog() {
  const { products, loading, error } = useProducts();
  const [selected, setSelected] = useState(['cakes', 'pastry', 'bread', 'cookies']);
  const [sort, setSort] = useState('popular');

  const toggleCategory = (key) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const visible = products.filter((p) => selected.includes(p.category));
  if (sorters[sort]) visible.sort(sorters[sort]);

  return (
    <main className={s.page}>
      <aside className={s.filters}>
        <section className={s.box}>
          <h3>Категорія</h3>
          {categories.map((c) => (
            <label key={c.key} className={s.check}>
              <input
                type="checkbox"
                checked={selected.includes(c.key)}
                onChange={() => toggleCategory(c.key)}
              />{' '}
              {c.label}
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
          <strong>Знайдено · {visible.length} товарів</strong>
          <select
            className={s.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Сортування"
          >
            <option value="popular">Сортувати: за популярністю</option>
            <option value="priceAsc">Сортувати: від дешевих</option>
            <option value="priceDesc">Сортувати: від дорогих</option>
          </select>
        </div>

        {loading && <p>Завантаження…</p>}
        {error && <p>Не вдалося завантажити товари: {error}</p>}
        {!loading && !error && visible.length === 0 && <p>Нічого не знайдено.</p>}

        <div className={s.grid}>
          {visible.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </main>
  );
}
