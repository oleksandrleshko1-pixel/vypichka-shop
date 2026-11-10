import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import s from './Auth.module.css';

export default function Auth() {
  const { user, login, register, logout, loginLoading, loginError, registerLoading, registerError } =
    useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', repeat: '', agree: false });
  const [regFormError, setRegFormError] = useState('');

  if (user) {
    return (
      <main className={s.wrap}>
        <section className={s.panel}>
          <h2>Ви увійшли</h2>
          <p>
            Вітаємо, <strong>{user.firstName || user.username}</strong>!
          </p>
          {user.email && <p className={s.muted}>{user.email}</p>}
          <Button variant="outline" onClick={logout}>
            Вийти
          </Button>
        </section>
      </main>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await login(loginForm.username.trim(), loginForm.password);
    if (ok) navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegFormError('');
    if (!regForm.name.trim()) return setRegFormError("Вкажіть ім'я");
    if (!/^\S+@\S+\.\S+$/.test(regForm.email)) return setRegFormError('Вкажіть коректну пошту');
    if (regForm.password.length < 6) return setRegFormError('Пароль має містити щонайменше 6 символів');
    if (regForm.password !== regForm.repeat) return setRegFormError('Паролі не збігаються');
    if (!regForm.agree) return setRegFormError('Потрібна згода з правилами сайту');

    const ok = await register({
      name: regForm.name.trim(),
      email: regForm.email.trim(),
      password: regForm.password,
    });
    if (ok) navigate('/');
  };

  return (
    <main className={s.wrap}>
      <form className={s.panel} onSubmit={handleLogin}>
        <h2>Вхід</h2>
        <Input
          placeholder="Логін"
          value={loginForm.username}
          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        />
        <p className={s.muted}>
          Тестовий вхід: логін <b>emilys</b>, пароль <b>emilyspass</b>
        </p>
        {loginError && <p className={s.error}>{loginError}</p>}
        <Button type="submit" disabled={loginLoading}>
          {loginLoading ? 'Входимо…' : 'Увійти'}
        </Button>
      </form>

      <form className={s.panel} onSubmit={handleRegister}>
        <h2>Реєстрація</h2>
        <Input
          placeholder="Ім'я"
          value={regForm.name}
          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Електронна пошта"
          value={regForm.email}
          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={regForm.password}
          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Повторіть пароль"
          value={regForm.repeat}
          onChange={(e) => setRegForm({ ...regForm, repeat: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={regForm.agree}
            onChange={(e) => setRegForm({ ...regForm, agree: e.target.checked })}
          />{' '}
          Погоджуюсь із правилами сайту
        </label>
        {(regFormError || registerError) && <p className={s.error}>{regFormError || registerError}</p>}
        <Button variant="accent" type="submit" disabled={registerLoading}>
          {registerLoading ? 'Створюємо…' : 'Створити акаунт'}
        </Button>
      </form>
    </main>
  );
}
