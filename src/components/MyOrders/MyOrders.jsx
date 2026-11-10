import useFetch from '../../hooks/useFetch';
import { ORDERS_API } from '../../api/config';
import s from './MyOrders.module.css';

// Історія замовлень поточного користувача (GET /api/orders із токеном)
export default function MyOrders({ token }) {
  const { data: orders, loading, error } = useFetch(ORDERS_API, token);

  return (
    <section className={s.box}>
      <h3>Мої замовлення</h3>
      {loading && <p className={s.muted}>Завантаження…</p>}
      {error && <p className={s.error}>{error}</p>}
      {orders && orders.length === 0 && <p className={s.muted}>Замовлень поки немає.</p>}
      {orders?.map((o) => (
        <div key={o.id} className={s.order}>
          <div className={s.head}>
            <strong>№{o.id}</strong>
            <span>{new Date(o.createdAt).toLocaleString('uk-UA')}</span>
          </div>
          <div className={s.items}>{o.items.map((i) => `${i.title} × ${i.qty}`).join(', ')}</div>
          <strong>{o.total} ₴</strong>
        </div>
      ))}
    </section>
  );
}
