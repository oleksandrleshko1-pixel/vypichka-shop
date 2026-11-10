import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import usePost from '../../hooks/usePost';
import { ORDERS_API } from '../../api/config';
import s from './Cart.module.css';

const emptyForm = { name: '', phone: '', address: '', datetime: '', comment: '' };

export default function Cart() {
  const { items, total, changeQty, removeItem, clear } = useCart();
  const { user } = useAuth();
  const { post, loading, error } = usePost(ORDERS_API);

  const [form, setForm] = useState(emptyForm);
  const [delivery, setDelivery] = useState(true);
  const [formError, setFormError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) return setFormError('Кошик порожній');
    if (!form.name.trim()) return setFormError("Вкажіть ім'я");
    if (!/^[+\d\s()-]{9,}$/.test(form.phone.trim())) return setFormError('Вкажіть коректний телефон');
    if (delivery && !form.address.trim()) return setFormError('Вкажіть адресу доставки');

    // Ціни та суму сервер рахує сам, тому надсилаємо лише id і кількість
    const order = {
      customer: { name: form.name, phone: form.phone },
      delivery,
      address: delivery ? form.address : null,
      datetime: form.datetime,
      comment: form.comment,
      items: items.map((i) => ({ id: i.id, qty: i.qty })),
    };

    const data = await post(order, user?.token);
    if (data) {
      setOrderId(data.id);
      clear();
      setForm(emptyForm);
    }
  };

  if (orderId) {
    return (
      <main className={s.done}>
        <h2>Дякуємо за замовлення!</h2>
        <p>Номер замовлення: №{orderId}. Ми зв'яжемось із вами найближчим часом.</p>
        <Link to="/catalog" className={s.link}>
          До каталогу
        </Link>
      </main>
    );
  }

  return (
    <main className={s.page}>
      <section>
        <h2>Ваше замовлення</h2>

        {items.length === 0 && (
          <p className={s.empty}>
            Кошик порожній. <Link to="/catalog">Перейти до каталогу</Link>
          </p>
        )}

        {items.map((i) => (
          <div key={i.id} className={s.item}>
            <div className={s.thumb}>{i.emoji}</div>
            <div className={s.info}>
              <strong>{i.title}</strong>
              <span>{i.price} ₴ за шт.</span>
            </div>
            <div className={s.qty}>
              <button type="button" onClick={() => changeQty(i.id, -1)} aria-label="Менше">
                −
              </button>
              <span>{i.qty}</span>
              <button type="button" onClick={() => changeQty(i.id, 1)} aria-label="Більше">
                +
              </button>
            </div>
            <strong className={s.sum}>{i.price * i.qty} ₴</strong>
            <button
              type="button"
              className={s.remove}
              onClick={() => removeItem(i.id)}
              aria-label={`Видалити: ${i.title}`}
            >
              ×
            </button>
          </div>
        ))}

        <div className={s.total}>
          <strong>Разом</strong>
          <strong>{total} ₴</strong>
        </div>
      </section>

      <form className={s.form} onSubmit={handleSubmit}>
        <h3>Дані для доставки</h3>
        <Input placeholder="Ім'я" value={form.name} onChange={update('name')} />
        <Input type="tel" placeholder="Телефон" value={form.phone} onChange={update('phone')} />
        <div className={s.toggle}>
          <Button
            variant={delivery ? 'accent' : 'outline'}
            type="button"
            onClick={() => setDelivery(true)}
          >
            Доставка
          </Button>
          <Button
            variant={delivery ? 'outline' : 'accent'}
            type="button"
            onClick={() => setDelivery(false)}
          >
            Самовивіз
          </Button>
        </div>
        {delivery && <Input placeholder="Адреса" value={form.address} onChange={update('address')} />}
        <Input placeholder="Дата й час" value={form.datetime} onChange={update('datetime')} />
        <Input
          placeholder="Коментар до замовлення"
          value={form.comment}
          onChange={update('comment')}
        />
        {(formError || error) && <p className={s.error}>{formError || error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Надсилаємо…' : 'Підтвердити замовлення'}
        </Button>
      </form>
    </main>
  );
}
