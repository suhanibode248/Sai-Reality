import { useEffect, useRef, useState } from 'react';

export const CRM_API = 'http://localhost:8000/api/crm';

/**
 * Like useState for a list, but loaded from and saved to the local backend (backend/data/<name>.json).
 * The first time a collection is used it is created from `seed`.
 */
export default function useCrmCollection(name, seed) {
  const [items, setItems] = useState(seed);
  const loadedRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    loadedRef.current = false;
    fetch(`${CRM_API}/${name}`)
      .then(res => res.json())
      .then(data => {
        if (ignore) return;
        if (Array.isArray(data.data)) setItems(data.data);
        else setItems(prev => (prev.length ? [...prev] : prev)); // new collection: save the seed
        loadedRef.current = true;
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, [name]);

  useEffect(() => {
    if (!loadedRef.current) return;
    const timer = setTimeout(() => {
      fetch(`${CRM_API}/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      }).catch(() => {});
    }, 300);
    return () => clearTimeout(timer);
  }, [name, items]);

  return [items, setItems];
}
