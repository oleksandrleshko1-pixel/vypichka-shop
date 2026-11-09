import { NavLink } from 'react-router-dom';
import s from './Header.module.css';

export default function Header() {
  return (
    <header className={s.header}>
      <NavLink to="/" className={s.logo}>
        Крафтова випічка
      </NavLink>
      <nav className={s.nav}>
        <NavLink to="/catalog">Каталог</NavLink>
        <NavLink to="/cart" className={s.pill}>
          Кошик · 2
        </NavLink>
        <NavLink to="/auth" className={s.pill}>
          Профіль
        </NavLink>
      </nav>
    </header>
  );
}
