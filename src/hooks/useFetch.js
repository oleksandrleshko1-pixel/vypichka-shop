import { useEffect, useState } from 'react';

// Отримання даних із сервера (GET). Повертає { data, loading, error }.
// Якщо передано token — додається заголовок Authorization.
export default function useFetch(url, token = null) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(url, { signal: controller.signal, headers })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.message || `Помилка сервера: ${res.status}`);
        return body;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const message =
          err instanceof TypeError ? 'Сервер недоступний. Запустіть його: node server/index.js' : err.message;
        setState({ data: null, loading: false, error: message });
      });

    return () => controller.abort();
  }, [url, token]);

  return state;
}
