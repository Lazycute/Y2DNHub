import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');

export async function api(path, { method = 'GET', body, token } = {}) {
  if (!API) throw new Error('Failed to fetch');
  const res = await fetch(`${API}/api${path}`, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function useList(path, fallback) {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    let alive = true;
    api(path).then((d) => alive && setItems(d)).catch(() => {});
    return () => { alive = false; };
  }, [path]);
  return items;
}
