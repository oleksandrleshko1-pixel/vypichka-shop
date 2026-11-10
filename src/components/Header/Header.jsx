import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import s from './Header.module.css';

export default function Header() {
  const { user } = useAuth();
  const { count } = useCart();

  return (
    <header className={s.header}>
      <NavLink to="/" className={s.logo}>
        Крафтова випічка
      </NavLink>
      <nav className={s.nav}>
        <NavLink to="/catalog">Каталог</NavLink>
        <NavLink to="/cart" className={s.pill}>
          Кошик · {count}
        </NavLink>
        <NavLink to="/auth" className={s.pill}>
          {user ? user.firstName || user.username : 'Профіль'}
        </NavLink>
      </nav>
    </header>
  );
}
