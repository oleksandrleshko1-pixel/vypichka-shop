import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import s from './Cart.module.css';

const items = [
  { emoji: '🎂', title: 'Торт за вашим складом', desc: 'Ванільний, малина, 1,5 кг', price: 720 },
  { emoji: '🥐', title: 'Круасан з мигдалем', desc: '2 шт.', price: 130 },
];

export default function Cart() {
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <main className={s.page}>
      <section>
        <h2>Ваше замовлення</h2>
        {items.map((i) => (
          <div key={i.title} className={s.item}>
            <div className={s.thumb}>{i.emoji}</div>
            <div className={s.info}>
              <strong>{i.title}</strong>
              <span>{i.desc}</span>
            </div>
            <strong>{i.price} ₴</strong>
          </div>
        ))}
        <div className={s.total}>
          <strong>Разом</strong>
          <strong>{total} ₴</strong>
        </div>
      </section>

      <section className={s.form}>
        <h3>Дані для доставки</h3>
        <Input placeholder="Ім'я" />
        <Input type="tel" placeholder="Телефон" />
        <div className={s.toggle}>
          <Button variant="outline" type="button">
            Доставка
          </Button>
          <Button variant="outline" type="button">
            Самовивіз
          </Button>
        </div>
        <Input placeholder="Адреса" />
        <Input placeholder="Дата й час" />
        <Input placeholder="Коментар до замовлення" />
        <Button>Підтвердити замовлення</Button>
      </section>
    </main>
  );
}
