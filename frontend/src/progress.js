// Синхронізація прогресу з бекендом (без входу, за анонімним ID пристрою).
const KEY = 'svitylnyk-v1';
const ID_KEY = 'synai-device-id';

function deviceId() {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

const url = (id) => `/api/progress?id=${encodeURIComponent(id)}`;

// Перед стартом: якщо на сервері є свіжіший прогрес — кладемо його в localStorage.
export async function pullProgress() {
  const id = deviceId();
  if (!id) return;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch(url(id), { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return;
    const { data, updatedAt } = await r.json();
    if (!data) return;
    const localAt = Number(localStorage.getItem(KEY + ':at') || 0);
    if (updatedAt > localAt) {
      localStorage.setItem(KEY, JSON.stringify(data));
      localStorage.setItem(KEY + ':at', String(updatedAt));
    }
  } catch {
    /* офлайн або бекенд недоступний: працюємо з localStorage */
  }
}

let timer;
// Викликається застосунком після кожного save(); відправка з паузою 1.5 с.
export function installSync() {
  window.__syncProgress = (state) => {
    const id = deviceId();
    if (!id) return;
    const at = Date.now();
    try { localStorage.setItem(KEY + ':at', String(at)); } catch {}
    clearTimeout(timer);
    timer = setTimeout(() => {
      fetch(url(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state, updatedAt: at }),
        keepalive: true,
      }).catch(() => {});
    }, 1500);
  };
}
