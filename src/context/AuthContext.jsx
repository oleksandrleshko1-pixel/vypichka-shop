import { createContext, useCallback, useContext, useState } from 'react';
import usePost from '../hooks/usePost';
import { AUTH_API } from '../api/config';

const AuthContext = createContext(null);
const STORAGE_KEY = 'vypichka-auth';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveUser(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage недоступний — працюємо без збереження */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const loginRequest = usePost(`${AUTH_API}/auth/login`);
  const registerRequest = usePost(`${AUTH_API}/users/add`);

  const startSession = useCallback((nextUser) => {
    setUser(nextUser);
    saveUser(nextUser);
  }, []);

  // Вхід: POST /auth/login -> токен і дані користувача
  const login = useCallback(
    async (username, password) => {
      const data = await loginRequest.post({ username, password, expiresInMins: 60 });
      if (!data) return false;
      startSession({
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        token: data.accessToken ?? data.token,
      });
      return true;
    },
    [loginRequest.post, startSession]
  );

  // Реєстрація: POST /users/add. Тестовий сервер не зберігає акаунт,
  // тому після успішної відповіді одразу відкриваємо сесію.
  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await registerRequest.post({ firstName: name, email, username: email, password });
      if (!data) return false;
      startSession({ id: data.id, username: email, email, firstName: name, token: null });
      return true;
    },
    [registerRequest.post, startSession]
  );

  const logout = useCallback(() => startSession(null), [startSession]);

  const value = {
    user,
    login,
    register,
    logout,
    loginLoading: loginRequest.loading,
    loginError: loginRequest.error,
    registerLoading: registerRequest.loading,
    registerError: registerRequest.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth має використовуватись всередині AuthProvider');
  return ctx;
}
