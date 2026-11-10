import { createContext, useCallback, useContext, useState } from 'react';
import usePost from '../hooks/usePost';
import { LOGIN_API, REGISTER_API } from '../api/config';

const AuthContext = createContext(null);
const STORAGE_KEY = 'vypichka-auth-v2';

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
  const [user, setUser] = useState(readUser); // { id, name, email, token }
  const loginRequest = usePost(LOGIN_API);
  const registerRequest = usePost(REGISTER_API);

  const startSession = useCallback((nextUser) => {
    setUser(nextUser);
    saveUser(nextUser);
  }, []);

  // Вхід: POST /api/auth/login -> { user, token }
  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest.post({ email, password });
      if (!data) return false;
      startSession({ ...data.user, token: data.token });
      return true;
    },
    [loginRequest.post, startSession]
  );

  // Реєстрація: POST /api/auth/register -> { user, token }
  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await registerRequest.post({ name, email, password });
      if (!data) return false;
      startSession({ ...data.user, token: data.token });
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
