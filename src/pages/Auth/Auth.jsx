import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import s from './Auth.module.css';

export default function Auth() {
  return (
    <main className={s.wrap}>
      <section className={s.panel}>
        <h2>Вхід</h2>
        <Input type="email" placeholder="Електронна пошта" />
        <Input type="password" placeholder="Пароль" />
        <div className={s.row}>
          <label>
            <input type="checkbox" /> Запам'ятати мене
          </label>
          <a href="#">Забули пароль?</a>
        </div>
        <Button>Увійти</Button>
        <Button variant="outline">Увійти через Google</Button>
      </section>

      <section className={s.panel}>
        <h2>Реєстрація</h2>
        <Input placeholder="Ім'я" />
        <Input type="email" placeholder="Електронна пошта" />
        <Input type="password" placeholder="Пароль" />
        <Input type="password" placeholder="Повторіть пароль" />
        <label>
          <input type="checkbox" /> Погоджуюсь із правилами сайту
        </label>
        <Button variant="accent">Створити акаунт</Button>
      </section>
    </main>
  );
}
