import { useCallback, useState } from 'react';

// Надсилання даних на сервер (POST).
// post(body, token) повертає відповідь сервера або null, якщо сталася помилка.
export default function usePost(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = useCallback(
    async (body, token = null) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || `Помилка сервера: ${res.status}`);
        return data;
      } catch (err) {
        setError(
          err instanceof TypeError ? 'Сервер недоступний. Запустіть його: node server/index.js' : err.message
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { post, loading, error };
}
