import { Link } from 'react-router-dom';
import s from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={s.page}>
      <div className={s.code}>404</div>
      <h1>Сторінку не знайдено</h1>
      <p>Схоже, такої сторінки не існує.</p>
      <Link to="/" className={s.link}>
        На головну
      </Link>
    </main>
  );
}
